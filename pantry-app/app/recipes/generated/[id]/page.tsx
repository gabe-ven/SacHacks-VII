"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import RecipeSteps from "@/components/recipes/RecipeSteps";
import RecipeImage from "@/components/recipes/RecipeImage";
import type { Recipe } from "@/types/recipe";

const STORAGE_KEY = "pantry_ai_recipes";
const BACK_KEY = "pantry_ai_recipes_back";

export default function GeneratedRecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [backHref, setBackHref] = useState("/recipes");

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY) : null;
      const back = typeof window !== "undefined" ? window.sessionStorage.getItem(BACK_KEY) : null;
      if (back) setBackHref(back.startsWith("?") ? `/recipes${back}` : `/recipes?${back}`);

      if (!raw) {
        router.replace("/recipes");
        return;
      }
      const list: Recipe[] = JSON.parse(raw);
      const found = list.find((r) => r.id === id);
      if (!found) {
        router.replace("/recipes");
        return;
      }
      setRecipe(found);
    } catch {
      router.replace("/recipes");
    } finally {
      setLoaded(true);
    }
  }, [id, router]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  if (!recipe) return null;

  const difficultyStyle =
    recipe.difficulty === "Easy"
      ? "bg-pantry-green/15 text-pantry-green-dark border-pantry-green/25"
      : recipe.difficulty === "Medium"
      ? "bg-pantry-amber/15 text-pantry-amber-dark border-pantry-amber/25"
      : "bg-pantry-coral/15 text-pantry-coral-dark border-pantry-coral/25";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Back link — same as /recipes/[id] */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to recipes
        </Link>

        {/* Recipe info — clean, no box */}
        <div className="space-y-4">
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

        {/* Hero image */}
        <div className="w-full h-56 sm:h-80 rounded-2xl overflow-hidden relative bg-pantry-green/10">
          <RecipeImage
            src={recipe.image}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover"
            large
          />
        </div>

        {/* Two-column layout — clean, no boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_300px] gap-10 items-start">

          <div className="space-y-12">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-10">Instructions</h2>
              <RecipeSteps steps={recipe.instructions} />
            </section>

            {recipe.substitutions.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-4">Inventory substitutions</h2>
                <ul className="space-y-2.5">
                  {recipe.substitutions.map((sub, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-foreground/80 leading-relaxed">
                      <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-pantry-amber/80" />
                      {sub}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="sm:pt-0 pt-2 sm:border-l sm:border-border sm:pl-10 sticky top-6 space-y-8">
            <div className="pb-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">Ingredients</h2>
              <p className="text-sm text-muted mt-0.5 tabular-nums">{recipe.ingredients.length} items</p>
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
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-pantry-green">What I have</p>
                      <ul className="space-y-3">
                        {have.map((ing, i) => (
                          <li key={`have-${i}`} className="flex items-start gap-3 text-sm leading-relaxed text-pantry-green font-medium">
                            <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-pantry-green" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {need.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">What I still need</p>
                      <ul className="space-y-3">
                        {need.map((ing, i) => (
                          <li key={`need-${i}`} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/75">
                            <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-border" />
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
