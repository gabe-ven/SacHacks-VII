import { supabase } from "@/lib/supabase";
import type { InventoryItem } from "@/types/inventory";

export async function getDailyInventory(dayOfWeek: number): Promise<InventoryItem[]> {
  const normalizedDay = ((dayOfWeek % 7) + 7) % 7;
  const isWeekend = normalizedDay === 0 || normalizedDay === 6;

  // Weekend: show full ingredient catalog without day-specific availability.
  if (isWeekend) {
    const { data, error } = await supabase
      .from("ingredients")
      .select("id, name, category, item_tags")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      id: row.id as string,
      name: row.name as string,
      category: row.category as string,
      stockStatus: "in_stock" as const,
      tags: (row.item_tags as string[] | null) ?? [],
    }));
  }

  const { data, error } = await supabase
    .from("daily_inventory")
    .select("in_stock, ingredient:ingredients(id,name,category,item_tags)")
    .eq("day_of_week", normalizedDay);

  if (error) throw new Error(error.message);

  const results: InventoryItem[] = [];

  for (const row of data ?? []) {
    // Supabase returns the joined relation as an array; take the first element.
    const ingredient = Array.isArray(row.ingredient)
      ? (row.ingredient[0] ?? null)
      : (row.ingredient ?? null);

    if (!ingredient) continue;

    results.push({
      id: ingredient.id as string,
      name: ingredient.name as string,
      category: ingredient.category as string,
      stockStatus: row.in_stock ? "in_stock" : "out_of_stock",
      tags: (ingredient.item_tags as string[] | null) ?? [],
    });
  }

  return results;
}
