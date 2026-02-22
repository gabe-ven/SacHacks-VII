"use client";

import type { InventoryItem } from "@/types/inventory";
import Button from "@/components/ui/Button";
import StockBadge from "./StockBadge";

const MAX_SELECTION = 20;

const CATEGORY_META: Record<string, { color: string }> = {
  Produce:        { color: "#5E7F64" },
  Dairy:          { color: "#DDBE86" },
  Milk:           { color: "#DDBE86" },
  Snacks:         { color: "#EEB467" },
  "Canned Goods": { color: "#E37861" },
  Canned:         { color: "#E37861" },
  Grains:         { color: "#DDBE86" },
  Necessities:    { color: "#5E7F64" },
  Beverages:      { color: "#EEB467" },
  Protein:        { color: "#E37861" },
  Bakery:         { color: "#EEB467" },
  Frozen:         { color: "#92A9C0" },
  Pantry:         { color: "#DDBE86" },
  Hygiene:        { color: "#92A9C0" },
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
            className="text-xs text-pantry-green hover:text-pantry-green/70 underline underline-offset-2 transition-colors focus:outline-none"
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
          <p className="text-sm font-medium text-[#1a1a1a]/50">Nothing here yet</p>
          <p className="text-xs text-[#1a1a1a]/30 mt-1">Tap items to add them</p>
        </div>
      ) : (
        <ul className="space-y-2" aria-label="Selected items list">
          {selectedItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2.5 bg-white rounded-xl border border-[#1a1a1a]/6 overflow-hidden shadow-sm"
            >
              {/* Category color strip */}
              <div className="w-1 self-stretch bg-pantry-amber shrink-0" aria-hidden="true" />

              {/* Name + category */}
              <div className="flex-1 min-w-0 py-2.5">
                <p className="text-sm font-semibold text-[#1a1a1a] leading-snug truncate">{item.name}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#1a1a1a]/35 mt-0.5">{item.category}</p>
              </div>

              {/* Remove button */}
              <button
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name}`}
                className="shrink-0 mr-2 w-6 h-6 flex items-center justify-center rounded-full text-[#1a1a1a]/20 hover:text-pantry-coral hover:bg-pantry-coral/10 transition-colors focus:outline-none cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
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
