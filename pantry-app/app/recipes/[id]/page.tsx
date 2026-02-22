import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/lib/getRecipes";
import RecipeSteps from "@/components/recipes/RecipeSteps";

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
      ? "bg-pantry-green/12 text-pantry-green-dark border-pantry-green/20"
      : recipe.difficulty === "Medium"
        ? "bg-pantry-teal/15 text-pantry-teal border-pantry-teal/20"
        : "bg-pantry-coral/12 text-pantry-coral-dark border-pantry-coral/20";

  return (
    <div className="min-h-screen bg-pantry-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Back link */}
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1.5 text-sm text-pantry-brown/60 hover:text-pantry-green transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to recipes
        </Link>

        {/* Title block */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyStyle}`}>
              {recipe.difficulty}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-pantry-brown/60 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
              </svg>
              {recipe.cookTime}
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl text-foreground leading-tight"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            {recipe.title}
          </h1>
        </div>

        {/* Hero image */}
        <div className="w-full aspect-square sm:aspect-[4/3] rounded-3xl bg-pantry-green overflow-hidden flex items-center justify-center relative">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div aria-hidden="true" className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-pantry-amber/20 blur-2xl" />
              <svg
                className="w-14 h-14 text-pantry-cream/25 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7.8-5 12a5 5 0 0010 0c0-4.2-3.8-6.6-5-12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M9 9.5c-.5 1 .5 2 1.5 2" />
              </svg>
            </>
          )}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-8 items-start">

          {/* Left: instructions + substitutions */}
          <div className="space-y-8">

            <section className="space-y-4">
              <h2 className="text-base font-semibold text-foreground tracking-tight">Instructions</h2>
              <RecipeSteps steps={recipe.instructions} />
            </section>

            {recipe.substitutions.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-foreground tracking-tight">Pantry substitutions</h2>
                <div className="rounded-2xl border border-pantry-amber/30 bg-pantry-yellow/15 p-5 space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-pantry-amber-dark mb-3">
                    Swap suggestions
                  </p>
                  {recipe.substitutions.map((sub, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-foreground/70">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-pantry-amber-dark" />
                      {sub}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: ingredients sidebar */}
          <aside>
            <div className="rounded-2xl border border-pantry-tan bg-white/70 p-5 space-y-3 sticky top-6">
              <div className="flex items-baseline gap-2">
                <h2 className="text-sm font-semibold text-foreground">Ingredients</h2>
                <span className="text-xs text-pantry-brown/50">{recipe.ingredients.length} items</span>
              </div>

              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => {
                  const isPantry = recipe.pantryIngredients.some(
                    (pi) =>
                      ing.toLowerCase().includes(pi.toLowerCase()) ||
                      pi.toLowerCase().includes(ing.split(" ").slice(-1)[0].toLowerCase())
                  );
                  return (
                    <li key={i} className={`flex items-start gap-2 text-xs leading-snug ${isPantry ? "text-pantry-green-dark font-semibold" : "text-foreground/65"}`}>
                      <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${isPantry ? "bg-pantry-green" : "bg-pantry-tan-mid"}`} />
                      {ing}
                    </li>
                  );
                })}
              </ul>

              {recipe.pantryIngredients.length > 0 && (
                <div className="pt-2 border-t border-pantry-tan/60 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pantry-green shrink-0" />
                  <p className="text-[10px] text-pantry-brown/50">Available at the Pantry</p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Warm footer nudge */}
        <div className="rounded-2xl bg-pantry-green/8 border border-pantry-green/15 px-6 py-4 text-sm text-pantry-green-dark text-center">
          Remember — all students get <strong>3 points per day</strong> at the Pantry. Just swipe your UC Davis ID, no questions asked.
        </div>
      </div>
    </div>
  );
}
