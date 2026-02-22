"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RECIPES_STORAGE_KEY } from "@/app/recipes/page";
import type { GeneratedRecipe } from "@/app/recipes/page";

const CARD_ACCENT: string[] = [
  "#5E7F64",
  "#EEB467",
  "#E37861",
  "#DDBE86",
  "#92A9C0",
  "#5E7F64",
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy:   "text-pantry-green bg-pantry-green/10 border-pantry-green/20",
  Medium: "text-pantry-amber bg-pantry-amber/10 border-pantry-amber/20",
  Hard:   "text-pantry-coral bg-pantry-coral/10 border-pantry-coral/20",
};

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [index, setIndex] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = Number(params.id);
    const raw = sessionStorage.getItem(RECIPES_STORAGE_KEY);
    if (!raw) { setNotFound(true); return; }

    const list: GeneratedRecipe[] = JSON.parse(raw);
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) { setNotFound(true); return; }

    setRecipe(list[idx]);
    setIndex(idx);
  }, [params.id]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-foreground font-semibold">Recipe not found.</p>
        <p className="text-sm text-muted">It may have expired. Go back and generate new recipes.</p>
        <button onClick={() => router.push("/inventory")}
          className="mt-2 px-5 py-2 bg-pantry-green text-white text-sm font-semibold rounded-full hover:bg-pantry-coral transition-colors">
          Back to inventory →
        </button>
      </div>
    );
  }

  if (!recipe) return null;

  const accent = CARD_ACCENT[index % CARD_ACCENT.length];
  const total = recipe.haveIngredients.length + recipe.needIngredients.length;
  const pct = total > 0 ? Math.round((recipe.haveIngredients.length / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero band */}
      <div className="h-2 w-full" style={{ backgroundColor: accent }} />

      <div className="max-w-2xl mx-auto px-4 pt-10 pb-20">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-10 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All recipes
        </motion.button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="mb-6"
        >
          <h1
            className="text-5xl sm:text-6xl font-black leading-tight tracking-tight"
            style={{ fontFamily: "Dancing Script, cursive", color: accent }}
          >
            {recipe.name}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {recipe.cookTime}
            </span>
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${DIFFICULTY_COLOR[recipe.difficulty] ?? DIFFICULTY_COLOR.Easy}`}>
              {recipe.difficulty}
            </span>
            <span className="text-sm text-muted">{total} ingredients · {recipe.steps.length} steps</span>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-4 bg-surface-card border border-border rounded-2xl"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted">Ingredients you already have</span>
            <span className="text-xs font-bold" style={{ color: accent }}>{recipe.haveIngredients.length} of {total}</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accent }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {/* You have */}
          {recipe.haveIngredients.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-pantry-green/5 border border-pantry-green/15 rounded-2xl p-5"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-pantry-green mb-4">
                ✓ You have
              </h2>
              <ul className="space-y-2.5">
                {recipe.haveIngredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-pantry-green flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-sm text-foreground">{ing}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Also need */}
          {recipe.needIngredients.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="bg-pantry-amber/6 border border-pantry-amber/15 rounded-2xl p-5"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-pantry-amber mb-4">
                + Also grab
              </h2>
              <ul className="space-y-2.5">
                {recipe.needIngredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full border border-pantry-amber/40 bg-pantry-amber/10 flex items-center justify-center shrink-0 text-pantry-amber text-xs font-bold">
                      +
                    </span>
                    <span className="text-sm text-foreground">{ing}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </div>

        {/* Steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-6">Instructions</h2>
          <ol className="space-y-6">
            {recipe.steps.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
                className="flex gap-5"
              >
                <span
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm mt-0.5"
                  style={{ backgroundColor: accent }}
                >
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <p className="text-base text-foreground leading-relaxed">{step}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.section>

        {/* Back CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 pt-8 border-t border-border flex items-center justify-between"
        >
          <button
            onClick={() => router.back()}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← Other recipes
          </button>
          <button
            onClick={() => router.push("/inventory")}
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-colors"
            style={{ backgroundColor: accent }}
          >
            New haul →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
