"use client";

import { useEffect, useRef, useState } from "react";

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
  const sortRef = useRef<HTMLDivElement>(null);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (!sortOpen) return;
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [sortOpen]);

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
          className="w-full pl-10 pr-10 py-2.5 !rounded-full border-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:border-pantry-green focus-visible:ring-2 focus-visible:ring-pantry-green/30 focus-visible:ring-offset-0 [background:var(--search-bg)] [border-color:var(--search-border)]"
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

      {/* Sort — custom dropdown so menu respects dark mode */}
      <div ref={sortRef} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setSortOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={sortOpen}
          aria-label="Sort by"
          className="w-full min-w-[8rem] inline-flex items-center justify-between gap-2 pl-4 pr-9 py-2.5 rounded-full border border-border bg-surface-card text-sm font-medium text-foreground transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green hover:border-pantry-green/40 hover:text-pantry-green"
        >
          <span>{SORT_LABELS[sortKey]}</span>
          <svg
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none transition-transform ${sortOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {sortOpen && (
          <ul
            role="listbox"
            aria-label="Sort options"
            className="absolute top-full left-0 right-0 mt-1.5 py-1 rounded-xl border border-border bg-surface-card shadow-lg z-50 min-w-[8rem]"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <li key={k} role="option" aria-selected={sortKey === k}>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange(k);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer first:rounded-t-[0.6rem] last:rounded-b-[0.6rem] ${
                    sortKey === k
                      ? "bg-pantry-green text-pantry-cream"
                      : "text-foreground hover:bg-border/50"
                  }`}
                >
                  {SORT_LABELS[k]}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
