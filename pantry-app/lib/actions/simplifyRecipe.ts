"use server";

import type { Recipe } from "@/types/recipe";

export async function simplifyRecipe(recipe: Recipe): Promise<Recipe> {
  // TODO: replace with real AI call
  return {
    ...recipe,
    instructions: recipe.instructions.slice(0, 2).map((s) => `(Simplified) ${s}`),
  };
}
