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
