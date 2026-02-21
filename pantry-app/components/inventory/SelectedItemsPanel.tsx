"use client";

import type { InventoryItem } from "@/types/inventory";

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
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
          Selected{" "}
          <span className="text-gray-400 dark:text-gray-500 font-normal">
            ({count}/{MAX_SELECTION})
          </span>
        </h2>
        {count > 0 && (
          <button
            onClick={onClear}
            aria-label="Clear all selected items"
            className="text-xs text-gray-500 hover:text-black dark:hover:text-white underline underline-offset-2 transition focus:outline-none focus:ring-1 focus:ring-gray-400 rounded"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Item list or empty state */}
      {count === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
            <svg
              className="w-5 h-5 text-gray-400"
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No items selected
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
              className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                {item.name}
              </span>
              <button
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name}`}
                className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-black dark:hover:text-white transition focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
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
        <p
          className="text-xs text-amber-600 dark:text-amber-400 text-center"
          role="alert"
        >
          Max {MAX_SELECTION} items reached
        </p>
      )}

      {/* Find Recipes CTA */}
      <div className="pt-1 space-y-1.5">
        <button
          onClick={onFindRecipes}
          disabled={count === 0}
          aria-disabled={count === 0}
          className={[
            "w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black dark:focus:ring-white",
            count === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
              : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100",
          ].join(" ")}
        >
          {count === 0 ? "Find recipes" : `Find recipes (${count})`}
        </button>
        {count === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Select at least 1 item
          </p>
        )}
      </div>
    </div>
  );
}
