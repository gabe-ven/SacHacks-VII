"use server";

import type { Recipe } from "@/types/recipe";
import { mockRecipes } from "@/lib/mockRecipes";

export async function generateRecipes(ingredients: string[]): Promise<Recipe[]> {
  // TODO: replace with real AI call (e.g. OpenAI)
  console.log("Generating recipes for:", ingredients);
  return mockRecipes;
}
