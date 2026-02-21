"use client";

import PantryCategoryList from "./PantryCategoryList";
import type { PantryData } from "@/types/pantry";

interface InventoryGridProps {
  categories: PantryData["categories"];
  onSelect?: (item: string) => void;
}

export default function InventoryGrid({ categories, onSelect }: InventoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <PantryCategoryList title="Produce" items={categories.produce} onSelect={onSelect} />
      <PantryCategoryList title="Milk" items={categories.milk} onSelect={onSelect} />
      <PantryCategoryList title="Snacks" items={categories.snacks} onSelect={onSelect} />
      <PantryCategoryList title="Canned Goods" items={categories.canned} onSelect={onSelect} />
      <PantryCategoryList title="Necessities" items={categories.necessities} onSelect={onSelect} />
    </div>
  );
}
