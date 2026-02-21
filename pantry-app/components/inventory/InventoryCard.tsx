"use client";

import type { InventoryItem } from "@/types/inventory";
import StockBadge from "./StockBadge";

const TAG_COLORS: Record<string, string> = {
  vegan:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  halal:
    "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
  "gluten-free":
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  "dairy-free":
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
};

const MAX_SELECTION = 20;

type Props = {
  item: InventoryItem;
  isSelected: boolean;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  selectionCount: number;
};

export default function InventoryCard({
  item,
  isSelected,
  onAdd,
  onRemove,
  selectionCount,
}: Props) {
  const isOut = item.inStock === false;
  const isUnknown = item.inStock === null;
  const atMax = selectionCount >= MAX_SELECTION && !isSelected;
  const canAdd = !isOut && !isSelected && !atMax;

  return (
    <article
      aria-label={item.name}
      className={[
        "relative flex flex-col gap-2.5 rounded-xl border p-4 transition-all duration-150 h-full",
        isOut
          ? "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40"
          : isSelected
          ? "border-black bg-white shadow-md ring-2 ring-black dark:border-white dark:bg-gray-900 dark:ring-white"
          : "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500",
      ].join(" ")}
    >
      {/* Expires soon badge — positioned top-right */}
      {item.expiresSoon && (
        <span
          className="absolute top-3 right-3 px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
          aria-label="Expires soon"
        >
          Expires soon
        </span>
      )}

      {/* Name + category + unit */}
      <div className={item.expiresSoon ? "pr-20" : ""}>
        <h3
          className={[
            "font-semibold leading-snug",
            isOut
              ? "text-gray-400 dark:text-gray-600"
              : "text-gray-900 dark:text-white",
          ].join(" ")}
        >
          {item.name}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {item.category}
          {item.unit && (
            <span className="ml-1.5">· {item.unit}</span>
          )}
        </p>
      </div>

      {/* Stock badge */}
      <div className="flex flex-wrap items-center gap-2">
        <StockBadge inStock={item.inStock} />
      </div>

      {/* Dietary tags */}
      {(item.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1" aria-label="Dietary tags">
          {item.tags!.map((tag) => (
            <span
              key={tag}
              className={[
                "px-1.5 py-0.5 rounded text-xs border",
                TAG_COLORS[tag] ??
                  "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
              ].join(" ")}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Unknown availability warning */}
      {isUnknown && (
        <p className="text-xs text-amber-600 dark:text-amber-400" role="note">
          ⚠ Availability may vary
        </p>
      )}

      {/* Action button — pushed to bottom */}
      <div className="mt-auto pt-0.5">
        {isSelected ? (
          <button
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name} from selection`}
            className="w-full py-1.5 px-3 rounded-lg text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black dark:focus:ring-white"
          >
            ✓ Added — Remove
          </button>
        ) : isOut ? (
          <button
            disabled
            aria-disabled="true"
            aria-label={`${item.name} is unavailable`}
            className="w-full py-1.5 px-3 rounded-lg text-sm font-medium border border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:text-gray-600"
          >
            Unavailable
          </button>
        ) : (
          <button
            onClick={() => canAdd && onAdd(item.id)}
            disabled={!canAdd}
            aria-disabled={!canAdd}
            aria-label={
              atMax
                ? `Max ${MAX_SELECTION} items reached`
                : `Add ${item.name} to selection`
            }
            title={atMax ? `Max ${MAX_SELECTION} items selected` : undefined}
            className={[
              "w-full py-1.5 px-3 rounded-lg text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black dark:focus:ring-white",
              canAdd
                ? "border-gray-300 text-gray-800 hover:border-black hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:border-white dark:hover:bg-gray-800"
                : "border-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:text-gray-600",
            ].join(" ")}
          >
            + Add
          </button>
        )}
      </div>
    </article>
  );
}
