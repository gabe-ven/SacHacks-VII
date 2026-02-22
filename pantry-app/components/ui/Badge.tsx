type Variant = "green" | "tan" | "amber" | "coral";

const VARIANTS: Record<Variant, string> = {
  green:
    "bg-pantry-green/15 text-pantry-green border border-pantry-green/30",
  tan:
    "bg-pantry-tan/30 text-foreground/50 border border-pantry-tan/60",
  amber:
    "bg-pantry-amber/20 text-pantry-green border border-pantry-amber/40",
  coral:
    "bg-pantry-coral/10 text-pantry-coral border border-pantry-coral/25",
};

type Props = {
  variant?: Variant;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function Badge({
  variant = "tan",
  dot = false,
  className = "",
  children,
}: Props) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        VARIANTS[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot && (
        <span
          className={[
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === "green" ? "bg-pantry-green" : "",
            variant === "tan" ? "bg-pantry-tan" : "",
            variant === "amber" ? "bg-pantry-amber" : "",
            variant === "coral" ? "bg-pantry-coral" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
