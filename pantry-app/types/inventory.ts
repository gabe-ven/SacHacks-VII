export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  unit?: string;
  quantityAvailable: number | null;
  /** true = known in stock, false = known out, null = unknown */
  inStock: boolean | null;
  tags?: string[];
  expiresSoon?: boolean;
};

export type StockStatus = "in-stock" | "out" | "unknown";

export type FilterState = {
  search: string;
  categories: string[];
  stockStatus: "all" | StockStatus;
  tags: string[];
};
