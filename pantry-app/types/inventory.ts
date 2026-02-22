export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stockStatus: StockStatus;
  tags: string[];
  imageUrl?: string | null;
};

export type FilterState = {
  search: string;
  categories: string[];
  stockStatus: "all" | StockStatus;
  tags: string[];
};