"use client";

interface AIButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
}

export default function AIButton({ label, onClick, loading = false }: AIButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
    >
      {loading && <span className="animate-spin">⟳</span>}
      {loading ? "Thinking..." : label}
    </button>
  );
}
