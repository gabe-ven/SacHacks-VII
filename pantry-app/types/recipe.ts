export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  /** Subset of ingredients available at the ASUCD Pantry */
  pantryIngredients: string[];
  instructions: string[];
  substitutions: string[];
}
