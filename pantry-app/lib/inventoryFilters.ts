import type { InventoryItem, FilterState } from "@/types/inventory";

/**
 * Pure filter function — all filtering logic lives here for easy unit testing.
 * Takes the full inventory list and active filters, returns only matching items.
 */
export function filterInventory(
  items: InventoryItem[],
  filters: FilterState
): InventoryItem[] {
  const query = filters.search.toLowerCase().trim();

  return items.filter((item) => {
    // Text search: match name or any dietary tag
    if (query) {
      const inName = item.name.toLowerCase().includes(query);
      const inTags = item.tags.some((t) => t.toLowerCase().includes(query));
      if (!inName && !inTags) return false;
    }

    // Category multi-select (item must belong to one of the selected categories)
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(item.category)
    ) {
      return false;
    }

    // Stock status filter
    if (filters.stockStatus !== "all" && item.stockStatus !== filters.stockStatus) {
      return false;
    }

    // Dietary tag multi-select (item must have ALL selected tags)
    if (filters.tags.length > 0) {
      if (!filters.tags.every((t) => item.tags.includes(t))) return false;
    }

    return true;
  });
}

/** Returns sorted list of unique category strings present in the inventory. */
export function getAllCategories(items: InventoryItem[]): string[] {
  return [...new Set(items.map((i) => i.category))].sort();
}

/** Returns sorted list of unique dietary tags present across all items. */
export function getAllTags(items: InventoryItem[]): string[] {
  const tagSet = new Set<string>();
  items.forEach((item) => item.tags.forEach((t) => tagSet.add(t)));
  return [...tagSet].sort();
}

/** Returns true if any filter is active (search, category, stock, or tag). */
export function isFiltersActive(filters: FilterState): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.categories.length > 0 ||
    filters.stockStatus !== "all" ||
    filters.tags.length > 0
  );
}
