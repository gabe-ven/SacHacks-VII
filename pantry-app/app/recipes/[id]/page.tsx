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
          className="cursor-pointer mt-2 px-5 py-2 bg-pantry-green text-white text-sm font-semibold rounded-full hover:bg-pantry-coral transition-colors">
          Back to inventory →
        </button>
      </div>
    );
  }

  if (!recipe) return null;

  const accent = CARD_ACCENT[index % CARD_ACCENT.length];
  const total = recipe.haveIngredients.length + recipe.needIngredients.length;
  const pct = total > 0 ? Math.round((recipe.haveIngredients.length / total) * 100) : 0;

  const allIngredients = [
    ...recipe.haveIngredients.map((ing) => ({ text: ing, have: true })),
    ...recipe.needIngredients.map((ing) => ({ text: ing, have: false })),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-16">

        {/* ── Back ── */}
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="cursor-pointer inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All recipes
        </motion.button>

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="mt-12"
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${DIFFICULTY_COLOR[recipe.difficulty] ?? DIFFICULTY_COLOR.Easy}`}>
              {recipe.difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {recipe.cookTime}
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl leading-[1.15]"
            style={{ fontFamily: "var(--font-display)", color: accent }}
          >
            {recipe.name}
          </h1>

          <p className="text-sm text-muted mt-4">
            {total} ingredients · {recipe.steps.length} steps
          </p>
        </motion.div>

        {/* ── Ingredients ── */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-16"
        >
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">
            Ingredients
          </h2>

          <ul className="space-y-0 divide-y divide-border">
            {allIngredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-4 py-3.5">
                {ing.have ? (
                  <span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: accent }}>
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
                )}
                <span className={`text-sm flex-1 ${ing.have ? "text-foreground" : "text-muted"}`}>
                  {ing.text}
                </span>
                {ing.have && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: accent + "18", color: accent }}>
                    On hand
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* Progress */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: accent }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <span className="text-xs font-semibold shrink-0" style={{ color: accent }}>{pct}% ready</span>
          </div>
        </motion.section>

        {/* ── Steps ── */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            How to make it
          </h2>

          <div className="h-10" />

          {recipe.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className={`flex gap-5 ${i > 0 ? "mt-8" : ""}`}
            >
              <span
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: accent }}
              >
                {i + 1}
              </span>
              <p className="text-[15px] text-foreground leading-relaxed pt-1 flex-1 min-w-0">{step}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 pt-8 border-t border-border flex items-center justify-between"
        >
          <button
            onClick={() => router.back()}
            className="cursor-pointer text-sm text-muted hover:text-foreground transition-colors"
          >
            ← Other recipes
          </button>
          <button
            onClick={() => router.push("/inventory")}
            className="cursor-pointer text-sm font-semibold text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: accent }}
          >
            New haul →
          </button>
        </motion.div>

      </div>
    </div>
  );
}
