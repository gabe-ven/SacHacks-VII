import { supabase } from "@/lib/supabase";
import type { Recipe } from "@/types/recipe";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * The instructions field is formatted as:
 *   "First get: ingredient1\ningredient2\n...\nThen step1\nstep2\n..."
 *
 * This splits out just the steps after "Then ".
 */
function parseSteps(instructions: string): string[] {
  const thenIdx = instructions.indexOf("Then ");
  if (thenIdx === -1) return [instructions.trim()].filter(Boolean);
  return instructions
    .slice(thenIdx + 5)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Extracts the raw ingredient lines from the "First get:" section.
 */
function parseIngredientLines(instructions: string): string[] {
  const getIdx = instructions.indexOf("First get:");
  const thenIdx = instructions.indexOf("Then ");
  if (getIdx === -1) return [];
  const end = thenIdx === -1 ? instructions.length : thenIdx;
  return instructions
    .slice(getIdx + 10, end)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getRecipes(): Promise<Recipe[]> {
  const [{ data: recipes, error: rErr }, { data: riRows, error: riErr }] =
    await Promise.all([
      supabase.from("recipes").select("id, name, instructions").order("name"),
      supabase
        .from("recipe_ingredient")
        .select("recipe_id, ingredient:ingredients(id, name)"),
    ]);

  if (rErr) throw new Error(rErr.message);
  if (riErr) throw new Error(riErr.message);

  // Build recipe_id → ingredient names map
  const pantryMap = new Map<number, string[]>();
  for (const row of riRows ?? []) {
    const recipeId = row.recipe_id as number;
    const ingName = (row.ingredient as { name: string } | null)?.name;
    if (!ingName) continue;
    if (!pantryMap.has(recipeId)) pantryMap.set(recipeId, []);
    pantryMap.get(recipeId)!.push(ingName);
  }

  return (recipes ?? []).map((r) => {
    const id = r.id as number;
    const instructions = r.instructions as string;
    return {
      id: String(id),
      title: r.name as string,
      image: "",
      cookTime: "",
      difficulty: "Easy" as const,
      ingredients: parseIngredientLines(instructions),
      pantryIngredients: pantryMap.get(id) ?? [],
      instructions: parseSteps(instructions),
      substitutions: [],
    };
  });
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const [{ data: recipe, error: rErr }, { data: riRows, error: riErr }] =
    await Promise.all([
      supabase
        .from("recipes")
        .select("id, name, instructions")
        .eq("id", Number(id))
        .maybeSingle(),
      supabase
        .from("recipe_ingredient")
        .select("ingredient:ingredients(id, name)")
        .eq("recipe_id", Number(id)),
    ]);

  if (rErr) throw new Error(rErr.message);
  if (riErr) throw new Error(riErr.message);
  if (!recipe) return undefined;

  const instructions = recipe.instructions as string;
  const pantryIngredients = (riRows ?? [])
    .map((row) => (row.ingredient as { name: string } | null)?.name)
    .filter((n): n is string => Boolean(n));

  return {
    id: String(recipe.id),
    title: recipe.name as string,
    image: "",
    cookTime: "",
    difficulty: "Easy" as const,
    ingredients: parseIngredientLines(instructions),
    pantryIngredients,
    instructions: parseSteps(instructions),
    substitutions: [],
  };
}

/**
 * Scores a recipe 0–100 based on how many of its pantry ingredients
 * the user has selected. Uses fuzzy matching to handle partial names.
 */
export function scoreRecipe(recipe: Recipe, userIngredients: string[]): number {
  if (userIngredients.length === 0 || recipe.pantryIngredients.length === 0)
    return 0;
  const normalized = userIngredients.map((i) => i.toLowerCase());
  const matches = recipe.pantryIngredients.filter((pi) =>
    normalized.some(
      (ui) => pi.toLowerCase().includes(ui) || ui.includes(pi.toLowerCase())
    )
  );
  return Math.round((matches.length / recipe.pantryIngredients.length) * 100);
}
