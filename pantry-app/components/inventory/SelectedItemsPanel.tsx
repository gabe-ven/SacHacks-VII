"use client";

import Image from "next/image";
import type { InventoryItem } from "@/types/inventory";
import Button from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

const MAX_SELECTION = 20;

// Match InventoryCard: category bar + label
const CATEGORY_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  "Produce":               { bg: "#5E7F64", text: "#fff",    label: "Produce"  },
  "Dairy":                 { bg: "#6C90B2", text: "#fff",    label: "Dairy"    },
  "Canned/Jarred Foods":   { bg: "#E3694F", text: "#fff",    label: "Canned"   },
  "Dry/Baking Goods":      { bg: "#CCAA6C", text: "#312F2D", label: "Bakery"   },
  "Personal Care":         { bg: "#A592C0", text: "#fff",    label: "Personal" },
};

const CATEGORY_IMAGE: Record<string, string> = {
  "Produce": "/image1.jpeg",
  "Dairy": "/image2.jpg",
  "Canned/Jarred Foods": "/image3.jpeg",
  "Dry/Baking Goods": "/image2.jpg",
  "Personal Care": "/image3.jpeg",
};

type Props = {
  selectedItems: InventoryItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onFindRecipes: () => void;
  canFindRecipes: boolean;
};

function getItemImage(item: InventoryItem): string {
  const fallback = CATEGORY_IMAGE[item.category] ?? "/pantry.png";
  return item.imageUrl?.trim() ? item.imageUrl : fallback;
}

export default function SelectedItemsPanel({
  selectedItems,
  onRemove,
  onClear,
  onFindRecipes,
  canFindRecipes,
}: Props) {
  const { theme } = useTheme();
  const count = selectedItems.length;

  return (
    <div className="flex flex-col gap-3" aria-label="Selected items panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-pantry-green text-sm">
          Selected{" "}
          <span className="text-foreground/40 font-normal">
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
          className="selected-items-scroll space-y-3 overflow-y-auto"
          style={{ maxHeight: "min(420px, 50vh)" }}
          aria-label="Selected items list"
        >
          {selectedItems.map((item) => {
            const cardImage = getItemImage(item);
            const style = CATEGORY_STYLE[item.category] ?? { bg: "#DDBE86", text: "#312F2D", label: item.category };
            return (
              <li
                key={item.id}
                className="flex rounded-2xl overflow-hidden border border-border bg-surface-card shadow-sm"
              >
                {/* Left accent bar (same as InventoryCard) */}
                <div
                  className="w-6 shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: style.bg }}
                  aria-hidden="true"
                >
                  <span
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      color: style.text,
                      opacity: 0.85,
                      fontSize: "6px",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      maxHeight: "56px",
                    }}
                  >
                    {style.label}
                  </span>
                </div>

                {/* Card body: image + name */}
                <div className="flex flex-1 min-w-0 p-2 items-center gap-2">
                  <div className="relative h-14 w-14 shrink-0 rounded-lg bg-transparent flex items-center justify-center overflow-hidden">
                    <Image
                      src={cardImage}
                      alt=""
                      width={56}
                      height={56}
                      unoptimized
                      className={[
                        "w-full h-full object-contain",
                        theme === "dark" ? "mix-blend-normal" : "mix-blend-multiply",
                      ].join(" ")}
                    />
                  </div>
                  <p className="flex-1 min-w-0 text-xs font-semibold leading-tight text-foreground line-clamp-2">
                    {item.name}
                  </p>
                  <button
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-muted hover:text-pantry-coral hover:bg-pantry-coral/10 transition-colors focus:outline-none cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
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
          disabled={!canFindRecipes}
          onClick={onFindRecipes}
          className="!text-white font-bold"
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
