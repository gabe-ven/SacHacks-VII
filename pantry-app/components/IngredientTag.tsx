"use client";

interface IngredientTagProps {
  label: string;
  onRemove: (label: string) => void;
}

export default function IngredientTag({ label, onRemove }: IngredientTagProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
      {label}
      <button onClick={() => onRemove(label)} className="ml-1 text-gray-400 hover:text-red-500">
        ×
      </button>
    </span>
  );
}
