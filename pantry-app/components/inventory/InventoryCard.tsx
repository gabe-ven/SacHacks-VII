"use client";

import type { KeyboardEvent } from "react";
import type { InventoryItem } from "@/types/inventory";
import Badge from "@/components/ui/Badge";
import StockBadge from "./StockBadge";

type TagVariant = "green" | "tan" | "amber" | "coral";

const TAG_VARIANTS: Record<string, TagVariant> = {
  vegan: "green",
  halal: "tan",
  "gluten-free": "amber",
  "dairy-free": "coral",
};

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
};

const MAX_SELECTION = 20;

type Props = {
  item: InventoryItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
  selectionCount: number;
};

export default function InventoryCard({ item, isSelected, onToggle, selectionCount }: Props) {
  const isOut = item.stockStatus === "out_of_stock";
  const isLow = item.stockStatus === "low_stock";
  const atMax = selectionCount >= MAX_SELECTION && !isSelected;
  const canToggle = !isOut && !atMax;

  const meta = CATEGORY_META[item.category] ?? { color: "#DDBE86" };

  const ariaLabel = isOut
    ? `${item.name} is out of stock`
    : isLow
    ? `Select ${item.name} (Low stock)`
    : `Select ${item.name} (In stock)`;

  function handleCardClick() {
    if (canToggle) onToggle(item.id);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (canToggle) onToggle(item.id);
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
        "relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 h-full select-none group",
        isOut
          ? "bg-[#f9f9f7] border-[#1a1a1a]/6 opacity-50 grayscale cursor-not-allowed"
          : isSelected
          ? "bg-white border-pantry-green ring-2 ring-pantry-green shadow-md cursor-pointer"
          : canToggle
          ? "bg-white border-[#1a1a1a]/6 hover:border-pantry-green/30 hover:shadow-lg cursor-pointer"
          : "bg-[#f9f9f7] border-[#1a1a1a]/6 cursor-not-allowed opacity-60",
        !isOut ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green" : "",
      ].join(" ")}
    >
      {/* colour accent bar */}
      <div
        className="h-1.5 w-full shrink-0 transition-opacity duration-200"
        style={{ backgroundColor: meta.color, opacity: isOut ? 0.3 : 1 }}
      />

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Top row: emoji + name + checkmark */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={[
                "font-semibold text-base leading-snug",
                isOut ? "text-[#1a1a1a]/30" : "text-[#1a1a1a]",
              ].join(" ")}
            >
              {item.name}
            </h3>
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#1a1a1a]/35 mt-0.5">
              {item.category}
            </p>
          </div>

          {isSelected && (
            <span
              aria-hidden="true"
              className="shrink-0 w-5 h-5 rounded-full bg-pantry-green flex items-center justify-center mt-0.5"
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
          )}
        </div>

        {/* Stock + tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-auto">
          <StockBadge stockStatus={item.stockStatus} />
          {(item.tags?.length ?? 0) > 0 &&
            item.tags!.map((tag) => (
              <Badge key={tag} variant={TAG_VARIANTS[tag] ?? "tan"}>
                {tag}
              </Badge>
            ))}
        </div>

        {atMax && !isOut && (
          <p className="text-[11px] text-[#1a1a1a]/35 mt-1" role="note">
            Max {MAX_SELECTION} items reached
          </p>
        )}
      </div>

      {/* hidden accessible checkbox */}
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
