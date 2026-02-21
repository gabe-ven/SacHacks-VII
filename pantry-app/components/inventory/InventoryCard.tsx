"use client";

import type { InventoryItem } from "@/types/inventory";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
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
        "relative flex flex-col gap-2.5 rounded-2xl border p-5 transition-all duration-150 h-full",
        isOut
          ? "bg-white/40 border-pantry-tan/40 opacity-60"
          : isSelected
          ? "bg-white border-pantry-green ring-2 ring-pantry-green/30"
          : "bg-white/60 border-pantry-tan hover:bg-white hover:border-pantry-green/40",
      ].join(" ")}
    >
      {/* Expires soon badge — top-right */}
      {item.expiresSoon && (
        <Badge
          variant="coral"
          className="absolute top-3 right-3"
          aria-label="Expires soon"
        >
          Expires soon
        </Badge>
      )}

      {/* Name + category + unit */}
      <div className={item.expiresSoon ? "pr-24" : ""}>
        <h3
          className={[
            "font-semibold leading-snug",
            isOut ? "text-foreground/40" : "text-foreground",
          ].join(" ")}
        >
          {item.name}
        </h3>
        <p className="text-xs text-foreground/50 mt-0.5">
          {item.category}
          {item.unit && <span className="ml-1.5">· {item.unit}</span>}
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
            <Badge key={tag} variant={TAG_VARIANTS[tag] ?? "tan"}>
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Unknown availability note */}
      {isUnknown && (
        <p className="text-xs text-pantry-amber" role="note">
          ⚠ Availability may vary
        </p>
      )}

      {/* Action button — pinned to bottom */}
      <div className="mt-auto pt-1">
        {isSelected ? (
          <Button
            variant="selected"
            fullWidth
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name} from selection`}
          >
            ✓ Added — Remove
          </Button>
        ) : isOut ? (
          <Button variant="secondary" fullWidth disabled aria-label={`${item.name} is unavailable`}>
            Unavailable
          </Button>
        ) : (
          <Button
            variant="secondary"
            fullWidth
            disabled={!canAdd}
            onClick={() => canAdd && onAdd(item.id)}
            aria-label={
              atMax
                ? `Max ${MAX_SELECTION} items reached`
                : `Add ${item.name} to selection`
            }
            title={atMax ? `Max ${MAX_SELECTION} items selected` : undefined}
          >
            + Add
          </Button>
        )}
      </div>
    </article>
  );
}
