"use client";

import { useState } from "react";

interface IngredientInputProps {
  onAdd: (item: string) => void;
}

export default function IngredientInput({ onAdd }: IngredientInputProps) {
  const [value, setValue] = useState("");

  function handleAdd() {
    const trimmed = value.trim();
    if (trimmed) {
      onAdd(trimmed);
      setValue("");
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Type an ingredient..."
        className="border rounded px-3 py-2 flex-1"
      />
      <button onClick={handleAdd} className="bg-black text-white px-4 py-2 rounded">
        Add
      </button>
    </div>
  );
}
