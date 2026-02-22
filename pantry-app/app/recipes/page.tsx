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

export const RECIPES_STORAGE_KEY = "pantry_generated_recipes";
const RECIPES_ITEMS_KEY = "pantry_generated_items";

// ── Constants ─────────────────────────────────────────────────────────────

const CARD_ACCENT: string[] = [
  "#5E7F64", "#EEB467", "#E37861", "#DDBE86", "#92A9C0",
  "#5E7F64", "#EEB467", "#E37861", "#DDBE86", "#92A9C0",
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy:   "text-pantry-green bg-pantry-green/10 border-pantry-green/20",
  Medium: "text-pantry-amber bg-pantry-amber/10 border-pantry-amber/20",
  Hard:   "text-pantry-coral bg-pantry-coral/10 border-pantry-coral/20",
};

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
            {[1, 2, 3].map((j) => <div key={j} className="h-6 w-24 bg-border rounded-full" />)}
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-1/4 bg-border rounded" />
          <div className="flex gap-2 flex-wrap">
            {[1, 2].map((j) => <div key={j} className="h-6 w-20 bg-border rounded-full" />)}
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
        className="cursor-pointer group w-full text-left bg-surface-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green"
      >
        <div className="flex">
          {/* Left accent bar */}
          <div className="w-1 shrink-0" style={{ backgroundColor: accent }} />

          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3
                className="text-[1.6rem] leading-tight font-black"
                style={{ fontFamily: "Dancing Script, cursive", color: accent }}
              >
                {recipe.name}
              </h3>
              <span className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border mt-0.5 ${DIFFICULTY_COLOR[recipe.difficulty] ?? DIFFICULTY_COLOR.Easy}`}>
                {recipe.difficulty}
              </span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2.5 text-xs text-muted mb-5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              <span>{recipe.cookTime}</span>
              <span className="opacity-30">·</span>
              <span>{total} ingredients</span>
              <span className="opacity-30">·</span>
              <span>{recipe.steps.length} steps</span>
            </div>

            {/* Ingredients */}
            <div className="space-y-2 mb-5">
              {recipe.haveIngredients.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {recipe.haveIngredients.map((ing) => (
                    <span
                      key={ing}
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: accent + "22", color: accent }}
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              )}
              {recipe.needIngredients.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {recipe.needIngredients.map((ing) => (
                    <span key={ing} className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface border border-border text-muted">
                      {ing}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <div className="flex-1 flex items-center gap-2.5">
                <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: accent }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 + index * 0.07 }}
                  />
                </div>
                <span className="text-[11px] text-muted shrink-0">{pct}% on hand</span>
              </div>
              <span
                className="shrink-0 text-xs font-semibold px-4 py-2 rounded-full text-white group-hover:opacity-90 transition-opacity"
                style={{ backgroundColor: accent }}
              >
                See recipe →
              </span>
            </div>
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
    ? [...new Set(raw.split(",").map((s) => decodeURIComponent(s).trim()).filter(Boolean))]
    : [];

  useEffect(() => {
    if (selectedNames.length === 0) {
      setLoading(false);
      return;
    }

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

  // No items — show prompt to go pick ingredients
  if (!raw) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center gap-5">
        <div className="w-14 h-14 rounded-full bg-pantry-green/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-pantry-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5A2.25 2.25 0 0012.75 4.5h-1.5A2.25 2.25 0 009 6.75v1.5m6 0H9m6.75 6.75H8.25" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Find your <span className="text-pantry-green">recipes</span>
          </h1>
          <p className="text-sm text-muted mt-2 max-w-xs">
            Head to the inventory, pick the items you grabbed from the Pantry, and we'll generate recipes just for you.
          </p>
        </div>
        <button
          onClick={() => router.push("/inventory")}
          className="mt-2 px-6 py-3 bg-pantry-green text-white text-sm font-semibold rounded-full hover:bg-pantry-coral transition-colors"
        >
          Browse inventory →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">

        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/inventory")}
          className="cursor-pointer flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-10 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to inventory
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
            {loading
              ? <><span className="text-pantry-green">Cooking up</span> your recipes…</>
              : error ? "Something went wrong"
              : recipes.length > 0
              ? <><span className="text-pantry-green">{recipes.length} recipes</span> for your haul</>
              : "No recipes found"}
          </h1>
          <p className="text-sm text-muted mt-2">
            {loading
              ? `Generating ideas from ${selectedNames.length} item${selectedNames.length !== 1 ? "s" : ""}…`
              : error ? error
              : recipes.length > 0
              ? `From ${selectedNames.length} item${selectedNames.length !== 1 ? "s" : ""} in your haul`
              : "Try selecting more items from the inventory"}
          </p>
        </motion.div>

        {selectedNames.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-1.5 mt-4 mb-10">
            {selectedNames.map((name) => (
              <span key={name} className="text-xs font-medium px-3 py-1 rounded-full bg-surface-card border border-border text-muted">
                {name}
              </span>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="flex flex-col gap-5">
            {[0, 1, 2, 3, 4].map((i) => <RecipeSkeleton key={i} i={i} />)}
          </div>
        )}

        {!loading && error && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-16 text-center">
            <p className="text-sm font-semibold text-foreground mb-1">Couldn't generate recipes</p>
            <p className="text-xs text-muted max-w-xs">{error}</p>
            <button onClick={() => router.push("/inventory")} className="mt-5 px-5 py-2 bg-pantry-green text-white text-sm font-semibold rounded-full hover:bg-pantry-coral transition-colors">
              Back to inventory →
            </button>
          </motion.div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div className="flex flex-col gap-5">
            {recipes.map((recipe, i) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={i}
                onClick={() => router.push(`/recipes/${recipe.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
