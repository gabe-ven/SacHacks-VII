import { supabase } from "@/lib/supabase";
import type { InventoryItem, StockStatus } from "@/types/inventory";

type DailyInventoryRow = {
  in_stock: boolean;
  ingredient: {
    id: string;
    name: string;
    category: string;
    item_tags: string[] | null;
  } | null;
};

type IngredientRow = {
  id: string;
  name: string;
  category: string;
  item_tags: string[] | null;
};

export async function getDailyInventory(dayOfWeek: number): Promise<InventoryItem[]> {
  const normalizedDay = ((dayOfWeek % 7) + 7) % 7;
  const isWeekend = normalizedDay === 0 || normalizedDay === 6;

  // Weekend view: show full ingredient catalog without day-specific availability.
  if (isWeekend) {
    const { data, error } = await supabase
      .from("ingredients")
      .select("id, name, category, item_tags")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    return ((data ?? []) as IngredientRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      stockStatus: "in_stock" as StockStatus,
      tags: row.item_tags ?? [],
    }));
  }

  const { data, error } = await supabase
    .from("daily_inventory")
    .select("day_of_week, in_stock, ingredient:ingredients(id,name,category,item_tags)")
    .eq("day_of_week", normalizedDay);

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as DailyInventoryRow[];

  return rows
    .map((row) => {
      if (!row.ingredient) return null;
      return {
        id: row.ingredient.id,
        name: row.ingredient.name,
        category: row.ingredient.category,
        stockStatus: (row.in_stock ? "in_stock" : "out_of_stock") as StockStatus,
        tags: row.ingredient.item_tags ?? [],
      } satisfies InventoryItem;
    })
    .filter((row): row is InventoryItem => row !== null);
}
