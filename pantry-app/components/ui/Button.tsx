import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "selected";

const VARIANTS: Record<Variant, string> = {
  // Green pill — matches landing page "Start Cooking" CTA
  primary:
    "bg-pantry-green text-white hover:bg-pantry-coral",
  // Outlined pill — matches landing page secondary button
  secondary:
    "border border-[#1a1a1a]/12 text-[#1a1a1a]/60 bg-transparent hover:border-pantry-green/50 hover:text-pantry-green",
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
