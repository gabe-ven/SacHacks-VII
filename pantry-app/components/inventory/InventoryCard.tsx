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

const MAX_SELECTION = 20;

type Props = {
  item: InventoryItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
  selectionCount: number;
};

export default function InventoryCard({
  item,
  isSelected,
  onToggle,
  selectionCount,
}: Props) {
  const isOut = item.stockStatus === "out_of_stock";
  const isLow = item.stockStatus === "low_stock";
  const atMax = selectionCount >= MAX_SELECTION && !isSelected;
  const canToggle = !isOut && !atMax;

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
        "relative flex flex-col gap-2.5 rounded-2xl border p-5 transition-all duration-150 h-full select-none",
        isOut
          ? "bg-white/40 border-pantry-tan/40 opacity-50 grayscale cursor-not-allowed"
          : isSelected
          ? "bg-pantry-green/10 border-pantry-green/40 ring-2 ring-pantry-green cursor-pointer"
          : canToggle
          ? isLow
            ? "bg-white/60 border-pantry-amber/50 hover:bg-white hover:border-pantry-amber cursor-pointer"
            : "bg-white/60 border-pantry-tan hover:bg-white hover:border-pantry-green/40 cursor-pointer"
          : "bg-white/60 border-pantry-tan cursor-not-allowed opacity-70",
        !isOut ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green" : "",
      ].join(" ")}
    >
      {/* Top row: name/category + check icon */}
      <div className="flex items-start gap-2.5">
        {/* Hidden checkbox — screen-reader accessible, stopPropagation prevents double-toggle */}
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

        {/* Name + category */}
        <div className="flex-1 min-w-0">
          <h3
            className={[
              "font-semibold leading-snug",
              isOut ? "text-foreground/40" : "text-foreground",
            ].join(" ")}
          >
            {item.name}
          </h3>
          <p className="text-xs text-foreground/50 mt-0.5">{item.category}</p>
        </div>

        {/* SVG checkmark when selected */}
        {isSelected && (
          <span aria-hidden="true" className="shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 text-pantry-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Stock badge — always shown, even when selected */}
      <div className="flex flex-wrap items-center gap-2">
        <StockBadge stockStatus={item.stockStatus} />
      </div>

      {/* Dietary tags */}
      {(item.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1" aria-label="Dietary tags">
          {item.tags!.map((tag) => (
            <Badge key={tag} variant={TAG_VARIANTS[tag] ?? "tan"}>
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* At-max note */}
      {atMax && !isOut && (
        <p className="text-xs text-foreground/40 mt-auto" role="note">
          Max {MAX_SELECTION} items selected
        </p>
      )}
    </article>
  );
}
