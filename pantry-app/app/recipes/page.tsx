import { supabase } from '@/lib/supabase'

type Props = {
  searchParams: Promise<{ items?: string }>;
};

export default async function RecipesPage({ searchParams }: Props) {
  const { items } = await searchParams;
  const ids = items?.split(",").filter(Boolean) ?? [];
  // fetch recipes that use ANY selected ingredient
  const { data, error } = await supabase
    .from("recipe_ingredient")
    .select(`
  recipes (
    id,
    name,
    instructions
  )
`)
    .in("ingredient_id", ids);

  if (error) {
    console.error(error);
  }

  type RecipeRow = { id: string; name: string; instructions: string };
  type JoinRow = { recipes: RecipeRow | null };

  // remove duplicates
  const recipes: RecipeRow[] = data
    ? Array.from(
      new Map(
        (data as unknown as JoinRow[])
          .map(row => row.recipes)
          .filter((r): r is RecipeRow => r !== null)
          .map(r => [r.id, r])
      ).values()
    )
    : [];


  return (
    <div style={{ padding: 20 }}>
      <h1>Recommended Recipes</h1>

      {recipes.length === 0 && (
        <p>No recipes found.</p>
      )}

      {recipes.map(recipe => (
        <div key={recipe.id} style={{ marginBottom: 20 }}>
          <h2>{recipe.name}</h2>
          <p>{recipe.instructions}</p>
        </div>
      ))}
    </div>
  )
}