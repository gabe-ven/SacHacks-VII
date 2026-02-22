"use client";

import type { InventoryItem } from "@/types/inventory";
import Button from "@/components/ui/Button";
import StockBadge from "./StockBadge";

const MAX_SELECTION = 20;

const CATEGORY_META: Record<string, { color: string }> = {
  "Produce":             { color: "#5E7F64" },
  "Dairy":               { color: "#6C90B2" },
  "Canned/Jarred Foods": { color: "#E3694F" },
  "Dry/Baking Goods":    { color: "#CCAA6C" },
  "Personal Care":       { color: "#A592C0" },
};

type Props = {
  selectedItems: InventoryItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onFindRecipes: () => void;
  canFindRecipes: boolean;
};

export default function SelectedItemsPanel({
  selectedItems,
  onRemove,
  onClear,
  onFindRecipes,
  canFindRecipes,
}: Props) {
  const count = selectedItems.length;

  return (
    <div className="flex flex-col gap-3" aria-label="Selected items panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-pantry-green text-sm">
          Selected{" "}
          <span className="text-[#1a1a1a]/40 font-normal">
            ({count}/{MAX_SELECTION})
          </span>
        </h2>
        {count > 0 && (
          <button
            onClick={onClear}
            aria-label="Clear all selected items"
            className="text-xs text-pantry-green hover:text-pantry-green/70 underline underline-offset-2 transition-colors focus:outline-none cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Item list or empty state */}
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-pantry-amber/15 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-pantry-green/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h14" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted">Nothing here yet</p>
          <p className="text-xs text-muted mt-1">Tap items to add them</p>
        </div>
      ) : (
        <ul
          className="space-y-1.5 overflow-y-auto pr-0.5"
          style={{ maxHeight: "min(360px, 40vh)" }}
          aria-label="Selected items list"
        >
          {selectedItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 bg-surface rounded-lg border border-border overflow-hidden"
            >
              {/* Category color strip */}
              <div
                className="w-1 self-stretch shrink-0"
                style={{ backgroundColor: (CATEGORY_META[item.category] ?? { color: "#DDBE86" }).color }}
                aria-hidden="true"
              />

              {/* Name */}
              <p className="flex-1 min-w-0 py-2 text-xs font-semibold text-foreground leading-snug truncate">
                {item.name}
              </p>

              {/* Remove button */}
              <button
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name}`}
                className="shrink-0 mr-1.5 w-5 h-5 flex items-center justify-center rounded-full text-muted hover:text-pantry-coral hover:bg-pantry-coral/10 transition-colors focus:outline-none cursor-pointer"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Max selection warning */}
      {count >= MAX_SELECTION && (
        <p className="text-xs text-pantry-amber text-center font-medium" role="alert">
          Max {MAX_SELECTION} items reached
        </p>
      )}

      {/* Find Recipes CTA */}
      <div className="pt-1 space-y-1.5">
        <Button
          variant="primary"
          fullWidth
          disabled={!canFindRecipes}
          onClick={onFindRecipes}
        >
          {count === 0 ? "Find recipes" : `Find recipes (${count})`}
        </Button>
        {count === 0 && (
          <p className="text-xs text-foreground/50 text-center">
            Select at least 1 item
          </p>
        )}
        {count > 0 && !canFindRecipes && (
          <p className="text-xs text-foreground/50 text-center">
            Personal care items are excluded from recipes
          </p>
        )}
      </div>
    </div>
  );
}
