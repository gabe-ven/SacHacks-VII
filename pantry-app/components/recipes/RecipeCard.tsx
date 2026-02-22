import Link from "next/link";
import type { Recipe } from "@/types/recipe";

interface Props {
  recipe: Recipe;
  matchScore?: number;
}

// Match badge — uses green → amber → lavender scale from brand palette
function MatchBadge({ score }: { score: number }) {
  const cls =
    score >= 75
      ? "bg-pantry-green text-white"
      : score >= 40
      ? "bg-pantry-amber text-pantry-green-dark"
      : "bg-pantry-lavender/40 text-pantry-purple-dark";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {score}% match
    </span>
  );
}

// Difficulty badge — Easy = green, Medium = teal, Hard = coral
function DifficultyBadge({ difficulty }: { difficulty: Recipe["difficulty"] }) {
  const cls =
    difficulty === "Easy"
      ? "bg-pantry-green/12 text-pantry-green-dark"
      : difficulty === "Medium"
      ? "bg-pantry-teal/15 text-pantry-teal"
      : "bg-pantry-coral/12 text-pantry-coral-dark";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}>
      {difficulty}
    </span>
  );
}

export default function RecipeCard({ recipe, matchScore }: Props) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex flex-col bg-surface-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image area */}
      <div className="h-36 relative overflow-hidden bg-gradient-to-br from-pantry-tan/30 via-pantry-amber/10 to-pantry-coral/8">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "linear-gradient(var(--pantry-green) 1px, transparent 1px), linear-gradient(90deg, var(--pantry-green) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <svg
              className="absolute inset-0 m-auto w-10 h-10 text-pantry-brown/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7.8-5 12a5 5 0 0010 0c0-4.2-3.8-6.6-5-12z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M9 9.5c-.5 1 .5 2 1.5 2" />
            </svg>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Title + match badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-foreground leading-snug group-hover:text-pantry-green transition-colors">
            {recipe.title}
          </h3>
          {matchScore !== undefined && matchScore > 0 && (
            <div className="shrink-0 mt-0.5">
              <MatchBadge score={matchScore} />
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-foreground/50 mt-auto flex-wrap">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="9" strokeWidth={2} />
            </svg>
            {recipe.cookTime}
          </span>
          <DifficultyBadge difficulty={recipe.difficulty} />
          <span className="text-foreground/40">{recipe.ingredients.length} ingredients</span>
        </div>
      </div>
    </Link>
  );
}
