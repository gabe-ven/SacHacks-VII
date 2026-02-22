"use client";

import { DAY_LABELS, wrapDay } from "@/lib/days";

type Props = {
  dayOfWeek: number;
  onChange: (nextDay: number) => void;
  compact?: boolean;
};

export default function DayCarousel({ dayOfWeek, onChange, compact = false }: Props) {
  const normalizedDay = wrapDay(dayOfWeek);

  return (
    <div
      className={[
        "flex items-center justify-center gap-3",
        compact ? "py-1" : "py-2",
      ].join(" ")}
      aria-label="Day selector"
    >
      <button
        type="button"
        aria-label="Previous day"
        onClick={() => onChange(wrapDay(normalizedDay - 1))}
        className="w-9 h-9 rounded-full border border-[#1a1a1a]/12 text-[#1a1a1a]/70 hover:border-pantry-green/50 hover:text-pantry-green transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green cursor-pointer"
      >
        <span aria-hidden="true">←</span>
      </button>

      <p
        className={[
          "min-w-[8.5rem] text-center font-semibold text-[#1a1a1a]",
          compact ? "text-sm" : "text-base",
        ].join(" ")}
        aria-live="polite"
      >
        {DAY_LABELS[normalizedDay]}
      </p>

      <button
        type="button"
        aria-label="Next day"
        onClick={() => onChange(wrapDay(normalizedDay + 1))}
        className="w-9 h-9 rounded-full border border-[#1a1a1a]/12 text-[#1a1a1a]/70 hover:border-pantry-green/50 hover:text-pantry-green transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green cursor-pointer"
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
