import type { Recipe } from "@/types/recipe";

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Black Bean Rice Bowl",
    image: "/placeholder.jpg",
    cookTime: "20 min",
    difficulty: "Easy",
    ingredients: ["Rice", "Black Beans", "Corn", "Onions"],
    instructions: [
      "Cook rice according to package instructions.",
      "Drain and rinse black beans.",
      "Combine beans, corn, and onions in a pan over medium heat.",
      "Serve over rice.",
    ],
    substitutions: ["Swap rice for pasta from the Pantry.", "Use chickpeas instead of black beans."],
  },
  {
    id: "2",
    title: "Pasta with Tomato Sauce",
    image: "/placeholder.jpg",
    cookTime: "15 min",
    difficulty: "Easy",
    ingredients: ["Pasta", "Tomato Sauce", "Olive Oil", "Onions"],
    instructions: [
      "Boil pasta until al dente.",
      "Sauté onions in olive oil.",
      "Add tomato sauce and simmer 5 minutes.",
      "Toss pasta with sauce and serve.",
    ],
    substitutions: ["Add canned lentils for extra protein.", "Use any canned vegetable from the Pantry."],
  },
  {
    id: "3",
    title: "Lentil Veggie Soup",
    image: "/placeholder.jpg",
    cookTime: "30 min",
    difficulty: "Easy",
    ingredients: ["Lentils", "Carrots", "Onions", "Tomato Sauce"],
    instructions: [
      "Chop carrots and onions.",
      "Sauté in olive oil for 5 minutes.",
      "Add lentils, tomato sauce, and 3 cups water.",
      "Simmer 20 minutes until lentils are soft.",
    ],
    substitutions: ["Use canned chickpeas instead of lentils.", "Add spinach at the end for greens."],
  },
];
