"use client";

import type { KeyboardEvent } from "react";
import type { InventoryItem } from "@/types/inventory";

type TagVariant = "green" | "tan" | "amber" | "coral";

const TAG_VARIANTS: Record<string, TagVariant> = {
  vegan: "green",
  vegetarian: "green",
  halal: "tan",
  "gluten-free": "amber",
  gluten_free: "amber",
  "dairy-free": "coral",
  dairy_free: "coral",
};

const TAG_COLORS: Record<TagVariant, string> = {
  green: "bg-pantry-green/10 text-pantry-green border-pantry-green/20",
  tan:   "bg-pantry-tan/20 text-pantry-tan border-pantry-tan/30",
  amber: "bg-pantry-amber/10 text-pantry-amber border-pantry-amber/20",
  coral: "bg-pantry-coral/10 text-pantry-coral border-pantry-coral/20",
};

// Shared category → color + short label (keep in sync with SelectedItemsPanel)
export const CATEGORY_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  Produce:               { bg: "#5E7F64", text: "#fff",    label: "Produce"   },
  Dairy:                 { bg: "#DDBE86", text: "#312F2D", label: "Dairy"     },
  Milk:                  { bg: "#DDBE86", text: "#312F2D", label: "Dairy"     },
  Snacks:                { bg: "#EEB467", text: "#312F2D", label: "Snacks"    },
  "Canned Goods":        { bg: "#E37861", text: "#fff",    label: "Canned"    },
  "Canned/Jarred Foods": { bg: "#E37861", text: "#fff",    label: "Canned"    },
  Canned:                { bg: "#E37861", text: "#fff",    label: "Canned"    },
  Grains:                { bg: "#DDBE86", text: "#312F2D", label: "Grains"    },
  "Dry/Baking Goods":    { bg: "#DDBE86", text: "#312F2D", label: "Bakery"    },
  Necessities:           { bg: "#5E7F64", text: "#fff",    label: "Essential" },
  Beverages:             { bg: "#EEB467", text: "#312F2D", label: "Drinks"    },
  Protein:               { bg: "#E37861", text: "#fff",    label: "Protein"   },
  "Protein/Meat":        { bg: "#E37861", text: "#fff",    label: "Protein"   },
  Bakery:                { bg: "#EEB467", text: "#312F2D", label: "Bakery"    },
  Frozen:                { bg: "#92A9C0", text: "#fff",    label: "Frozen"    },
  "Personal Care":       { bg: "#B0A8B9", text: "#fff",    label: "Personal"  },
  Pantry:                { bg: "#DDBE86", text: "#312F2D", label: "Pantry"    },
  Hygiene:               { bg: "#92A9C0", text: "#fff",    label: "Hygiene"   },
};

const MAX_SELECTION = 20;

function formatTagLabel(tag: string): string {
  return tag
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type Props = {
  item: InventoryItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
  selectionCount: number;
  onBlockedSelect?: (message: string) => void;
};

export default function InventoryCard({
  item,
  isSelected,
  onToggle,
  selectionCount,
  onBlockedSelect,
}: Props) {
  const isOut = item.stockStatus === "out_of_stock";
  const isLow = item.stockStatus === "low_stock";
  const isPersonalCare = item.category.trim().toLowerCase() === "personal care";
  const atMax = selectionCount >= MAX_SELECTION && !isSelected;
  const canToggle = !isOut && !atMax && !isPersonalCare;
  const style = CATEGORY_STYLE[item.category] ?? { bg: "#DDBE86", text: "#312F2D", label: item.category };

  const ariaLabel = isPersonalCare
    ? `${item.name} — personal care, not eligible for recipes`
    : isOut
    ? `${item.name} — out of stock`
    : `Select ${item.name}`;

  function handleCardClick() {
    if (canToggle) { onToggle(item.id); return; }
    if (isPersonalCare) onBlockedSelect?.("Personal care items are not eligible for recipes.");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  }

  return (
    <article
      role="checkbox"
      aria-checked={isSelected}
      aria-disabled={isOut || (!canToggle && !isSelected)}
      aria-label={ariaLabel}
      tabIndex={isOut ? -1 : 0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={[
        "relative flex rounded-2xl overflow-hidden select-none transition-all duration-200 h-[96px]",
        "border",
        isOut
          ? "opacity-40 grayscale cursor-not-allowed border-border"
          : isPersonalCare
          ? "cursor-not-allowed opacity-60 border-border"
          : isSelected
          ? "border-pantry-green ring-2 ring-pantry-green/25 shadow-md cursor-pointer"
          : canToggle
          ? "border-border hover:border-pantry-green/40 hover:shadow-md cursor-pointer"
          : "border-border cursor-not-allowed opacity-60",
        !isOut ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green" : "focus:outline-none",
      ].join(" ")}
    >
      {/* Left accent bar */}
      <div
        className="w-9 shrink-0 flex items-center justify-center"
        style={{ backgroundColor: style.bg }}
        aria-hidden="true"
      >
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: style.text,
            opacity: 0.85,
            fontSize: "8px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxHeight: "80px",
          }}
        >
          {style.label}
        </span>
      </div>

      {/* Card body */}
      <div
        className={[
          "flex flex-col justify-between p-3.5 flex-1 min-w-0 transition-colors duration-200 overflow-hidden",
          isSelected ? "bg-pantry-green/5" : "bg-surface-card",
        ].join(" ")}
      >
        {/* Top row: name + stock status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className={[
            "text-sm font-semibold leading-snug tracking-tight flex-1 min-w-0 line-clamp-2",
            isOut ? "text-muted" : "text-foreground",
          ].join(" ")}>
            {item.name}
          </h3>

          {/* Stock in top-right */}
          <span className={[
            "shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest mt-0.5",
            isOut ? "text-muted" : isLow ? "text-pantry-amber" : "text-pantry-green",
          ].join(" ")}>
            <span className={[
              "w-1.5 h-1.5 rounded-full",
              isOut ? "bg-muted" : isLow ? "bg-pantry-amber" : "bg-pantry-green",
            ].join(" ")} />
            {isOut ? "Out" : isLow ? "Low" : "In stock"}
          </span>
        </div>

        {/* Bottom row: tags OR notes */}
        <div className="flex items-center gap-1 overflow-hidden">
          {atMax && !isOut ? (
            <span className="text-[9px] text-muted">Max {MAX_SELECTION} reached</span>
          ) : isPersonalCare ? (
            <span className="text-[9px] text-muted">Not for recipes</span>
          ) : item.tags.length > 0 ? (
            item.tags.slice(0, 3).map((tag) => {
              const variant = TAG_VARIANTS[tag] ?? "tan";
              return (
                <span
                  key={tag}
                  className={[
                    "text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full border shrink-0",
                    TAG_COLORS[variant],
                  ].join(" ")}
                >
                  {formatTagLabel(tag)}
                </span>
              );
            })
          ) : null}

          {/* Selected checkmark (bottom-right) */}
          {isSelected && (
            <span
              aria-hidden="true"
              className="ml-auto shrink-0 w-5 h-5 rounded-full bg-pantry-green flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
          )}
        </div>
      </div>

      <input
        type="checkbox"
        checked={isSelected}
        disabled={isOut}
        aria-label={ariaLabel}
        tabIndex={-1}
        onChange={() => { if (canToggle) onToggle(item.id); }}
        onClick={(e) => e.stopPropagation()}
        className="sr-only"
      />
    </article>
  );
}
