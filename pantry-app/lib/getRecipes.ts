/**
 * getRecipes.ts
 *
 * Fetches recipes from the live Supabase tables:
 *
 *   recipes            – id (int), name (text), instructions (text)
 *   recipe_ingredient  – id, recipe_id (int), ingredient_id (uuid)
 *   ingredients        – id (uuid), name (text), …
 *
 * Instructions are stored as a single text blob in the format:
 *   "First get: <ingredient lines>\nThen <instruction lines>"
 *
 * Falls back to the hardcoded pantryRecipes data on any error.
 */

import { supabase } from "@/lib/supabase";
import { pantryRecipes } from "@/lib/pantryRecipes";
import type { Recipe } from "@/types/recipe";

// ── Row shapes ──────────────────────────────────────────────────────────────

interface LiveRecipeRow {
  id: number;
  name: string;
  instructions: string;
  image_url?: string | null;
  cook_time?: string | null;
  difficulty?: string | null;
  recipe_ingredient: Array<{
    ingredient: { id: string; name: string } | null;
  }>;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parses the "First get: …\nThen …" instruction blob into
 * a list of ingredient lines and a list of instruction steps.
 */
function parseInstructions(raw: string): {
  ingredients: string[];
  steps: string[];
} {
  const thenIdx = raw.indexOf("Then ");
  if (thenIdx === -1) {
    return {
      ingredients: [],
      steps: raw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }

  const ingredientBlock = raw.slice(0, thenIdx);
  const stepsBlock = raw.slice(thenIdx + 5);

  const ingredients = ingredientBlock
    .replace(/^First get:\s*/i, "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const steps = stepsBlock
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return { ingredients, steps };
}

function rowToRecipe(row: LiveRecipeRow): Recipe {
  const { ingredients, steps } = parseInstructions(row.instructions ?? "");

  const pantryIngredients = (row.recipe_ingredient ?? [])
    .map((ri) => ri.ingredient?.name)
    .filter((n): n is string => Boolean(n));

  const rawDifficulty = row.difficulty ?? "Medium";
  const difficulty: Recipe["difficulty"] =
    rawDifficulty === "Easy" || rawDifficulty === "Hard" ? rawDifficulty : "Medium";

  return {
    id: String(row.id),
    title: row.name,
    image: row.image_url ?? "",
    cookTime: row.cook_time ?? "N/A",
    difficulty,
    ingredients,
    pantryIngredients,
    instructions: steps,
    substitutions: [],
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Returns all recipes, falling back to local data on error. */
export async function getRecipes(): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        "id, name, instructions, image_url, cook_time, difficulty, recipe_ingredient(ingredient:ingredients(id, name))"
      )
      .order("name", { ascending: true });

    if (error) {
      console.warn("[getRecipes] Supabase error, using local fallback:", error.message);
      return pantryRecipes;
    }

    if (!data || data.length === 0) {
      console.warn("[getRecipes] No rows returned, using local fallback.");
      return pantryRecipes;
    }

    return (data as unknown as LiveRecipeRow[]).map(rowToRecipe);
  } catch (err) {
    console.error("[getRecipes] Unexpected error:", err);
    return pantryRecipes;
  }
}

/** Returns a single recipe by ID (integer string or slug), falling back to local data. */
export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  try {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return pantryRecipes.find((r) => r.id === id);
    }

    const { data, error } = await supabase
      .from("recipes")
      .select(
        "id, name, instructions, image_url, cook_time, difficulty, recipe_ingredient(ingredient:ingredients(id, name))"
      )
      .eq("id", numericId)
      .maybeSingle();

    if (error || !data) {
      return pantryRecipes.find((r) => r.id === id);
    }

    return rowToRecipe(data as unknown as LiveRecipeRow);
  } catch {
    return pantryRecipes.find((r) => r.id === id);
  }
}

/**
 * Scores how well a recipe matches a set of user-selected ingredient names.
 * Returns a value 0–100 (percentage of the recipe's pantry ingredients covered).
 */
export function scoreRecipe(recipe: Recipe, userIngredients: string[]): number {
  if (userIngredients.length === 0 || recipe.pantryIngredients.length === 0)
    return 0;
  const normalized = userIngredients.map((i) => i.toLowerCase());
  const matches = recipe.pantryIngredients.filter((pi) =>
    normalized.some(
      (ui) =>
        pi.toLowerCase().includes(ui) || ui.includes(pi.toLowerCase())
    )
  );
  return Math.round((matches.length / recipe.pantryIngredients.length) * 100);
}
