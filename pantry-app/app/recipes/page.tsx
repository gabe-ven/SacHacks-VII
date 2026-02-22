"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────

export type GeneratedRecipe = {
  id: number;
  name: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  haveIngredients: string[];
  needIngredients: string[];
  steps: string[];
};

// ── Storage keys (shared with detail page) ────────────────────────────────
export const RECIPES_STORAGE_KEY = "pantry_generated_recipes";
const RECIPES_ITEMS_KEY = "pantry_generated_items";

// ── Helpers ───────────────────────────────────────────────────────────────

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy:   "text-pantry-green bg-pantry-green/10 border-pantry-green/20",
  Medium: "text-pantry-amber bg-pantry-amber/10 border-pantry-amber/20",
  Hard:   "text-pantry-coral bg-pantry-coral/10 border-pantry-coral/20",
};

const CARD_ACCENT: string[] = [
  "#5E7F64", // green
  "#EEB467", // amber
  "#E37861", // coral
  "#DDBE86", // tan
  "#92A9C0", // blue-grey
  "#5E7F64",
];

// ── Skeleton ──────────────────────────────────────────────────────────────

function RecipeSkeleton({ i }: { i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
      className="bg-surface-card border border-border rounded-3xl overflow-hidden animate-pulse"
    >
      <div className="h-2 w-full" style={{ backgroundColor: CARD_ACCENT[i % CARD_ACCENT.length] + "66" }} />
      <div className="p-7 space-y-4">
        <div className="h-6 w-2/3 bg-border rounded-lg" />
        <div className="h-3 w-1/3 bg-border rounded" />
        <div className="space-y-2 pt-2">
          <div className="h-3 w-1/4 bg-border rounded" />
          <div className="flex gap-2 flex-wrap">
            {[1,2,3].map(j => <div key={j} className="h-6 w-24 bg-border rounded-full" />)}
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-1/4 bg-border rounded" />
          <div className="flex gap-2 flex-wrap">
            {[1,2].map(j => <div key={j} className="h-6 w-20 bg-border rounded-full" />)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Recipe card ───────────────────────────────────────────────────────────

function RecipeCard({
  recipe,
  index,
  onClick,
}: {
  recipe: GeneratedRecipe;
  index: number;
  onClick: () => void;
}) {
  const accent = CARD_ACCENT[index % CARD_ACCENT.length];
  const total = recipe.haveIngredients.length + recipe.needIngredients.length;
  const pct = total > 0 ? Math.round((recipe.haveIngredients.length / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: index * 0.07 }}
    >
      <button
        onClick={onClick}
        className="group w-full text-left bg-surface-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green"
        style={{ ["--accent" as string]: accent }}
      >
        {/* Thick accent top bar */}
        <div className="h-2 w-full transition-all duration-300" style={{ backgroundColor: accent }} />

        <div className="p-7">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3
              className="text-2xl font-black leading-tight tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors duration-300"
              style={{ fontFamily: "Dancing Script, cursive" }}
            >
              {recipe.name}
            </h3>
            <span className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border mt-1 ${DIFFICULTY_COLOR[recipe.difficulty] ?? DIFFICULTY_COLOR.Easy}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted mb-6">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {recipe.cookTime}
            </span>
            <span>·</span>
            <span>{total} ingredients</span>
            <span>·</span>
            <span>{recipe.steps.length} steps</span>
          </div>

          {/* You have */}
          {recipe.haveIngredients.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-pantry-green mb-2">
                ✓ You have ({recipe.haveIngredients.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {recipe.haveIngredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-pantry-green/10 border border-pantry-green/20 text-pantry-green"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Also need */}
          {recipe.needIngredients.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">
                + Also need ({recipe.needIngredients.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {recipe.needIngredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-surface border border-border text-muted"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Progress bar + CTA */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted">Ingredients you have</span>
                <span className="text-[10px] font-bold text-pantry-green">{pct}%</span>
              </div>
              <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: accent }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 + index * 0.07 }}
                />
              </div>
            </div>
            <span
              className="shrink-0 text-xs font-bold px-4 py-2 rounded-full text-white transition-all duration-200 group-hover:scale-105"
              style={{ backgroundColor: accent }}
            >
              See recipe →
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [recipes, setRecipes] = useState<GeneratedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const raw = searchParams.get("items") ?? "";
  const selectedNames = raw
    ? raw.split(",").map((s) => decodeURIComponent(s).trim()).filter(Boolean)
    : [];

  useEffect(() => {
    if (selectedNames.length === 0) {
      setLoading(false);
      return;
    }

    // If we already generated recipes for this exact set of items, reuse them
    const cachedItems = sessionStorage.getItem(RECIPES_ITEMS_KEY);
    const cachedRecipes = sessionStorage.getItem(RECIPES_STORAGE_KEY);
    if (cachedItems === raw && cachedRecipes) {
      setRecipes(JSON.parse(cachedRecipes));
      setLoading(false);
      return;
    }

    async function generate() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/generate-recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: selectedNames }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unknown error");
        const list: GeneratedRecipe[] = json.recipes ?? [];
        setRecipes(list);
        sessionStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(list));
        sessionStorage.setItem(RECIPES_ITEMS_KEY, raw);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const handleCardClick = (recipe: GeneratedRecipe) => {
    router.push(`/recipes/${recipe.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/inventory")}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-10 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to inventory
        </motion.button>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-3"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
            {loading
              ? <>Cooking up<br /><span className="text-pantry-green">your recipes…</span></>
              : error
              ? "Something went wrong"
              : recipes.length > 0
              ? <><span className="text-pantry-green">{recipes.length} recipes</span><br />for your haul</>
              : "No recipes found"}
          </h1>
          <p className="text-sm text-muted mt-2">
            {loading
              ? `Generating ideas from ${selectedNames.length} item${selectedNames.length !== 1 ? "s" : ""}…`
              : error ? error
              : recipes.length > 0
              ? "Green = you have it · Grey = easy to grab"
              : "Try selecting more items from the inventory"}
          </p>
        </motion.div>

        {/* Selected chips */}
        {selectedNames.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {selectedNames.map((name) => (
              <span key={name} className="text-xs font-medium px-3 py-1 rounded-full bg-pantry-green/10 border border-pantry-green/20 text-pantry-green">
                {name}
              </span>
            ))}
          </motion.div>
        )}

        {/* Skeletons */}
        {loading && (
          <div className="flex flex-col gap-5">
            {[0, 1, 2, 3, 4].map((i) => <RecipeSkeleton key={i} i={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-16 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-pantry-coral/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pantry-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Couldn't generate recipes</p>
            <p className="text-xs text-muted max-w-xs">{error}</p>
            <button onClick={() => router.push("/inventory")}
              className="mt-5 px-5 py-2 bg-pantry-green text-white text-sm font-semibold rounded-full hover:bg-pantry-coral transition-colors">
              Back to inventory →
            </button>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && !error && selectedNames.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-16 text-center"
          >
            <p className="text-sm text-muted">Select ingredients from the inventory first.</p>
            <button onClick={() => router.push("/inventory")}
              className="mt-4 px-5 py-2 bg-pantry-green text-white text-sm font-semibold rounded-full hover:bg-pantry-coral transition-colors">
              Go to inventory →
            </button>
          </motion.div>
        )}

        {/* Recipe cards */}
        {!loading && !error && recipes.length > 0 && (
          <div className="flex flex-col gap-5">
            {recipes.map((recipe, i) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={i}
                onClick={() => handleCardClick(recipe)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
