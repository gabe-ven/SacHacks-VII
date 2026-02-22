import { supabase } from "@/lib/supabase";
import type { InventoryItem, StockStatus } from "@/types/inventory";

export async function getInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from("ingredients")
    .select("id, name, category, item_tags")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    category: row.category as string,
    stockStatus: "in_stock" as StockStatus,
    tags: (row.item_tags as string[] | null) ?? [],
  }));
}

/** Returns all ingredient names from the ingredients table (for search autocomplete). */
export async function getIngredientNames(): Promise<string[]> {
  const { data, error } = await supabase
    .from("ingredients")
    .select("name")
    .order("name", { ascending: true });

  if (error) return [];
  return (data ?? []).map((row) => (row.name as string).trim()).filter(Boolean);
}
