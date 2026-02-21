"use client";

interface PantryCategoryListProps {
  title: string;
  items: string[];
  onSelect?: (item: string) => void;
}

export default function PantryCategoryList({ title, items, onSelect }: PantryCategoryListProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2 capitalize">{title}</h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item}
            onClick={() => onSelect?.(item)}
            className={`text-sm text-gray-700 ${onSelect ? "cursor-pointer hover:text-black hover:underline" : ""}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
