"use client";

import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

/** Styled text/search input matching pantry brand conventions. */
export default function Input({ className = "", ...rest }: Props) {
  return (
    <input
      className={[
        "w-full bg-white border border-pantry-tan rounded-full",
        "px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40",
        "focus:outline-none focus:ring-2 focus:ring-pantry-green transition-colors",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}
