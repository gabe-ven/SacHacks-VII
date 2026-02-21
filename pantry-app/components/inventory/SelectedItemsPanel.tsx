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
};

export default function SelectedItemsPanel({
  selectedItems,
  onRemove,
  onClear,
  onFindRecipes,
}: Props) {
  const count = selectedItems.length;

  return (
    <div className="flex flex-col gap-3" aria-label="Selected items panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-pantry-green text-sm">
          Selected{" "}
          <span className="text-foreground/50 font-normal">
            ({count}/{MAX_SELECTION})
          </span>
        </h2>
        {count > 0 && (
          <button
            onClick={onClear}
            aria-label="Clear all selected items"
            className="text-xs text-pantry-coral hover:text-pantry-green underline underline-offset-2 transition-colors focus:outline-none cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Item list or empty state */}
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-10 h-10 rounded-full bg-pantry-tan/30 flex items-center justify-center mb-2">
            <svg
              className="w-5 h-5 text-pantry-green/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h14"
              />
            </svg>
          </div>
          <p className="text-sm text-foreground/60">No items selected</p>
          <p className="text-xs text-foreground/40 mt-1">
            Add items from the grid
          </p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Selected items list">
          {selectedItems.map((item) => {
            const meta = CATEGORY_META[item.category] ?? { color: "#DDBE86" };
            return (
              <li
                key={item.id}
                className="rounded-2xl border border-[#1a1a1a]/6 bg-white shadow-sm overflow-hidden"
              >
                {/* Category accent bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: meta.color }} />

                {/* Card body */}
                <div className="px-4 py-3 flex items-start gap-3">
                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug text-[#1a1a1a] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#1a1a1a]/35 mt-0.5">
                      {item.category}
                    </p>
                  </div>

                  {/* Remove button */}
                  <div className="shrink-0">
                    <button
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-pantry-coral/50 hover:bg-pantry-coral/10 hover:text-pantry-coral transition-colors focus:outline-none cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Stock badge */}
                <div className="px-4 pb-3">
                  <StockBadge stockStatus={item.stockStatus} />
                </div>
              </li>
            );
          })}
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
          disabled={count === 0}
          onClick={onFindRecipes}
        >
          {count === 0 ? "Find recipes" : `Find recipes (${count})`}
        </Button>
        {count === 0 && (
          <p className="text-xs text-foreground/50 text-center">
            Select at least 1 item
          </p>
        )}
      </div>
    </div>
  );
}
