import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Types ──────────────────────────────────────────────────────────────────

/** Shape returned by OpenAI — no `id` yet, that's added before sending to the client. */
type OpenAIRecipe = {
  name: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  haveIngredients: string[];
  needIngredients: string[];
  steps: string[];
};

type OpenAIResponse = {
  recipes: OpenAIRecipe[];
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatInstructions(recipe: OpenAIRecipe): string {
  const all = [...recipe.haveIngredients, ...recipe.needIngredients].join("\n");
  const steps = recipe.steps.join("\n");
  return `First get: ${all}\nThen ${steps}\n`;
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

function findIngredientId(name: string, ingredientMap: Map<string, string>): string | null {
  const lower = normalize(name);
  for (const [dbName, id] of ingredientMap) {
    const db = normalize(dbName);
    if (lower.includes(db) || db.includes(lower)) return id;
  }
  return null;
}

/** Generates an image for the recipe using DALL·E 3. Returns URL or "" on error. */
async function generateRecipeImage(recipeName: string, ingredients: string[]): Promise<string> {
  try {
    const shortList = ingredients.slice(0, 5).join(", ");
    const prompt = `Appetizing, well-lit photo of "${recipeName}"${shortList ? ` with ${shortList}` : ""}. Home cooking style, single dish on a plate or in a bowl, no text, photorealistic.`;
    const resp = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });
    const url = resp.data?.[0]?.url;
    return typeof url === "string" ? url : "";
  } catch {
    return "";
  }
}

// ── POST /api/generate-recipes ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: string[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Filter out non-food items for the prompt
    const foodItems = items.filter((item) =>
      !/(pad|tampon|shampoo|toothpaste|soap|hygiene|lotion|deodorant)/i.test(item)
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a practical college meal assistant for UC Davis students using The Pantry food bank.
Your job is to suggest REAL, COMPLETE, DELICIOUS recipes that feature the student's selected ingredients.

Rules:
- Generate as many distinct recipes as you can (aim for 5–6) — more variety is better.
- Each recipe MUST prominently use at least 1–2 of the student's selected ingredients.
- Make them REAL complete recipes with proper names — not just "toast with avocado" but "Smashed Avocado Toast with Chili Flakes", etc.
- In "haveIngredients" list the selected items used in this recipe (with quantities).
- In "needIngredients" list any additional common ingredients needed (salt, pepper, garlic, butter, lemon, oil, etc.) that a student would easily find or buy cheap. Keep it short and practical.
- Steps should be clear and beginner-friendly (4–6 steps each).

Respond ONLY with valid JSON:
{
  "recipes": [
    {
      "name": "Recipe name",
      "cookTime": "X min",
      "difficulty": "Easy" | "Medium" | "Hard",
      "haveIngredients": ["1 ripe avocado", "2 slices bread"],
      "needIngredients": ["1 egg", "salt and pepper", "red pepper flakes"],
      "steps": ["Step 1.", "Step 2.", "Step 3."]
    }
  ]
}`,
        },
        {
          role: "user",
          content: `I picked up these food items from the UC Davis Pantry:\n${foodItems.join(", ")}\n\nSuggest as many real complete recipes as you can (aim for 5–6). Use these as the main ingredients and tell me what else I need.`,
        },
      ],
    });

    const raw = completion.choices[0].message.content ?? "{}";
    const parsed: OpenAIResponse = JSON.parse(raw);
    const generated = parsed.recipes ?? [];

    if (generated.length === 0) {
      return NextResponse.json({ error: "No recipes returned" }, { status: 500 });
    }

    const images = await Promise.all(
      generated.map((r) =>
        generateRecipeImage(r.name, [...r.haveIngredients, ...r.needIngredients])
      )
    );

    const recipesForClient = generated.map((r, i) => ({
      ...r,
      id: -(i + 1),
      image_url: images[i] ?? "",
    }));

    // Attempt background save — silently ignored if RLS blocks it
    persistToSupabase(generated, items).catch(() => {});

    return NextResponse.json({ recipes: recipesForClient });
  } catch (err) {
    console.error("generate-recipes error:", err);
    return NextResponse.json({ error: "Failed to generate recipes" }, { status: 500 });
  }
}
async function persistToSupabase(generated: OpenAIRecipe[], selectedItems: string[]) {
  const { data: allIngredients } = await supabase.from("ingredients").select("id, name");

  const ingredientMap = new Map<string, string>(
    (allIngredients ?? []).map((i: { id: string; name: string }) => [i.name, i.id])
  );

  for (const recipe of generated) {
    const { data: inserted, error } = await supabase
      .from("recipes")
      .insert({ name: recipe.name, instructions: formatInstructions(recipe) })
      .select("id")
      .single();

    if (error || !inserted) continue;

    const links = selectedItems
      .map((itemName) => {
        const id = findIngredientId(itemName, ingredientMap);
        return id ? { recipe_id: inserted.id, ingredient_id: id } : null;
      })
      .filter(Boolean);

    if (links.length > 0) {
      await supabase.from("recipe_ingredient").insert(links).then(() => {});
    }
  }
}

