/**
 * getRecipes.ts
 *
 * Fetches recipes from the Supabase `recipes` table.
 *
 * ── TEMPORARY ────────────────────────────────────────────────────────────────
 * The `recipes` table does not exist in the database yet.
 * Until it does, this module falls back to the hardcoded pantryRecipes data so
 * the UI works end-to-end.  Once the table is created and seeded, remove the
 * try/catch fallback and the import of pantryRecipes below.
 *
 * Expected Supabase table schema (`recipes`):
 *
 *   id                  text        PRIMARY KEY  -- human-readable slug, e.g. "pasta-cobb-salad"
 *   title               text        NOT NULL
 *   image               text        DEFAULT ''
 *   cook_time           text        NOT NULL
 *   difficulty          text        NOT NULL     -- 'Easy' | 'Medium' | 'Hard'
 *   ingredients         text[]      NOT NULL DEFAULT '{}'
 *   pantry_ingredients  text[]      NOT NULL DEFAULT '{}'
 *   instructions        text[]      NOT NULL DEFAULT '{}'
 *   substitutions       text[]      NOT NULL DEFAULT '{}'
 *   created_at          timestamptz DEFAULT now()
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { supabase } from "@/lib/supabase";
import { pantryRecipes } from "@/lib/pantryRecipes";
import type { Recipe } from "@/types/recipe";

// ── Row shape returned by Supabase ──────────────────────────────────────────
interface RecipeRow {
  id: string;
  title: string;
  image: string | null;
  cook_time: string;
  difficulty: string;
  ingredients: string[];
  pantry_ingredients: string[];
  instructions: string[];
  substitutions: string[];
}

function rowToRecipe(row: RecipeRow): Recipe {
  return {
    id: row.id,
    title: row.title,
    image: row.image ?? "",
    cookTime: row.cook_time,
    difficulty: row.difficulty as Recipe["difficulty"],
    ingredients: row.ingredients ?? [],
    pantryIngredients: row.pantry_ingredients ?? [],
    instructions: row.instructions ?? [],
    substitutions: row.substitutions ?? [],
  };
}

/**
 * Returns all recipes.
 * Falls back to the local pantryRecipes dataset while the Supabase table
 * is not yet available.
 */
export async function getRecipes(): Promise<Recipe[]> {
  // TEMPORARY: remove this try/catch once the recipes table is live
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        "id, title, image, cook_time, difficulty, ingredients, pantry_ingredients, instructions, substitutions"
      )
      .order("title", { ascending: true });

    if (error) {
      // Table likely doesn't exist yet — fall back to local data
      console.warn("[getRecipes] Supabase error, using local fallback:", error.message);
      return pantryRecipes;
    }

    if (!data || data.length === 0) {
      // Table exists but is empty — fall back so the UI isn't blank
      return pantryRecipes;
    }

    return (data as RecipeRow[]).map(rowToRecipe);
  } catch {
    return pantryRecipes;
  }
}

/**
 * Returns a single recipe by its slug ID.
 * Falls back to the local dataset if needed.
 */
export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        "id, title, image, cook_time, difficulty, ingredients, pantry_ingredients, instructions, substitutions"
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return pantryRecipes.find((r) => r.id === id);
    }

    return rowToRecipe(data as RecipeRow);
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
