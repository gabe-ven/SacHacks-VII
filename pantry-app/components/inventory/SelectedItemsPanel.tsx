"use client";

import type { InventoryItem } from "@/types/inventory";
import Button from "@/components/ui/Button";

const MAX_SELECTION = 20;

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
    <div className="flex flex-col gap-3 h-full" aria-label="Selected items panel">
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
            className="text-xs text-pantry-coral hover:text-pantry-green underline underline-offset-2 transition-colors focus:outline-none"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Item list or empty state */}
      {count === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
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
        <ul
          className="flex-1 overflow-y-auto space-y-1.5 pr-0.5"
          aria-label="Selected items list"
        >
          {selectedItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 py-1.5 px-3 rounded-full bg-pantry-cream border border-pantry-tan"
            >
              <span className="text-sm text-foreground truncate">{item.name}</span>
              <button
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name}`}
                className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-foreground/40 hover:text-pantry-coral transition-colors focus:outline-none"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
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
