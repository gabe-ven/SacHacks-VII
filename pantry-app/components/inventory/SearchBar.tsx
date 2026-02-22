"use client";

import Input from "@/components/ui/Input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search items or dietary tags…",
}: Props) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-y-0 left-4 flex items-center"
        aria-hidden="true"
      >
        <svg
          className="h-4 w-4 text-pantry-green/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </div>
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search inventory items"
        className="pl-10 pr-10 !rounded-full !bg-gray-100 border-2 border-gray-300 focus:outline-none focus-visible:border-pantry-green focus-visible:ring-2 focus-visible:ring-pantry-green/30 focus-visible:ring-offset-0"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute inset-y-0 right-4 flex items-center text-foreground/30 hover:text-pantry-green transition-colors focus:outline-none"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
