"use client";

import { useState } from "react";

interface Props {
  recipeId: string;
  recipeTitle: string;
}

/**
 * AI Instructions Button — wires up to Gabe's AI recipe generation.
 * Replace the TODO body with the real server action call once the AI
 * integration is ready (lib/actions/generateRecipes.ts).
 */
export default function AIInstructionsButton({ recipeId, recipeTitle }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setResult(null);
    try {
      // TODO (Gabe): replace with real AI call, e.g.:
      // const steps = await generateAIInstructions(recipeId, userIngredients);
      await new Promise((r) => setTimeout(r, 1200)); // simulated delay
      setResult(
        `AI-generated tips for "${recipeTitle}" will appear here once the AI integration is connected.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 bg-[#CEB888] text-[#002855] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#F5C518] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating…
          </>
        ) : (
          <>✨ Generate AI Instructions</>
        )}
      </button>

      {result && (
        <div className="bg-white/10 rounded-lg px-4 py-3 text-blue-100 text-sm leading-relaxed">
          {result}
        </div>
      )}
    </div>
  );
}
