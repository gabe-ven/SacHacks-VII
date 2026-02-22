"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { getInventory } from "@/lib/getInventory";
import { getRecipes, scoreRecipe } from "@/lib/getRecipes";
import type { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeFilters, { type SortKey } from "@/components/recipes/RecipeFilters";
import { RecipeCardGrid, RecipeCardItem } from "@/components/landing/animations";

// ── Types ────────────────────────────────────────────────────────────────────
type ScoredRecipe = Recipe & { matchScore: number };

type AIRawRecipe = {
  id: number;
  name: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  haveIngredients: string[];
  needIngredients: string[];
  steps: string[];
  image_url?: string;
};

function aiToRecipe(r: AIRawRecipe): ScoredRecipe {
  return {
    id: `ai-${-r.id}`,
    title: r.name,
    image: r.image_url ?? "",
    cookTime: r.cookTime,
    difficulty: r.difficulty,
    ingredients: [...r.haveIngredients, ...r.needIngredients],
    pantryIngredients: r.haveIngredients,
    instructions: r.steps,
    substitutions: [],
    matchScore: 100,
  };
}

function cookTimeMinutes(t: string): number {
  if (!t || t === "N/A") return Infinity;
  const m = t.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : Infinity;
}

// ── Skeleton cards ────────────────────────────────────────────────────────────
function SkeletonGrid({ count = 6, shimmer = false }: { count?: number; shimmer?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-2xl border border-border overflow-hidden bg-surface-card ${shimmer ? "animate-pulse" : ""}`}
        >
          <div className={`h-40 ${shimmer ? "bg-border/40" : "bg-pantry-green/8"}`} />
          <div className="p-4 space-y-3">
            <div className={`h-3.5 rounded-full w-3/4 ${shimmer ? "bg-border" : "bg-border/60"}`} />
            <div className={`h-3 rounded-full w-1/2 ${shimmer ? "bg-border/70" : "bg-border/40"}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

const AI_RECIPES_STORAGE_KEY = "pantry_ai_recipes";
const AI_RECIPES_BACK_KEY = "pantry_ai_recipes_back";

// ── Browse all recipes (no selection) ────────────────────────────────────────
function BrowseRecipes() {
  const [recipes, setRecipes] = useState<ScoredRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("match");
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
      />
      {loading && <SkeletonGrid count={9} shimmer />}
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
  const searchString = searchParams.toString();

  const itemIds = useMemo(
    () =>
      (searchParams.get("items") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [searchParams]
  );
  const hasSelection = itemIds.length > 0;

  // ── DB recipes state ──────────────────────────────────────────────────────
  const [ingredientNames, setIngredientNames] = useState<string[]>([]);
  const [dbRecipes, setDbRecipes] = useState<ScoredRecipe[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [difficulty, setDifficulty] = useState("All");

  // ── AI recipes state ──────────────────────────────────────────────────────
  const [aiRecipes, setAiRecipes] = useState<ScoredRecipe[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiDone, setAiDone] = useState(false);
  const aiRunning = useRef(false);

  // Persist AI recipes and back URL for the generated recipe page
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (aiRecipes.length > 0) {
      try {
        window.sessionStorage.setItem(AI_RECIPES_STORAGE_KEY, JSON.stringify(aiRecipes));
        window.sessionStorage.setItem(AI_RECIPES_BACK_KEY, searchString ? `?${searchString}` : "");
      } catch { /* ignore */ }
    }
  }, [aiRecipes, searchString]);

  // Load DB recipes + scores, then auto-trigger AI (or restore from sessionStorage when returning back)
  useEffect(() => {
    if (!hasSelection) return;
    let cancelled = false;

    async function load() {
      const expectedBack = searchString ? `?${searchString}` : "";
      let skipAI = false;
      if (typeof window !== "undefined") {
        try {
          const back = window.sessionStorage.getItem(AI_RECIPES_BACK_KEY);
          const raw = window.sessionStorage.getItem(AI_RECIPES_STORAGE_KEY);
          if (back === expectedBack && raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              skipAI = true;
              setAiRecipes(parsed);
              setAiDone(true);
            }
          }
        } catch { /* ignore */ }
      }

      setDbLoading(true);
      if (!skipAI) {
        setAiRecipes([]);
        setAiDone(false);
        setAiError(null);
      }

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
        setDbLoading(false);

        if (!cancelled && !skipAI) generateAI(names);
      } catch {
        if (!cancelled) setDbLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIds.join(",")]);

  async function generateAI(names: string[]) {
    if (aiRunning.current) return;
    aiRunning.current = true;
    setAiLoading(true);
    setAiError(null);
    setAiDone(false);
    setAiRecipes([]);
    try {
      const res = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: names }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const raw: AIRawRecipe[] = json.recipes ?? [];
      setAiRecipes(raw.map(aiToRecipe));
      setAiDone(true);
    } catch {
      setAiError("Couldn't build suggestions — check your connection and try again.");
    } finally {
      setAiLoading(false);
      aiRunning.current = false;
    }
  }

  // Filter + sort DB recipes
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
  const displayNames = ingredientNames.length > 0 ? ingredientNames : itemIds;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-pantry-green px-8 py-12 flex flex-col gap-3">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div aria-hidden="true" className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-pantry-amber/10 blur-2xl pointer-events-none" />
          <span className="relative z-10 text-pantry-amber text-[10px] font-bold uppercase tracking-[0.25em]">
            The Pantry at ASUCD · UC Davis
          </span>
          <h1
            className="relative z-10 text-5xl sm:text-6xl text-white leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {hasSelection ? "Your Recipes" : "Recipe Suggestions"}
          </h1>
          <p className="relative z-10 text-pantry-cream/65 max-w-lg text-sm leading-relaxed">
            {hasSelection
              ? `Recipes matched and built around your ${itemIds.length} selected ingredient${itemIds.length !== 1 ? "s" : ""}.`
              : "Browse all pantry recipes, or head back to select your ingredients for personalised suggestions."}
          </p>
        </div>

        {/* ── Selection mode ── */}
        {hasSelection && (
          <>
            {/* Ingredient chips */}
            <div className="rounded-2xl border border-border bg-surface-card p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Your selected ingredients</p>
                <button
                  type="button"
                  onClick={() => router.push("/recipes")}
                  aria-label="Clear selection"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-2.5 py-1 text-[10px] font-semibold text-muted transition-colors cursor-pointer hover:border-pantry-coral/50 hover:bg-pantry-coral/10 hover:!text-pantry-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-coral focus-visible:ring-offset-2"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
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
            />

            {/* DB loading */}
            {dbLoading && <SkeletonGrid count={6} shimmer />}

            {/* DB results — only matched recipes when coming from Find recipes */}
            {!dbLoading && (
              <>
                {matched.length > 0 ? (
                  <section className="space-y-4">
                    <div className="text-center space-y-1">
                      <h2 className="text-3xl sm:text-4xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                        Best matches
                      </h2>
                      <p className="text-sm text-muted">{matched.length} recipe{matched.length !== 1 ? "s" : ""}</p>
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
                  <div className="rounded-2xl border border-border bg-surface-card p-10 text-center space-y-1">
                    <p className="font-semibold text-pantry-green">No matching recipes</p>
                    <p className="text-sm text-muted">Try removing the difficulty filter or changing the search.</p>
                  </div>
                )}

                {/* Divider — less gap below (before Suggested for you) */}
                <div className="pt-4 pb-2 sm:pt-5 sm:pb-2" aria-hidden>
                  <div className="border-t border-border" />
                </div>

                {/* Suggested for you */}
                <section className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                      Suggested for you
                    </h2>
                    <div className="mt-4 space-y-2">
                      {aiLoading && (
                        <span className="flex items-center justify-center gap-1.5 text-sm text-muted">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Building…
                        </span>
                      )}
                      {aiDone && !aiLoading && (
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-sm text-muted">
                            {aiRecipes.length} recipe{aiRecipes.length !== 1 ? "s" : ""} built around your ingredients
                          </p>
                          {aiRecipes.length > 0 && (
                            <button
                              type="button"
                              onClick={() => generateAI(displayNames)}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-pantry-green text-pantry-cream hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Regenerate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {aiLoading && <SkeletonGrid count={3} />}

                  {aiError && !aiLoading && (
                    <div className="rounded-2xl border border-border bg-surface-card p-8 text-center space-y-3">
                      <p className="text-sm text-muted">{aiError}</p>
                      <button
                        type="button"
                        onClick={() => generateAI(displayNames)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-pantry-green hover:text-pantry-amber transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green focus-visible:ring-offset-2 rounded-full px-3 py-1.5"
                      >
                        Try again
                      </button>
                    </div>
                  )}

                  {aiDone && !aiLoading && (
                    <RecipeCardGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {aiRecipes.map((r) => (
                        <RecipeCardItem key={r.id}>
                          <RecipeCard recipe={r} href={`/recipes/generated/${r.id}`} />
                        </RecipeCardItem>
                      ))}
                    </RecipeCardGrid>
                  )}
                </section>
              </>
            )}
          </>
        )}

        {/* ── Browse mode ── */}
        {!hasSelection && <BrowseRecipes />}
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
