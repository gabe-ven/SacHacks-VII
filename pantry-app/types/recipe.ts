export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  instructions: string[];
  substitutions: string[];
}
