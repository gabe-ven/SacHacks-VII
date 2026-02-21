import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "selected";

const VARIANTS: Record<Variant, string> = {
  // Coral pill — matches homepage "Start Cooking" CTA
  primary:
    "bg-pantry-coral text-white hover:bg-pantry-amber hover:text-pantry-green",
  // Outlined pill — matches homepage ghost secondary
  secondary:
    "border border-pantry-tan text-pantry-green bg-transparent hover:bg-pantry-tan/20",
  // Text-only — for inline actions
  ghost:
    "text-pantry-coral hover:text-pantry-green bg-transparent",
  // Green fill — for "added" / active state
  selected:
    "bg-pantry-green text-pantry-cream hover:bg-pantry-green/90",
};

const DISABLED =
  "opacity-50 cursor-not-allowed pointer-events-none";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      disabled={disabled}
      aria-disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2",
        "px-5 py-2 rounded-full font-semibold text-sm",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-pantry-green focus:ring-offset-1",
        VARIANTS[variant],
        disabled ? DISABLED : "",
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
