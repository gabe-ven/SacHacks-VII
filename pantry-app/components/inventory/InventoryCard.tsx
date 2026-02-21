"use client";

import type { KeyboardEvent } from "react";
import type { InventoryItem } from "@/types/inventory";
import Badge from "@/components/ui/Badge";

type TagVariant = "green" | "tan" | "amber" | "coral";

const TAG_VARIANTS: Record<string, TagVariant> = {
  vegan: "green",
  halal: "tan",
  "gluten-free": "amber",
  "dairy-free": "coral",
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
  const style = CATEGORY_STYLE[item.category] ?? { bg: "#DDBE86", text: "#312F2D" };

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
        "relative flex rounded-xl overflow-hidden h-full select-none transition-all duration-200 border border-[#1a1a1a]/8",
        isOut
          ? "opacity-40 grayscale cursor-not-allowed"
          : isSelected
          ? "ring-2 ring-pantry-green ring-offset-1 shadow-md -translate-y-0.5 cursor-pointer"
          : canToggle
          ? "bg-white border-[#1a1a1a]/6 hover:border-pantry-green/30 hover:shadow-lg cursor-pointer"
          : "bg-[#f9f9f7] border-[#1a1a1a]/6 cursor-not-allowed opacity-60",
        !isOut ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green" : "",
      ].join(" ")}
    >
      {/* Left color block with rotated category label */}
      <div
        className="w-10 shrink-0 flex items-center justify-center"
        style={{ backgroundColor: style.bg }}
        aria-hidden="true"
      >
        <span
          className="text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: style.text,
            opacity: 0.7,
          }}
        >
          {item.category}
        </span>
      </div>

      {/* Right: content */}
      <div className="flex flex-col justify-between gap-3 p-4 bg-white flex-1 min-w-0">

        {/* Stock indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className={[
              "w-1.5 h-1.5 rounded-full shrink-0",
              isOut ? "bg-[#1a1a1a]/20" : isLow ? "bg-pantry-amber" : "bg-pantry-green",
            ].join(" ")}
          />
          <span className={[
            "text-[10px] font-semibold uppercase tracking-wide",
            isOut ? "text-[#1a1a1a]/25" : isLow ? "text-pantry-amber" : "text-pantry-green",
          ].join(" ")}>
            {isOut ? "Out of stock" : isLow ? "Low stock" : "In stock"}
          </span>
        </div>

        {/* Item name */}
        <h3 className={[
          "text-[1.05rem] font-bold leading-snug tracking-tight",
          isOut ? "text-[#1a1a1a]/25" : "text-[#1a1a1a]",
        ].join(" ")}>
          {item.name}
        </h3>

        {/* Tags + checkmark */}
        <div className="flex items-center justify-between gap-1 min-h-[16px]">
          {(item.tags?.length ?? 0) > 0 ? (
            <p className="text-[10px] text-[#1a1a1a]/30 truncate">
              {item.tags!.join(" · ")}
            </p>
          ) : (
            <span />
          )}

          {isSelected && (
            <span
              aria-hidden="true"
              className="shrink-0 w-4 h-4 rounded-full bg-pantry-green flex items-center justify-center ml-auto"
            >
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
          )}
        </div>

        {atMax && !isOut && (
          <p className="text-[10px] text-[#1a1a1a]/30" role="note">Max {MAX_SELECTION} selected</p>
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
