"use client";

import { useState } from "react";

interface IngredientDropdownProps {
  items: string[];
  onSelect: (item: string) => void;
}

export default function IngredientDropdown({ items, onSelect }: IngredientDropdownProps) {
  const [query, setQuery] = useState("");

  const filtered = items.filter((i) =>
    i.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Pantry items..."
        className="border rounded px-3 py-2 w-full mb-2"
      />
      <ul className="border rounded max-h-40 overflow-y-auto">
        {filtered.map((item) => (
          <li
            key={item}
            onClick={() => onSelect(item)}
            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
