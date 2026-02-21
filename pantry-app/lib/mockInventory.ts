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
    unit: "lb",
    quantityAvailable: 12,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p2",
    name: "Apples",
    category: "Produce",
    unit: "each",
    quantityAvailable: 24,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p3",
    name: "Bananas",
    category: "Produce",
    unit: "each",
    quantityAvailable: 30,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p4",
    name: "Spinach",
    category: "Produce",
    unit: "bag",
    quantityAvailable: 8,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p5",
    name: "Onions",
    category: "Produce",
    unit: "lb",
    quantityAvailable: null,
    inStock: null,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p6",
    name: "Sweet Potatoes",
    category: "Produce",
    unit: "lb",
    quantityAvailable: 0,
    inStock: false,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p7",
    name: "Broccoli",
    category: "Produce",
    unit: "head",
    quantityAvailable: null,
    inStock: null,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "p8",
    name: "Lemons",
    category: "Produce",
    unit: "each",
    quantityAvailable: 15,
    inStock: true,
    tags: ["vegan", "gluten-free"],
    expiresSoon: true,
  },

  // ── Dairy ────────────────────────────────────────────────────────────────
  {
    id: "d1",
    name: "1% Milk",
    category: "Dairy",
    unit: "carton",
    quantityAvailable: 10,
    inStock: true,
    tags: ["halal"],
  },
  {
    id: "d2",
    name: "Oat Milk",
    category: "Dairy",
    unit: "carton",
    quantityAvailable: 6,
    inStock: true,
    tags: ["vegan", "dairy-free"],
  },
  {
    id: "d3",
    name: "Almond Milk",
    category: "Dairy",
    unit: "carton",
    quantityAvailable: null,
    inStock: null,
    tags: ["vegan", "dairy-free"],
  },
  {
    id: "d4",
    name: "Cheddar Cheese",
    category: "Dairy",
    unit: "block",
    quantityAvailable: 0,
    inStock: false,
    tags: ["gluten-free", "halal"],
  },

  // ── Pantry ───────────────────────────────────────────────────────────────
  {
    id: "pa1",
    name: "White Rice",
    category: "Pantry",
    unit: "lb",
    quantityAvailable: 50,
    inStock: true,
    tags: ["vegan", "gluten-free", "halal"],
  },
  {
    id: "pa2",
    name: "Pasta",
    category: "Pantry",
    unit: "box",
    quantityAvailable: 20,
    inStock: true,
    tags: ["vegan"],
  },
  {
    id: "pa3",
    name: "Olive Oil",
    category: "Pantry",
    unit: "bottle",
    quantityAvailable: 8,
    inStock: true,
    tags: ["vegan", "gluten-free", "halal"],
  },
  {
    id: "pa4",
    name: "Black Beans",
    category: "Pantry",
    unit: "can",
    quantityAvailable: 35,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "pa5",
    name: "Red Lentils",
    category: "Pantry",
    unit: "lb",
    quantityAvailable: null,
    inStock: null,
    tags: ["vegan", "gluten-free", "halal"],
  },
  {
    id: "pa6",
    name: "Tomato Sauce",
    category: "Pantry",
    unit: "can",
    quantityAvailable: 18,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "pa7",
    name: "Chickpeas",
    category: "Pantry",
    unit: "can",
    quantityAvailable: 22,
    inStock: true,
    tags: ["vegan", "gluten-free", "halal"],
  },
  {
    id: "pa8",
    name: "Canned Corn",
    category: "Pantry",
    unit: "can",
    quantityAvailable: 0,
    inStock: false,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "pa9",
    name: "All-Purpose Flour",
    category: "Pantry",
    unit: "lb",
    quantityAvailable: null,
    inStock: null,
    tags: ["vegan"],
  },

  // ── Protein ──────────────────────────────────────────────────────────────
  {
    id: "pr1",
    name: "Peanut Butter",
    category: "Protein",
    unit: "jar",
    quantityAvailable: 12,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "pr2",
    name: "Canned Tuna",
    category: "Protein",
    unit: "can",
    quantityAvailable: 30,
    inStock: true,
    tags: ["gluten-free", "halal"],
  },
  {
    id: "pr3",
    name: "Eggs",
    category: "Protein",
    unit: "dozen",
    quantityAvailable: 5,
    inStock: true,
    tags: ["gluten-free", "halal"],
    expiresSoon: true,
  },
  {
    id: "pr4",
    name: "Canned Chicken",
    category: "Protein",
    unit: "can",
    quantityAvailable: null,
    inStock: null,
    tags: ["gluten-free", "halal"],
  },
  {
    id: "pr5",
    name: "Firm Tofu",
    category: "Protein",
    unit: "block",
    quantityAvailable: 0,
    inStock: false,
    tags: ["vegan", "gluten-free"],
  },

  // ── Frozen ───────────────────────────────────────────────────────────────
  {
    id: "f1",
    name: "Frozen Peas",
    category: "Frozen",
    unit: "bag",
    quantityAvailable: 10,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "f2",
    name: "Frozen Mixed Vegetables",
    category: "Frozen",
    unit: "bag",
    quantityAvailable: null,
    inStock: null,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "f3",
    name: "Frozen Burritos",
    category: "Frozen",
    unit: "each",
    quantityAvailable: 15,
    inStock: true,
    tags: [],
  },

  // ── Snacks ───────────────────────────────────────────────────────────────
  {
    id: "s1",
    name: "Granola Bars",
    category: "Snacks",
    unit: "box",
    quantityAvailable: 20,
    inStock: true,
    tags: ["vegan"],
  },
  {
    id: "s2",
    name: "Crackers",
    category: "Snacks",
    unit: "box",
    quantityAvailable: 8,
    inStock: true,
    tags: ["vegan"],
  },
  {
    id: "s3",
    name: "Trail Mix",
    category: "Snacks",
    unit: "bag",
    quantityAvailable: null,
    inStock: null,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "s4",
    name: "Pretzels",
    category: "Snacks",
    unit: "bag",
    quantityAvailable: 0,
    inStock: false,
    tags: ["vegan"],
  },
  {
    id: "s5",
    name: "Microwave Popcorn",
    category: "Snacks",
    unit: "box",
    quantityAvailable: 12,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },

  // ── Beverages ────────────────────────────────────────────────────────────
  {
    id: "bv1",
    name: "Apple Juice",
    category: "Beverages",
    unit: "bottle",
    quantityAvailable: 15,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "bv2",
    name: "Orange Juice",
    category: "Beverages",
    unit: "carton",
    quantityAvailable: null,
    inStock: null,
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "bv3",
    name: "Sparkling Water",
    category: "Beverages",
    unit: "can",
    quantityAvailable: 24,
    inStock: true,
    tags: ["vegan", "gluten-free"],
  },

  // ── Hygiene ──────────────────────────────────────────────────────────────
  {
    id: "hy1",
    name: "Toothpaste",
    category: "Hygiene",
    unit: "each",
    quantityAvailable: null,
    inStock: null,
    tags: [],
  },
  {
    id: "hy2",
    name: "Pads",
    category: "Hygiene",
    unit: "pack",
    quantityAvailable: 20,
    inStock: true,
    tags: [],
  },
  {
    id: "hy3",
    name: "Shampoo",
    category: "Hygiene",
    unit: "bottle",
    quantityAvailable: 0,
    inStock: false,
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
