import pantryJson from "@/data/pantry.json";
import type { PantryData } from "@/types/pantry";

export function getPantryData(): PantryData {
  return pantryJson as PantryData;
}

export function getAllPantryItems(): string[] {
  const data = getPantryData();
  return Object.values(data.categories).flat();
}
