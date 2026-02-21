"use client";

import { createContext, useContext, useState } from "react";

interface IngredientsContextType {
  ingredients: string[];
  addIngredient: (item: string) => void;
  removeIngredient: (item: string) => void;
  clearIngredients: () => void;
}

const IngredientsContext = createContext<IngredientsContextType | null>(null);

export function IngredientsProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredients] = useState<string[]>([]);

  function addIngredient(item: string) {
    if (!ingredients.includes(item)) {
      setIngredients((prev) => [...prev, item]);
    }
  }

  function removeIngredient(item: string) {
    setIngredients((prev) => prev.filter((i) => i !== item));
  }

  function clearIngredients() {
    setIngredients([]);
  }

  return (
    <IngredientsContext.Provider value={{ ingredients, addIngredient, removeIngredient, clearIngredients }}>
      {children}
    </IngredientsContext.Provider>
  );
}

export function useIngredients() {
  const ctx = useContext(IngredientsContext);
  if (!ctx) throw new Error("useIngredients must be used inside IngredientsProvider");
  return ctx;
}
