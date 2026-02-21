export default function SkeletonCard() {
  return (
    <div
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-3 animate-pulse"
      aria-hidden="true"
    >
      {/* Name */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      {/* Category */}
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      {/* Stock badge + qty */}
      <div className="flex gap-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
      </div>
      {/* Tags */}
      <div className="flex gap-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-14" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>
      {/* Button */}
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mt-1" />
    </div>
  );
}
