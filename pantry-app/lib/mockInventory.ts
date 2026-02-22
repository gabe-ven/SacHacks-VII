import type { InventoryItem } from "@/types/inventory";

// TODO: Replace MOCK_INVENTORY with a real API response when backend is ready.
// The fetchInventory() function below already has the async/await shape you'll need —
// just swap the setTimeout for a fetch() call.

const MOCK_INVENTORY: InventoryItem[] = [
  // ── Produce ─────────────────────────────────────────────────────────────
  {
    id: "p1",
    name: "Carrots",
    category: "Produce",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p2",
    name: "Apples",
    category: "Produce",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p3",
    name: "Bananas",
    category: "Produce",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p4",
    name: "Spinach",
    category: "Produce",
    stockStatus: "low_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p5",
    name: "Onions",
    category: "Produce",
    stockStatus: "low_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p6",
    name: "Sweet Potatoes",
    category: "Produce",
    stockStatus: "out_of_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p7",
    name: "Broccoli",
    category: "Produce",
    stockStatus: "low_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p8",
    name: "Lemons",
    category: "Produce",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },

  // ── Dairy ────────────────────────────────────────────────────────────────
  {
    id: "d1",
    name: "1% Milk",
    category: "Dairy",
    stockStatus: "in_stock",
    tags: ["halal"],
  },
  {
    id: "d2",
    name: "Oat Milk",
    category: "Dairy",
    stockStatus: "in_stock",
    tags: ["vegan", "dairy-free"],
  },
  {
    id: "d3",
    name: "Almond Milk",
    category: "Dairy",
    stockStatus: "low_stock",
    tags: ["vegan", "dairy-free"],
  },
  {
    id: "d4",
    name: "Cheddar Cheese",
    category: "Dairy",
    stockStatus: "out_of_stock",
    tags: ["gluten-free", "halal"],
  },

  // ── Pantry ───────────────────────────────────────────────────────────────
  {
    id: "pa1",
    name: "White Rice",
    category: "Pantry",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free", "halal"],
  },
  {
    id: "pa2",
    name: "Pasta",
    category: "Pantry",
    stockStatus: "in_stock",
    tags: ["vegan"],
  },
  {
    id: "pa3",
    name: "Olive Oil",
    category: "Pantry",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free", "halal"],
  },
  {
    id: "pa4",
    name: "Black Beans",
    category: "Pantry",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "pa5",
    name: "Red Lentils",
    category: "Pantry",
    stockStatus: "low_stock",
    tags: ["vegan", "gluten-free", "halal"],
  },
  {
    id: "pa6",
    name: "Tomato Sauce",
    category: "Pantry",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "pa7",
    name: "Chickpeas",
    category: "Pantry",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free", "halal"],
  },
  {
    id: "pa8",
    name: "Canned Corn",
    category: "Pantry",
    stockStatus: "out_of_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "pa9",
    name: "All-Purpose Flour",
    category: "Pantry",
    stockStatus: "low_stock",
    tags: ["vegan"],
  },

  // ── Protein ──────────────────────────────────────────────────────────────
  {
    id: "pr1",
    name: "Peanut Butter",
    category: "Protein",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "pr2",
    name: "Canned Tuna",
    category: "Protein",
    stockStatus: "in_stock",
    tags: ["gluten-free", "halal"],
  },
  {
    id: "pr3",
    name: "Eggs",
    category: "Protein",
    stockStatus: "low_stock",
    tags: ["gluten-free", "halal"],
  },
  {
    id: "pr4",
    name: "Canned Chicken",
    category: "Protein",
    stockStatus: "low_stock",
    tags: ["gluten-free", "halal"],
  },
  {
    id: "pr5",
    name: "Firm Tofu",
    category: "Protein",
    stockStatus: "out_of_stock",
    tags: ["vegan", "gluten-free"],
  },

  // ── Frozen ───────────────────────────────────────────────────────────────
  {
    id: "f1",
    name: "Frozen Peas",
    category: "Frozen",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "f2",
    name: "Frozen Mixed Vegetables",
    category: "Frozen",
    stockStatus: "low_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "f3",
    name: "Frozen Burritos",
    category: "Frozen",
    stockStatus: "in_stock",
    tags: [],
  },

  // ── Snacks ───────────────────────────────────────────────────────────────
  {
    id: "s1",
    name: "Granola Bars",
    category: "Snacks",
    stockStatus: "in_stock",
    tags: ["vegan"],
  },
  {
    id: "s2",
    name: "Crackers",
    category: "Snacks",
    stockStatus: "in_stock",
    tags: ["vegan"],
  },
  {
    id: "s3",
    name: "Trail Mix",
    category: "Snacks",
    stockStatus: "low_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "s4",
    name: "Pretzels",
    category: "Snacks",
    stockStatus: "out_of_stock",
    tags: ["vegan"],
  },
  {
    id: "s5",
    name: "Microwave Popcorn",
    category: "Snacks",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },

  // ── Beverages ────────────────────────────────────────────────────────────
  {
    id: "bv1",
    name: "Apple Juice",
    category: "Beverages",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "bv2",
    name: "Orange Juice",
    category: "Beverages",
    stockStatus: "low_stock",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "bv3",
    name: "Sparkling Water",
    category: "Beverages",
    stockStatus: "in_stock",
    tags: ["vegan", "gluten-free"],
  },

  // ── Hygiene ──────────────────────────────────────────────────────────────
  {
    id: "hy1",
    name: "Toothpaste",
    category: "Hygiene",
    stockStatus: "low_stock",
    tags: [],
  },
  {
    id: "hy2",
    name: "Pads",
    category: "Hygiene",
    stockStatus: "in_stock",
    tags: [],
  },
  {
    id: "hy3",
    name: "Shampoo",
    category: "Hygiene",
    stockStatus: "out_of_stock",
    tags: [],
  },
];

/**
 * Simulates an async data fetch with a short delay.
 * TODO: Replace the body of this function with a real fetch() call when the
 * backend inventory API is available, e.g.:
 *   const res = await fetch("/api/inventory");
 *   if (!res.ok) throw new Error("Failed to fetch inventory");
 *   return res.json();
 */
export async function fetchInventory(): Promise<InventoryItem[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Uncomment to test the error state:
      // reject(new Error("Could not reach inventory service. Please try again."));
      resolve(MOCK_INVENTORY);
    }, 300);
  });
}
