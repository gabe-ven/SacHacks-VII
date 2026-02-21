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
        "bg-white/60 border border-pantry-tan rounded-2xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
