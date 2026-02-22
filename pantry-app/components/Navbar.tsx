"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-pantry-green/85 backdrop-blur-md shadow-sm border-b border-white/10">
      {/* ── Main bar ── */}
      <div className="px-4 sm:px-6 py-1 flex items-center">
        {/* Logo */}
        <Link href="/" className="shrink-0" onClick={() => setMenuOpen(false)}>
          <Image
            src="/pantry.png"
            alt="The Pantry"
            width={200}
            height={60}
            className="object-contain h-10 sm:h-14 w-auto"
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex flex-1 justify-center gap-8 text-pantry-cream text-base font-semibold">
          <Link href="/" className="hover:text-pantry-amber transition-colors">Home</Link>
          <Link href="/inventory" className="hover:text-pantry-amber transition-colors">Inventory</Link>
          <Link href="/recipes" className="hover:text-pantry-amber transition-colors">Recipes</Link>
        </div>

        {/* Right side: theme toggle + mobile hamburger */}
        <div className="ml-auto flex items-center gap-2">
          {/* Theme toggle — always visible */}
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-pantry-cream transition-all duration-200"
          >
            {theme === "light" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="sm:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-pantry-cream transition-all duration-200"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-pantry-green/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-pantry-cream font-semibold text-sm py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/inventory"
            onClick={() => setMenuOpen(false)}
            className="text-pantry-cream font-semibold text-sm py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Inventory
          </Link>
          <Link
            href="/recipes"
            onClick={() => setMenuOpen(false)}
            className="text-pantry-cream font-semibold text-sm py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Recipes
          </Link>
        </div>
      )}
    </nav>
  );
}
