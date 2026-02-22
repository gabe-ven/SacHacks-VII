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

/** Return true if this ingredient string matches one of the user's selected items. */
function matchesSelected(ingredientStr: string, selectedItems: string[]): boolean {
  const norm = normalize(ingredientStr);
  if (!norm) return false;
  for (const selected of selectedItems) {
    const selNorm = normalize(selected);
    if (!selNorm) continue;
    if (norm.includes(selNorm) || selNorm.includes(norm)) return true;
  }
  return false;
}

/** Ensure haveIngredients only contains items that match the user's selection; move the rest to needIngredients. */
function filterHaveIngredientsToSelectedOnly(
  recipe: GeneratedRecipe,
  selectedItems: string[]
): GeneratedRecipe {
  const have: string[] = [];
  const movedToNeed: string[] = [];
  for (const ing of recipe.haveIngredients) {
    if (matchesSelected(ing, selectedItems)) {
      have.push(ing);
    } else {
      movedToNeed.push(ing);
    }
  }
  return {
    ...recipe,
    haveIngredients: have,
    needIngredients: [...movedToNeed, ...recipe.needIngredients],
  };
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

CRITICAL RULES:
- "haveIngredients" must contain ONLY ingredients from the student's list below. You may add quantities (e.g. "1 apple", "2 tablespoons peanut butter") but do NOT add bread, eggs, butter, oil, salt, or any item the student did not list. If a recipe normally needs bread but the student did not pick bread, put bread in "needIngredients" instead.
- "needIngredients" = everything else needed for the recipe that the student did NOT pick (bread, eggs, oil, salt, spices, etc.).
- Each recipe must use at least 1–2 of the student's selected ingredients; list only those in haveIngredients.
- Generate 5–6 distinct recipes. Make them real complete recipes with proper names.
- Steps: 4–6 clear, beginner-friendly steps.

Respond ONLY with valid JSON:
{
  "recipes": [
    {
      "name": "Recipe name",
      "cookTime": "X min",
      "difficulty": "Easy" | "Medium" | "Hard",
      "haveIngredients": ["only items from student list with quantities"],
      "needIngredients": ["everything else needed"],
      "steps": ["Step 1.", "Step 2."]
    }
  ]
}`,
        },
        {
          role: "user",
          content: `These are the ONLY items I have (do not put anything else in haveIngredients):\n${foodItems.join("\n")}\n\nSuggest 5–6 real recipes using these. For each recipe, haveIngredients = only items from the list above (with quantities). needIngredients = everything else I need to get.`,
        },
      ],
    });

    const raw = completion.choices[0].message.content ?? "{}";
    const parsed: OpenAIResponse = JSON.parse(raw);
    const generated = (parsed.recipes ?? []).map((r: GeneratedRecipe) =>
      filterHaveIngredientsToSelectedOnly(r, foodItems)
    );

    if (generated.length === 0) {
      return NextResponse.json({ error: "OpenAI returned no recipes" }, { status: 500 });
    }

    const recipesForClient = generated.map((r, i) => ({ ...r, id: -(i + 1) }));

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
