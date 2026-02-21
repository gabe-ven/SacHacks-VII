"use client";

import type { FilterState } from "@/types/inventory";

const STOCK_OPTIONS: { value: FilterState["stockStatus"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-stock", label: "In stock" },
  { value: "out", label: "Out of stock" },
  { value: "unknown", label: "Unknown" },
];

const TAG_LABELS: Record<string, string> = {
  vegan: "Vegan",
  halal: "Halal",
  "gluten-free": "Gluten-free",
  "dairy-free": "Dairy-free",
};

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  allCategories: string[];
  allTags: string[];
  resultCount: number;
  onClear: () => void;
};

export default function FilterPanel({
  filters,
  onChange,
  allCategories,
  allTags,
  resultCount,
  onClear,
}: Props) {
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
    <div className="space-y-5">
      {/* Results count + clear */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/60">
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs text-pantry-coral hover:text-pantry-green underline underline-offset-2 transition-colors focus:outline-none"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Stock status */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-pantry-green mb-2.5">
          Stock Status
        </legend>
        <div className="space-y-2">
          {STOCK_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2.5 text-sm cursor-pointer group"
            >
              <input
                type="radio"
                name="stockStatus"
                value={value}
                checked={filters.stockStatus === value}
                onChange={() => onChange({ ...filters, stockStatus: value })}
                className="w-3.5 h-3.5 accent-pantry-green"
              />
              <span className="text-foreground/80 group-hover:text-pantry-green transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Category */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-pantry-green mb-2.5">
          Category
        </legend>
        <div className="space-y-2">
          {allCategories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 text-sm cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-3.5 h-3.5 rounded accent-pantry-green"
              />
              <span className="text-foreground/80 group-hover:text-pantry-green transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Dietary tags */}
      {allTags.length > 0 && (
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-pantry-green mb-2.5">
            Dietary
          </legend>
          <div className="space-y-2">
            {allTags.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-2.5 text-sm cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                  className="w-3.5 h-3.5 rounded accent-pantry-green"
                />
                <span className="text-foreground/80 group-hover:text-pantry-green transition-colors">
                  {TAG_LABELS[tag] ?? tag}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
