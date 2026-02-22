"use client";

import type { KeyboardEvent } from "react";
import type { InventoryItem } from "@/types/inventory";
import Badge from "@/components/ui/Badge";

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

const CATEGORY_STYLE: Record<string, { bg: string; text: string }> = {
  Produce:        { bg: "#5E7F64", text: "#fff" },
  Dairy:          { bg: "#DDBE86", text: "#312F2D" },
  Milk:           { bg: "#DDBE86", text: "#312F2D" },
  Snacks:         { bg: "#EEB467", text: "#312F2D" },
  "Canned Goods": { bg: "#E37861", text: "#fff" },
  Canned:         { bg: "#E37861", text: "#fff" },
  Grains:         { bg: "#DDBE86", text: "#312F2D" },
  Necessities:    { bg: "#5E7F64", text: "#fff" },
  Beverages:      { bg: "#EEB467", text: "#312F2D" },
  Protein:        { bg: "#E37861", text: "#fff" },
  Bakery:         { bg: "#EEB467", text: "#312F2D" },
  Frozen:         { bg: "#92A9C0", text: "#fff" },
};

const MAX_SELECTION = 20;

function formatTagLabel(tag: string): string {
  return tag
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
  const isPersonalCare = item.category.trim().toLowerCase() === "personal care";
  const atMax = selectionCount >= MAX_SELECTION && !isSelected;
  const canToggle = !isOut && !atMax && !isPersonalCare;
  const style = CATEGORY_STYLE[item.category] ?? { bg: "#DDBE86", text: "#312F2D" };

  const ariaLabel = isPersonalCare
    ? `${item.name} is personal care and cannot be selected for recipes`
    : isOut
    ? `${item.name} is out of stock`
    : `Select ${item.name} (In stock)`;

  function showBlockedMessage() {
    if (isPersonalCare) {
      onBlockedSelect?.("Personal care items are not eligible for recipes.");
    }
  }

  function handleCardClick() {
    if (canToggle) {
      onToggle(item.id);
      return;
    }
    showBlockedMessage();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (canToggle) {
        onToggle(item.id);
        return;
      }
      showBlockedMessage();
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
        "relative flex rounded-xl overflow-hidden h-full select-none transition-all duration-200 border border-border",
        isOut
          ? "opacity-40 grayscale cursor-not-allowed"
          : isPersonalCare
          ? "cursor-not-allowed opacity-60"
          : isSelected
          ? "ring-2 ring-pantry-green shadow-md cursor-pointer"
          : canToggle
          ? "bg-surface-card hover:border-pantry-green/30 hover:shadow-lg cursor-pointer"
          : "bg-surface cursor-not-allowed opacity-60",
        !isOut ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green" : "focus:outline-none",
      ].join(" ")}
    >
      {/* Left color block with rotated category label */}
      <div
        className="w-10 shrink-0 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: style.bg }}
        aria-hidden="true"
      >
        <span
          className="font-black uppercase"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: style.text,
            opacity: 0.7,
            fontSize: "9px",
            letterSpacing: "0.2em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxHeight: "100%",
          }}
        >
          {item.category}
        </span>
      </div>

      {/* Right: content */}
      <div className="flex flex-col justify-between gap-3 p-4 bg-surface-card flex-1 min-w-0">

        {/* Name + checkmark */}
        <div className="flex items-start justify-between gap-2">
          <h3 className={[
            "text-[1.05rem] font-bold leading-snug tracking-tight",
            isOut ? "text-muted" : "text-foreground",
          ].join(" ")}>
            {item.name}
          </h3>
          {isSelected && (
            <span
              aria-hidden="true"
              className="shrink-0 w-4 h-4 rounded-full bg-pantry-green flex items-center justify-center mt-0.5"
            >
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
          )}
        </div>

        {/* Stock indicator */}
        <div className="flex items-center gap-1.5">
          <span className={[
            "w-1.5 h-1.5 rounded-full shrink-0",
            isOut ? "bg-muted" : isLow ? "bg-pantry-amber" : "bg-pantry-green",
          ].join(" ")} />
          <span className={[
            "text-[10px] font-semibold uppercase tracking-wide",
            isOut ? "text-muted" : isLow ? "text-pantry-amber" : "text-pantry-green",
          ].join(" ")}>
            {isOut ? "Out of stock" : "In stock"}
          </span>
        </div>

        {/* Dietary tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-auto">
            {item.tags.map((tag) => (
              <Badge key={tag} variant={TAG_VARIANTS[tag] ?? "tan"}>
                {formatTagLabel(tag)}
              </Badge>
            ))}
          </div>
        )}

        {atMax && !isOut && (
          <p className="text-[10px] text-muted" role="note">Max {MAX_SELECTION} selected</p>
        )}
        {isPersonalCare && (
          <p className="text-[10px] text-pantry-coral/80" role="note">Not eligible for recipes</p>
        )}
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
