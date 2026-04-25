"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getIngredientNames, getInventory } from "@/lib/getInventory";
import { getRecipes, scoreRecipe } from "@/lib/getRecipes";
import type { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeFilters, { type SortKey } from "@/components/recipes/RecipeFilters";
import { RecipeCardGrid, RecipeCardItem } from "@/components/landing/animations";

type ScoredRecipe = Recipe & { matchScore: number };

function cookTimeMinutes(t: string): number {
  if (!t || t === "N/A") return Infinity;
  const m = t.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : Infinity;
}

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border overflow-hidden bg-surface-card animate-pulse">
          <div className="h-40 bg-border/40" />
          <div className="p-4 space-y-3">
            <div className="h-3.5 rounded-full w-3/4 bg-border" />
            <div className="h-3 rounded-full w-1/2 bg-border/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// ── Browse all recipes (no selection) ────────────────────────────────────────
function BrowseRecipes({ dbIngredientNames }: { dbIngredientNames: string[] }) {
  const [recipes, setRecipes] = useState<ScoredRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("alpha");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    getRecipes()
      .then((all) => setRecipes(all.map((r) => ({ ...r, matchScore: 0 }))))
      .finally(() => setLoading(false));
  }, []);

  const displayed = useMemo(() => {
    let list = recipes;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) => r.title.toLowerCase().includes(q) || r.ingredients.some((i) => i.toLowerCase().includes(q))
      );
    }
    if (difficulty !== "All") list = list.filter((r) => r.difficulty === difficulty);
    return [...list].sort((a, b) =>
      sortKey === "time" ? cookTimeMinutes(a.cookTime) - cookTimeMinutes(b.cookTime) : a.title.localeCompare(b.title)
    );
  }, [recipes, search, sortKey, difficulty]);

  return (
    <div className="space-y-6">
      <RecipeFilters
        search={search}
        onSearchChange={setSearch}
        sortKey={sortKey}
        onSortChange={setSortKey}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        ingredientSuggestions={dbIngredientNames}
      />
      {loading && <SkeletonGrid count={9} />}
      {!loading && displayed.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface-card p-12 text-center space-y-2">
          <p className="font-semibold text-pantry-green text-lg">No recipes found</p>
          <p className="text-sm text-muted">Try a different search term or remove the difficulty filter.</p>
        </div>
      )}
      {!loading && displayed.length > 0 && (
        <RecipeCardGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((r) => (
            <RecipeCardItem key={r.id}>
              <RecipeCard recipe={r} />
            </RecipeCardItem>
          ))}
        </RecipeCardGrid>
      )}
    </div>
  );
}

// ── Main content ─────────────────────────────────────────────────────────────
function RecipesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemIds = useMemo(
    () =>
      (searchParams.get("items") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [searchParams]
  );
  const hasSelection = itemIds.length > 0;

  const [dbIngredientNames, setDbIngredientNames] = useState<string[]>([]);
  const [ingredientNames, setIngredientNames] = useState<string[]>([]);
  const [dbRecipes, setDbRecipes] = useState<ScoredRecipe[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    getIngredientNames().then(setDbIngredientNames);
  }, []);

  useEffect(() => {
    if (!hasSelection) return;
    let cancelled = false;

    async function load() {
      setDbLoading(true);
      try {
        const [allItems, allRecipes] = await Promise.all([getInventory(), getRecipes()]);
        if (cancelled) return;

        const resolved = allItems.filter(
          (item) => itemIds.includes(item.id) || itemIds.includes(item.name)
        );
        const names = resolved.length > 0 ? resolved.map((i) => i.name) : itemIds;
        setIngredientNames(names);

        const scored = allRecipes.map((r) => ({ ...r, matchScore: scoreRecipe(r, names) }));
        setDbRecipes(scored);
      } finally {
        if (!cancelled) setDbLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIds.join(",")]);

  const displayedDb = useMemo(() => {
    let list = dbRecipes;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) => r.title.toLowerCase().includes(q) || r.ingredients.some((i) => i.toLowerCase().includes(q))
      );
    }
    if (difficulty !== "All") list = list.filter((r) => r.difficulty === difficulty);
    return [...list].sort((a, b) => {
      if (sortKey === "match")
        return b.matchScore !== a.matchScore ? b.matchScore - a.matchScore : a.title.localeCompare(b.title);
      if (sortKey === "time")
        return cookTimeMinutes(a.cookTime) - cookTimeMinutes(b.cookTime);
      return a.title.localeCompare(b.title);
    });
  }, [dbRecipes, search, sortKey, difficulty]);

  const matched = displayedDb.filter((r) => r.matchScore > 0);
  const unmatched = displayedDb.filter((r) => r.matchScore === 0);
  const displayNames = ingredientNames.length > 0 ? ingredientNames : itemIds;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-3xl bg-pantry-green px-8 sm:px-10 py-14 sm:py-16 flex flex-col gap-2 sm:gap-3">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
          <div aria-hidden="true" className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-pantry-amber/15 blur-3xl pointer-events-none" />
          <span className="relative z-10 text-pantry-amber text-[11px] font-bold uppercase tracking-[0.22em]">
            The Pantry at ASUCD · UC Davis
          </span>
          <h1
            className="relative z-10 text-4xl sm:text-5xl md:text-6xl text-white leading-tight drop-shadow-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {hasSelection ? "Your Recipes" : "Recipe Suggestions"}
          </h1>
          <p className="relative z-10 text-pantry-cream/85 max-w-lg text-sm sm:text-base leading-relaxed">
            {hasSelection
              ? `Showing recipes matched to your ${itemIds.length} selected ingredient${itemIds.length !== 1 ? "s" : ""}.`
              : "Browse all pantry recipes, or head back to inventory to select ingredients for personalised matches."}
          </p>
        </div>

        {/* Selection mode */}
        {hasSelection && (
          <>
            {/* Ingredient chips */}
            <div className="rounded-2xl border border-border bg-surface-card p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Your selected ingredients</p>
                <button
                  type="button"
                  onClick={() => router.push("/recipes")}
                  aria-label="Clear selection and browse all recipes"
                  className="text-[10px] font-semibold text-muted underline underline-offset-2 transition-colors cursor-pointer hover:!text-pantry-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-coral focus-visible:ring-offset-2 rounded"
                >
                  Browse all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {dbLoading
                  ? Array.from({ length: Math.min(itemIds.length, 8) }).map((_, i) => (
                    <div key={i} className="h-7 w-20 rounded-full bg-pantry-green/15 animate-pulse" />
                  ))
                  : displayNames.map((name, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-pantry-green text-pantry-cream">
                      {name}
                    </span>
                  ))}
              </div>
            </div>

            {/* Filters */}
            <RecipeFilters
              search={search}
              onSearchChange={setSearch}
              sortKey={sortKey}
              onSortChange={setSortKey}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              ingredientSuggestions={dbIngredientNames}
            />

            {dbLoading && <SkeletonGrid count={6} />}

            {!dbLoading && (
              <>
                {/* Best matches */}
                {matched.length > 0 ? (
                  <section className="space-y-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <div>
                        <h2
                          className="text-2xl sm:text-3xl font-semibold text-foreground"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Best matches
                        </h2>
                        <p className="text-xs text-muted mt-0.5">
                          {matched.length} recipe{matched.length !== 1 ? "s" : ""} using your ingredients
                        </p>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pantry-green/10 text-pantry-green text-xs font-semibold">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Sorted by match
                      </span>
                    </div>
                    <RecipeCardGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {matched.map((r) => (
                        <RecipeCardItem key={r.id}>
                          <RecipeCard recipe={r} matchScore={r.matchScore} />
                        </RecipeCardItem>
                      ))}
                    </RecipeCardGrid>
                  </section>
                ) : (
                  <div className="rounded-2xl border border-border bg-surface-card p-10 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-pantry-amber/10 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-pantry-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-foreground">No recipes match your ingredients</p>
                    <p className="text-sm text-muted">Try removing a filter, or explore all pantry recipes below.</p>
                  </div>
                )}

                {/* All other pantry recipes */}
                {unmatched.length > 0 && (
                  <section className="space-y-5 pt-2">
                    <SectionDivider label="All pantry recipes" />
                    <RecipeCardGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {unmatched.map((r) => (
                        <RecipeCardItem key={r.id}>
                          <RecipeCard recipe={r} />
                        </RecipeCardItem>
                      ))}
                    </RecipeCardGrid>
                  </section>
                )}
              </>
            )}
          </>
        )}

        {/* Browse mode */}
        {!hasSelection && <BrowseRecipes dbIngredientNames={dbIngredientNames} />}
      </div>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    }>
      <RecipesContent />
    </Suspense>
  );
}
