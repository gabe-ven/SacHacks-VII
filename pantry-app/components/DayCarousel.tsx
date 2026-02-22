"use client";

import { DAY_LABELS, getDateForDayOfWeek, wrapDay } from "@/lib/days";

type Props = {
  dayOfWeek: number;
  onChange: (nextDay: number) => void;
  compact?: boolean;
};

export default function DayCarousel({ dayOfWeek, onChange, compact = false }: Props) {
  const normalizedDay = wrapDay(dayOfWeek);
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(getDateForDayOfWeek(normalizedDay));

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
        className="w-9 h-9 rounded-full border border-border text-foreground/70 hover:border-pantry-green/50 hover:text-pantry-green transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green cursor-pointer"
      >
        <span aria-hidden="true">←</span>
      </button>

      <p
        className={[
          "min-w-[12rem] text-center font-semibold text-foreground",
          compact ? "text-sm" : "text-base",
        ].join(" ")}
        aria-live="polite"
      >
        {DAY_LABELS[normalizedDay]} · {dateLabel}
      </p>

      <button
        type="button"
        aria-label="Next day"
        onClick={() => onChange(wrapDay(normalizedDay + 1))}
        className="w-9 h-9 rounded-full border border-border text-foreground/70 hover:border-pantry-green/50 hover:text-pantry-green transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green cursor-pointer"
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
