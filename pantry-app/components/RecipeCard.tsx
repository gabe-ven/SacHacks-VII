import Link from "next/link";
import type { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="border rounded-lg p-4 hover:shadow-md block">
      <div className="bg-gray-100 h-32 rounded mb-3 flex items-center justify-center text-gray-400">
        No image
      </div>
      <h3 className="font-semibold text-lg">{recipe.title}</h3>
      <p className="text-sm text-gray-500">{recipe.cookTime} · {recipe.difficulty}</p>
    </Link>
  );
}
