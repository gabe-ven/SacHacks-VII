import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/lib/getRecipes";
import RecipeSteps from "@/components/recipes/RecipeSteps";
import RecipeImage from "@/components/recipes/RecipeImage";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipeById(id);
  if (!recipe) notFound();

  const difficultyStyle =
    recipe.difficulty === "Easy"
      ? "bg-pantry-green/15 text-pantry-green-dark border-pantry-green/25"
      : recipe.difficulty === "Medium"
        ? "bg-pantry-amber/15 text-pantry-amber-dark border-pantry-amber/25"
        : "bg-pantry-coral/15 text-pantry-coral-dark border-pantry-coral/25";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Back link */}
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to recipes
        </Link>

        {/* Hero image — full size */}
        <div className="w-full h-56 sm:h-80 rounded-2xl overflow-hidden relative bg-pantry-green/10">
          <RecipeImage
            src={recipe.image}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover"
            large
          />
        </div>

        {/* Recipe info — below image */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${difficultyStyle}`}>
              {recipe.difficulty}
            </span>
            <span className="flex items-center gap-2 text-sm text-muted font-medium">
              <svg className="w-5 h-5 text-pantry-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
              </svg>
              {recipe.cookTime}
            </span>
            <span className="text-sm text-muted">
              {recipe.ingredients.length} ingredients
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {recipe.title}
          </h1>
        </div>

        {/* Two-column layout — compact for high efficiency */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-6 sm:gap-8 items-start">

          {/* Left: instructions + substitutions */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Instructions</h2>
              <div className="pt-6">
                <RecipeSteps steps={recipe.instructions} />
              </div>
            </section>

            {recipe.substitutions.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Substitutions</h2>
                <ul className="space-y-1.5">
                  {recipe.substitutions.map((sub, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 leading-snug">
                      <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-pantry-amber/80" />
                      {sub}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right: ingredients — compact list */}
          <aside className="sm:pt-0 pt-4 sm:border-l sm:border-border sm:pl-6 sticky top-6 space-y-4">
            <div className="pb-2 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Ingredients</h2>
              <p className="text-xs text-muted tabular-nums mt-0.5">{recipe.ingredients.length} items</p>
            </div>

            {(() => {
              const isPantry = (ing: string) =>
                recipe.pantryIngredients.some(
                  (pi) =>
                    ing.toLowerCase().includes(pi.toLowerCase()) ||
                    pi.toLowerCase().includes(ing.split(" ").slice(-1)[0]?.toLowerCase() ?? "")
                );
              const have = recipe.ingredients.filter(isPantry);
              const need = recipe.ingredients.filter((ing) => !isPantry(ing));
              return (
                <>
                  {have.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-pantry-green">Have</p>
                      <ul className="space-y-1.5">
                        {have.map((ing, i) => (
                          <li key={`have-${i}`} className="flex items-start gap-2 text-sm leading-snug text-pantry-green font-medium">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-pantry-green" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {need.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Need</p>
                      <ul className="space-y-1.5">
                        {need.map((ing, i) => (
                          <li key={`need-${i}`} className="flex items-start gap-2 text-sm leading-snug text-foreground/75">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-border" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              );
            })()}
          </aside>
        </div>


      </div>
    </div>
  );
}
