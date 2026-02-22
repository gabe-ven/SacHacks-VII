"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Pantry" },
  { href: "/recipes", label: "Recipes" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-pantry-green text-pantry-cream px-6 py-0 flex items-center justify-between h-14 shrink-0">
      {/* Wordmark */}
      <Link
        href="/"
        className="flex items-center gap-2.5 focus:outline-none group"
      >
        {/* Leaf icon — brand plant motif */}
        <svg
          className="w-6 h-6 text-pantry-amber shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7.8-5 12a5 5 0 0010 0c0-4.2-3.8-6.6-5-12z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M9 9.5c-.5 1 .5 2 1.5 2" />
        </svg>
        <span
          className="text-xl text-white leading-none"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          The Pantry
        </span>
        <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-widest text-pantry-amber/80 mt-px">
          at ASUCD
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pantry-amber/50 ${
                active
                  ? "bg-pantry-cream/15 text-white"
                  : "text-pantry-cream/70 hover:text-white hover:bg-pantry-cream/10"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
