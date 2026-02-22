export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockStatus: StockStatus;
  tags: string[];
}
