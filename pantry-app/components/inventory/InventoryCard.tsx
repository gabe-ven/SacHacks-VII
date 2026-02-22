"use client";

import Image from "next/image";
import type { KeyboardEvent } from "react";
import type { InventoryItem } from "@/types/inventory";
import { useTheme } from "@/context/ThemeContext";

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

// Category → color + short label (matches exact Supabase category names)
export const CATEGORY_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  "Produce":               { bg: "#5E7F64", text: "#fff",    label: "Produce"  },
  "Dairy":                 { bg: "#6C90B2", text: "#fff",    label: "Dairy"    },
  "Canned/Jarred Foods":   { bg: "#E3694F", text: "#fff",    label: "Canned"   },
  "Dry/Baking Goods":      { bg: "#CCAA6C", text: "#312F2D", label: "Bakery"   },
  "Personal Care":         { bg: "#A592C0", text: "#fff",    label: "Personal" },
};

const MAX_SELECTION = 20;

const CATEGORY_IMAGE: Record<string, string> = {
  "Produce": "/image1.jpeg",
  "Dairy": "/image2.jpg",
  "Canned/Jarred Foods": "/image3.jpeg",
  "Dry/Baking Goods": "/image2.jpg",
  "Personal Care": "/image3.jpeg",
};

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
  const { theme } = useTheme();
  const isOut = item.stockStatus === "out_of_stock";
  const isLow = item.stockStatus === "low_stock";
  const isPersonalCare = item.category.trim().toLowerCase() === "personal care";
  const atMax = selectionCount >= MAX_SELECTION && !isSelected;
  const canToggle = !isOut && !atMax && !isPersonalCare;
  const style = CATEGORY_STYLE[item.category] ?? { bg: "#DDBE86", text: "#312F2D", label: item.category };
  const fallbackImage = CATEGORY_IMAGE[item.category] ?? "/pantry.png";
  const cardImage = item.imageUrl?.trim() ? item.imageUrl : fallbackImage;

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
        "relative flex rounded-xl sm:rounded-2xl overflow-hidden select-none transition-all duration-200 h-[96px]",
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
          "flex flex-col justify-between p-3 sm:p-3.5 flex-1 min-w-0 transition-colors duration-200 overflow-hidden",
          isSelected ? "bg-pantry-green/5" : "bg-surface-card",
        ].join(" ")}
      >
        {/* Image-first layout */}
        <div className="relative h-[92px] w-full rounded-xl bg-transparent flex items-center justify-center overflow-hidden">
          <Image
            src={cardImage}
            alt={`${item.category} item`}
            width={112}
            height={112}
            unoptimized
            className={[
              "w-full h-full object-contain p-1",
              theme === "dark" ? "mix-blend-normal" : "mix-blend-multiply",
            ].join(" ")}
          />
          {isSelected && (
            <span
              aria-hidden="true"
              className="absolute top-1 right-1 shrink-0 w-4.5 h-4.5 rounded-full bg-pantry-green flex items-center justify-center"
            >
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
          )}
        </div>

        <h3 className={[
          "mt-1.5 text-sm font-semibold leading-tight tracking-tight line-clamp-2 text-center",
          isOut ? "text-muted" : "text-foreground",
        ].join(" ")}>
          {item.name}
        </h3>

        {/* Bottom area: stock + tags OR notes */}
        <div className="mt-auto flex flex-col items-center gap-1 overflow-hidden">
          <span className={[
            "shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest",
            isOut ? "text-muted" : isLow ? "text-pantry-amber" : "text-pantry-green",
          ].join(" ")}>
            <span className={[
              "w-1.5 h-1.5 rounded-full",
              isOut ? "bg-muted" : isLow ? "bg-pantry-amber" : "bg-pantry-green",
            ].join(" ")} />
            {isOut ? "Out" : isLow ? "Low" : "In stock"}
          </span>

          {atMax && !isOut ? (
            <span className="text-[9px] text-muted text-center">Max {MAX_SELECTION} reached</span>
          ) : isPersonalCare ? (
            <span className="text-[9px] text-muted text-center">Not for recipes</span>
          ) : item.tags.length > 0 ? (
            <div className="flex items-center justify-center gap-1 overflow-hidden">
              {item.tags.slice(0, 3).map((tag) => {
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
            })}
            </div>
          ) : null}

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
