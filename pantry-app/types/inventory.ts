export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantityAvailable?: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  tags?: string[];
};

export type FilterState = {
  search: string;
  categories: string[];
  stockStatus: "all" | "in_stock" | "low_stock" | "out_of_stock";
  tags: string[];
};
