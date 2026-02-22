import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "selected";

const VARIANTS: Record<Variant, string> = {
  // Primary — green pill, theme cream text, consistent hover
  primary:
    "bg-pantry-green text-pantry-cream hover:opacity-90 shadow-sm",
  // Outlined pill — matches filter/secondary style
  secondary:
    "border border-border text-foreground bg-transparent hover:border-pantry-green hover:text-pantry-green",
  // Text / destructive — coral for clear/remove actions
  ghost:
    "text-pantry-coral hover:text-pantry-green bg-transparent",
  // Selected / active pill
  selected:
    "bg-pantry-green text-pantry-cream hover:opacity-90",
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
        "px-5 py-2 leading-5 rounded-full font-semibold text-sm appearance-none",
        "transition-colors duration-150 cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-green",
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
