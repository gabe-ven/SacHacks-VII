import Link from "next/link";
import type { Recipe } from "@/types/recipe";
import RecipeImage from "@/components/recipes/RecipeImage";

interface Props {
  recipe: Recipe;
  matchScore?: number;
  /** When provided the card renders as a button instead of a Link */
  onSelect?: () => void;
  /** When provided, card links to this href (e.g. /recipes/generated/ai-1) */
  href?: string;
}

// Match badge — solid theme colors so it stands out (green / amber / coral)
function MatchBadge({ score }: { score: number }) {
  const cls =
    score >= 75
      ? "bg-pantry-green text-pantry-cream"
      : score >= 40
      ? "bg-pantry-amber text-foreground"
      : "bg-pantry-coral text-pantry-cream";

  return (
    <span className={`inline-flex flex-col items-center justify-center rounded-lg min-w-[2.5rem] px-2 py-1 shadow-sm ${cls}`}>
      <span className="text-sm font-bold leading-none tabular-nums">{score}%</span>
      <span className="text-[8px] font-semibold uppercase tracking-wider opacity-95">match</span>
    </span>
  );
}

// Difficulty badge — Easy = green, Medium = amber, Hard = coral (distinct colors)
function DifficultyBadge({ difficulty }: { difficulty: Recipe["difficulty"] }) {
  const cls =
    difficulty === "Easy"
      ? "bg-pantry-green/15 text-pantry-green-dark border border-pantry-green/25"
      : difficulty === "Medium"
      ? "bg-pantry-amber/15 text-pantry-amber-dark border border-pantry-amber/25"
      : "bg-pantry-coral/15 text-pantry-coral-dark border border-pantry-coral/25";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {difficulty}
    </span>
  );
}

const CARD_CLS =
  "group flex flex-col bg-surface-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-pantry-green/30 transition-all duration-300 hover:-translate-y-0.5";

function CardBody({ recipe, matchScore }: { recipe: Recipe; matchScore?: number }) {
  return (
    <>
      {/* Image area */}
      <div className="h-40 relative overflow-hidden bg-gradient-to-br from-pantry-tan/30 via-pantry-amber/10 to-pantry-coral/8">
        <RecipeImage
          src={recipe.image}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-base text-foreground leading-snug group-hover:text-pantry-green transition-colors line-clamp-2">
          {recipe.title}
        </h3>

        {/* Meta row — time, difficulty, ingredients; match % bottom right */}
        <div className="flex items-center justify-between gap-2 text-sm text-foreground/60 mt-auto flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
              </svg>
              {recipe.cookTime}
            </span>
            <DifficultyBadge difficulty={recipe.difficulty} />
            <span className="text-foreground/50">{recipe.ingredients.length} ingredients</span>
          </div>
          {matchScore !== undefined && matchScore > 0 && (
            <div className="shrink-0 ml-auto">
              <MatchBadge score={matchScore} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function RecipeCard({ recipe, matchScore, onSelect, href }: Props) {
  if (onSelect) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
        className={`${CARD_CLS} cursor-pointer`}
      >
        <CardBody recipe={recipe} matchScore={matchScore} />
      </div>
    );
  }

  const linkHref = href ?? `/recipes/${recipe.id}`;
  return (
    <Link href={linkHref} className={CARD_CLS}>
      <CardBody recipe={recipe} matchScore={matchScore} />
    </Link>
  );
}
