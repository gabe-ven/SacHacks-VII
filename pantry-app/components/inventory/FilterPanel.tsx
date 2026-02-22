"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FilterState } from "@/types/inventory";

const STOCK_OPTIONS: { value: FilterState["stockStatus"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in_stock", label: "In stock" },
  { value: "out_of_stock", label: "Out of stock" },
];

function formatTagLabel(tag: string): string {
  return tag
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  allCategories: string[];
  allTags: string[];
  resultCount: number;
  onClear: () => void;
};

const pillBase =
  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green";
const pillOff =
  "border-border text-muted hover:border-pantry-green hover:text-pantry-green bg-transparent";
const pillOn =
  "border-transparent bg-pantry-green text-pantry-cream";

const SCROLL_STEP = 220;

export default function FilterPanel({
  filters,
  onChange,
  allCategories,
  allTags,
  resultCount,
  onClear,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const categoryExpandRef = useRef<HTMLDivElement>(null);
  const dietaryExpandRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState(false);
  const [dietaryExpanded, setDietaryExpanded] = useState(false);

  const hasCategories = allCategories.length > 0;
  const hasTags = allTags.length > 0;
  const activeCategoryCount = filters.categories.length;
  const activeTagCount = filters.tags.length;

  // Close expanded state when clicking outside either pill area
  useEffect(() => {
    if (!categoryExpanded && !dietaryExpanded) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      const inCategory = categoryExpandRef.current?.contains(target);
      const inDietary = dietaryExpandRef.current?.contains(target);
      if (!inCategory && !inDietary) {
        setCategoryExpanded(false);
        setDietaryExpanded(false);
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [categoryExpanded, dietaryExpanded]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  // Re-check after filters change (pill count may change scroll width)
  useEffect(() => {
    updateScrollState();
  }, [filters, allCategories, allTags, updateScrollState]);

  function scrollBy(delta: number) {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.stockStatus !== "all" ||
    filters.tags.length > 0 ||
    filters.search.trim() !== "";

  function toggleCategory(cat: string) {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  }

  function toggleTag(tag: string) {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: next });
  }

  return (
    <div className="space-y-2">
      {/* Single scrollable row with arrow nav */}
      <div className="flex items-center gap-2">

        {/* Left arrow */}
        <button
          onClick={() => scrollBy(-SCROLL_STEP)}
          disabled={!canScrollLeft}
          aria-label="Scroll filters left"
          className={[
            "shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-border text-pantry-green transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pantry-green",
            canScrollLeft
              ? "opacity-100 hover:bg-pantry-tan/30 cursor-pointer"
              : "opacity-40 cursor-not-allowed",
          ].join(" ")}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable pill row — scrollbar hidden */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex items-center gap-2 w-max">

          {/* Stock status */}
          <div className="flex items-center gap-2" role="group" aria-label="Stock status filter">
            {STOCK_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                role="radio"
                aria-checked={filters.stockStatus === value}
                onClick={() => onChange({ ...filters, stockStatus: value })}
                className={[pillBase, filters.stockStatus === value ? pillOn : pillOff].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Divider between stock and category */}
          {hasCategories && (
            <span className="h-6 w-px bg-border shrink-0 mx-1" aria-hidden="true" />
          )}

          {/* Expandable Category pill */}
          {hasCategories && (
            <div ref={categoryExpandRef} className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCategoryExpanded((v) => !v)}
                aria-expanded={categoryExpanded}
                aria-haspopup="true"
                aria-label={categoryExpanded ? "Hide category filters" : "Show category filters"}
                className={[
                  pillBase,
                  activeCategoryCount > 0 ? pillOn : pillOff,
                ].join(" ")}
              >
                <span>Category</span>
                {activeCategoryCount > 0 && (
                  <span className="opacity-90" aria-hidden>
                    ({activeCategoryCount})
                  </span>
                )}
                <svg
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${categoryExpanded ? "-rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {categoryExpanded && (
                <div className="flex items-center gap-2 animate-filter-pill-in" role="group" aria-label="Category filter">
                  {allCategories.map((cat) => {
                    const active = filters.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        aria-pressed={active}
                        onClick={() => toggleCategory(cat)}
                        className={[pillBase, active ? pillOn : pillOff].join(" ")}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Divider between category and dietary when both exist */}
          {hasCategories && hasTags && (
            <span className="h-6 w-px bg-border shrink-0 mx-1" aria-hidden="true" />
          )}

          {/* Expandable Dietary restrictions pill */}
          {hasTags && (
            <div ref={dietaryExpandRef} className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setDietaryExpanded((v) => !v)}
                aria-expanded={dietaryExpanded}
                aria-haspopup="true"
                aria-label={dietaryExpanded ? "Hide dietary filters" : "Show dietary filters"}
                className={[
                  pillBase,
                  activeTagCount > 0 ? pillOn : pillOff,
                ].join(" ")}
              >
                <span>Dietary restrictions</span>
                {activeTagCount > 0 && (
                  <span className="opacity-90" aria-hidden>
                    ({activeTagCount})
                  </span>
                )}
                <svg
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${dietaryExpanded ? "rotate-90" : "-rotate-90"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dietaryExpanded && (
                <div className="flex items-center gap-2 animate-filter-pill-in" role="group" aria-label="Dietary filter">
                  {allTags.map((tag) => {
                    const active = filters.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        aria-pressed={active}
                        onClick={() => toggleTag(tag)}
                        className={[pillBase, active ? pillOn : pillOff].join(" ")}
                      >
                        {formatTagLabel(tag)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scrollBy(SCROLL_STEP)}
          disabled={!canScrollRight}
          aria-label="Scroll filters right"
          className={[
            "shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-border text-pantry-green transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pantry-green",
            canScrollRight
              ? "opacity-100 hover:bg-pantry-tan/30 cursor-pointer"
              : "opacity-40 cursor-not-allowed",
          ].join(" ")}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>

      {/* Results count + clear — always reserve space to avoid layout shift */}
      <div className="flex items-center gap-3 min-h-[1.5rem] mt-2">
        <p className="text-sm text-foreground/60">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </p>
        <span
          className={`text-foreground/30 text-sm ${hasActiveFilters ? "" : "invisible"}`}
          aria-hidden="true"
        >
          ·
        </span>
        <button
          onClick={onClear}
          aria-label="Clear all filters"
          aria-hidden={!hasActiveFilters}
          tabIndex={hasActiveFilters ? 0 : -1}
          className={`text-sm text-pantry-coral hover:text-pantry-green underline underline-offset-2 transition-colors focus:outline-none cursor-pointer shrink-0 ${hasActiveFilters ? "" : "invisible pointer-events-none"}`}
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}
