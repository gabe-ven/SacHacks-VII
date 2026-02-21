type Props = {
  inStock: boolean | null;
};

export default function StockBadge({ inStock }: Props) {
  if (inStock === true) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
        aria-label="In stock"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" aria-hidden="true" />
        In stock
      </span>
    );
  }

  if (inStock === false) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700"
        aria-label="Out of stock"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" aria-hidden="true" />
        Out
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
      aria-label="Stock status unknown"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
      Unknown
    </span>
  );
}
