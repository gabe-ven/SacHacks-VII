"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BACK_KEY = "pantry_ai_recipes_back";

export default function BackToRecipesLink({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const [href, setHref] = useState("/recipes");

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const back = window.sessionStorage.getItem(BACK_KEY);
        if (back) setHref(back.startsWith("?") ? `/recipes${back}` : `/recipes?${back}`);
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <Link
      href={href}
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
