"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { getInventory } from "@/lib/getInventory";
import { getRecipes, scoreRecipe } from "@/lib/getRecipes";
import type { InventoryItem } from "@/types/inventory";
import type { Recipe } from "@/types/recipe";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeFilters, { type SortKey } from "@/components/recipes/RecipeFilters";

// ── Types ────────────────────────────────────────────────────────────────────
type ScoredRecipe = Recipe & { matchScore: number };

function cookTimeMinutes(t: string): number {
  const m = t.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
}

// ── Main content ─────────────────────────────────────────────────────────────
function RecipesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemIds = useMemo(
    () =>
      (searchParams.get("items") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [searchParams]
  );

  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [recipes, setRecipes] = useState<ScoredRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [difficulty, setDifficulty] = useState("All");

  // Fetch inventory + recipes in parallel, then score
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [allItems, allRecipes] = await Promise.all([getInventory(), getRecipes()]);
        if (cancelled) return;
          const selected = itemIds.length > 0
          ? allItems.filter(
              (item) => itemIds.includes(item.id) || itemIds.includes(item.name)
            )
          : [];
        setSelectedItems(selected);
        // If IDs are names (not UUIDs), use itemIds directly as ingredient names
        const names = selected.length > 0 ? selected.map((i) => i.name) : itemIds;
        setRecipes(allRecipes.map((r) => ({ ...r, matchScore: scoreRecipe(r, names) })));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [itemIds]);

  // Filter + sort
  const displayed = useMemo(() => {
    let list = recipes;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.ingredients.some((i) => i.toLowerCase().includes(q))
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
  }, [recipes, search, sortKey, difficulty]);

  const hasSelection = itemIds.length > 0;
  const matched = displayed.filter((r) => r.matchScore > 0);
  const secondary = hasSelection ? [] : displayed;

  return (
    <div className="min-h-screen bg-pantry-cream">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Hero banner */}
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
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            Recipe Suggestions
          </h1>
          <p className="relative z-10 text-pantry-cream/65 max-w-lg text-sm leading-relaxed">
            {hasSelection
              ? `Showing recipes matched to your ${itemIds.length} selected ingredient${itemIds.length !== 1 ? "s" : ""}. Every student deserves a good meal — here are yours.`
              : "Browse all pantry recipes below, or head back to select your ingredients for personalised suggestions."}
          </p>

          <button
            onClick={() => router.push("/inventory")}
            className="relative z-10 mt-2 w-fit inline-flex items-center gap-1.5 text-pantry-cream/60 hover:text-pantry-amber text-sm transition-colors focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to pantry
          </button>
        </div>

        {/* Selected ingredient chips */}
        {hasSelection && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pantry-brown/60">
              Your selected ingredients
            </p>
            <div className="flex flex-wrap gap-2">
              {loading
                ? Array.from({ length: Math.min(itemIds.length, 8) }).map((_, i) => (
                  <div key={i} className="h-7 w-20 rounded-full bg-pantry-green/15 animate-pulse" />
                ))
                : selectedItems.length > 0
                  ? selectedItems.map((item) => (
                    <span key={item.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-pantry-green text-pantry-cream border border-pantry-green-dark/20">
                      {item.name}
                    </span>
                  ))
                  : (
                    <p className="text-sm text-pantry-brown/50 italic">
                      Could not resolve ingredient names — match scores may not appear.
                    </p>
                  )}
            </div>
          </div>
        )}

        {/* Filters */}
        <RecipeFilters
          search={search}
          onSearchChange={setSearch}
          sortKey={sortKey}
          onSortChange={setSortKey}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-pantry-tan/50 overflow-hidden animate-pulse bg-pantry-cream">
                <div className="h-36 bg-pantry-tan/25" />
                <div className="p-4 space-y-3">
                  <div className="h-3.5 rounded-full bg-pantry-tan/40 w-3/4" />
                  <div className="h-3 rounded-full bg-pantry-tan/30 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && (
          <>
            {displayed.length === 0 && (
              <div className="rounded-2xl border border-pantry-tan/50 bg-white/60 p-12 text-center space-y-2">
                <p className="font-semibold text-pantry-green text-lg">No recipes found</p>
                <p className="text-sm text-foreground/50">Try a different search term or remove the difficulty filter.</p>
              </div>
            )}

            {hasSelection && matched.length > 0 && (
              <section className="space-y-4">
                <SectionHeading title="Best matches" count={matched.length} accent="text-pantry-green bg-pantry-green/12" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matched.map((r) => <RecipeCard key={r.id} recipe={r} matchScore={r.matchScore} />)}
                </div>
              </section>
            )}

            {hasSelection && matched.length === 0 && displayed.length > 0 && (
              <div className="rounded-2xl border border-pantry-amber/40 bg-pantry-yellow/20 p-5 flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-pantry-amber/30 flex items-center justify-center text-pantry-amber-dark font-bold text-sm">!</span>
                <div>
                  <p className="font-semibold text-pantry-green-dark text-sm">No matching recipes</p>
                  <p className="text-sm text-foreground/55 mt-0.5">
                    None of our recipes use the ingredients you selected. Try going back and picking different items.
                  </p>
                </div>
              </div>
            )}

            {secondary.length > 0 && (
              <section className="space-y-4">
                <SectionHeading
                  title={hasSelection && matched.length > 0 ? "All other recipes" : "All recipes"}
                  count={secondary.length}
                  accent="text-pantry-brown bg-pantry-tan/40"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {secondary.map((r) => <RecipeCard key={r.id} recipe={r} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ title, count, accent }: { title: string; count: number; accent: string }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-semibold text-foreground text-base">{title}</h2>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${accent}`}>{count}</span>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-pantry-cream flex items-center justify-center">
        <p className="text-sm text-pantry-brown/50">Loading recipes…</p>
      </div>
    }>
      <RecipesContent />
    </Suspense>
  );
}
