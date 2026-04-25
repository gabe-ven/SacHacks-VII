"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BackToRecipesLink({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();

  return (
    <Link
      href="/recipes"
      onClick={(e) => {
        e.preventDefault();
        router.back();
      }}
      className={className}
    >
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back to recipes
    </Link>
  );
}
