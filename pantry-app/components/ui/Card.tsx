type Props = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

/** Base card matching the homepage "Core Values" card style. */
export default function Card({ id, className = "", children }: Props) {
  return (
    <div
      id={id}
      className={[
        "bg-surface-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
