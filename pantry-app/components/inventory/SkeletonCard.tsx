export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border border-pantry-tan bg-white/60 p-5 space-y-3 animate-pulse"
      aria-hidden="true"
    >
      {/* Name */}
      <div className="h-4 bg-pantry-tan/40 rounded-full w-3/4" />
      {/* Category */}
      <div className="h-3 bg-pantry-tan/30 rounded-full w-1/2" />
      {/* Stock badge */}
      <div className="flex gap-2">
        <div className="h-5 bg-pantry-tan/40 rounded-full w-20" />
        <div className="h-5 bg-pantry-tan/30 rounded-full w-16" />
      </div>
      {/* Tags */}
      <div className="flex gap-1">
        <div className="h-4 bg-pantry-tan/30 rounded-full w-14" />
        <div className="h-4 bg-pantry-tan/30 rounded-full w-16" />
      </div>
      {/* Button */}
      <div className="h-9 bg-pantry-tan/30 rounded-full mt-1" />
    </div>
  );
}
