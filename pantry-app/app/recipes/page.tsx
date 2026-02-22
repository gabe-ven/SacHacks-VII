"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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

// ── Mixing animation ──────────────────────────────────────────────────────

const CAT_COLORS: Record<string, string> = {
  "Produce":             "#5E7F64",
  "Dairy":               "#6C90B2",
  "Canned/Jarred Foods": "#E3694F",
  "Dry/Baking Goods":    "#CCAA6C",
  "Personal Care":       "#A592C0",
};
const FALLBACK_COLORS = ["#5E7F64", "#EEB467", "#E37861", "#DDBE86", "#92A9C0"];

function BowlAnimation({ items }: { items: string[] }) {
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef   = useRef<number>(0);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pantry_selected_categories");
      if (raw) setCategoryMap(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  // Each item follows two independent sine waves (Lissajous motion).
  // Different x/y frequencies create complex, organic, never-boring paths.
  const params = useMemo(() => items.map((_, i) => {
    const n = Math.max(items.length, 1);
    const phase = (i / n) * Math.PI * 2;
    return {
      freqX:  0.20 + i * 0.033,          // x oscillation speed (Hz)
      freqY:  0.15 + i * 0.041,          // y oscillation speed (Hz) — different → complex path
      ampX:   100 + (i % 4) * 26,        // x amplitude (px from center)
      ampY:   52  + (i % 3) * 18,        // y amplitude (px from center)
      phaseX: phase,                      // spread items around evenly at t=0
      phaseY: phase + Math.PI * 0.6,     // offset y phase for rounder paths
      tiltF:  0.07 + i * 0.019,          // gentle self-rotation frequency
    };
  }), [items]);

  useEffect(() => {
    const start = performance.now();

    function tick(now: number) {
      const t = (now - start) / 1000;

      params.forEach((p, i) => {
        const el = chipRefs.current[i];
        if (!el) return;

        const x = p.ampX * Math.sin(p.freqX * t * Math.PI * 2 + p.phaseX);
        const y = p.ampY * Math.sin(p.freqY * t * Math.PI * 2 + p.phaseY);

        // Depth: items higher up (negative y) feel further away
        const normY = (y + p.ampY) / (2 * p.ampY);   // 0 = top, 1 = bottom
        const scale   = 0.78 + normY * 0.32;          // 0.78–1.10
        const opacity = 0.35 + normY * 0.65;          // 0.35–1.0
        const tilt    = 13  * Math.sin(p.tiltF * t * Math.PI * 2 + p.phaseX);

        el.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px)) scale(${scale.toFixed(3)}) rotate(${tilt.toFixed(2)}deg)`;
        el.style.opacity   = opacity.toFixed(3);
        el.style.zIndex    = String(Math.round(normY * 20));
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [params]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="relative w-full overflow-hidden select-none"
      style={{ height: 320 }}
    >
      {items.map((name, i) => {
        const cat   = categoryMap[name];
        const color = (cat && CAT_COLORS[cat]) ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
        return (
          <span
            key={name}
            ref={(el) => { chipRefs.current[i] = el; }}
            className="absolute left-1/2 top-1/2 whitespace-nowrap font-semibold text-lg px-5 py-2.5 rounded-full border pointer-events-none"
            style={{
              color,
              backgroundColor: color + "1c",
              borderColor:     color + "45",
            }}
          >
            {name}
          </span>
        );
      })}
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

        {!loading && selectedNames.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-1.5 mt-4 mb-10">
            {selectedNames.map((name) => (
              <span key={name} className="text-xs font-medium px-3 py-1 rounded-full bg-surface-card border border-border text-muted">
                {name}
              </span>
            ))}
          </motion.div>
        )}

        {loading && <BowlAnimation items={selectedNames} />}

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
