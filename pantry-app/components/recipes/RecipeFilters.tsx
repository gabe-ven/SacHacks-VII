export type SortKey = "match" | "time" | "alpha";

const SORT_LABELS: Record<SortKey, string> = {
  match: "Best match",
  time: "Cook time",
  alpha: "A – Z",
};

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"] as const;

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  sortKey: SortKey;
  onSortChange: (v: SortKey) => void;
  difficulty: string;
  onDifficultyChange: (v: string) => void;
}

export default function RecipeFilters({
  search,
  onSearchChange,
  sortKey,
  onSortChange,
  difficulty,
  onDifficultyChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search — pill styling to match inventory page */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pantry-green/50 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search recipes or ingredients…"
          aria-label="Search recipes"
          className="w-full pl-10 pr-4 py-2.5 !rounded-full border-2 border-gray-300 bg-gray-100 text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:border-pantry-green transition"
        />
      </div>

      {/* Difficulty pills — same hover as inventory FilterPanel categories */}
      <div className="flex gap-1.5 shrink-0">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onDifficultyChange(d)}
            className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green ${
              difficulty === d
                ? "border-transparent bg-pantry-green text-pantry-cream"
                : "border-border text-muted bg-transparent hover:border-pantry-green hover:text-pantry-green"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Sort — same hover as inventory pills */}
      <div className="relative shrink-0 group">
        <select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="appearance-none pl-4 pr-9 py-2.5 rounded-full border border-border bg-transparent text-sm font-medium text-muted transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green hover:border-pantry-green hover:text-pantry-green"
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
            <option key={k} value={k}>{SORT_LABELS[k]}</option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-hover:text-pantry-green pointer-events-none transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
