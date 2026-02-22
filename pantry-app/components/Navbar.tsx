"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-pantry-green/95 backdrop-blur-md shadow-sm border-b border-white/10">
      <div className="flex items-center justify-between min-h-14 px-4 sm:px-6 py-2">
        {/* Logo — smaller on mobile */}
        <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
          <Image
            src="/pantry.png"
            alt="The Pantry"
            width={220}
            height={66}
            className="object-contain h-11 sm:h-14 md:h-16 w-auto max-w-[160px] sm:max-w-[200px] md:max-w-none"
          />
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-center gap-8 text-pantry-cream text-base font-semibold">
          <Link href="/" className="hover:text-pantry-amber transition-colors">Home</Link>
          <Link href="/inventory" className="hover:text-pantry-amber transition-colors">Inventory</Link>
          <Link href="/recipes" className="hover:text-pantry-amber transition-colors">Recipes</Link>
        </div>

        {/* Right: theme toggle + hamburger on mobile — icon only, no boxes */}
        <div className="flex items-center gap-3 shrink-0 md:w-[200px] md:justify-end">
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="p-2 text-pantry-cream/80 hover:text-pantry-amber transition-colors cursor-pointer"
          >
            {theme === "light" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden p-2 text-pantry-cream/80 hover:text-pantry-amber transition-colors cursor-pointer"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu — slide-down */}
      <div
        className={`md:hidden overflow-hidden transition-[height,opacity] duration-200 ease-out ${
          mobileOpen ? "h-[calc(3*3.5rem)] opacity-100" : "h-0 opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="border-t border-white/10 bg-pantry-green px-4 py-3 flex flex-col gap-1">
          <Link
            href="/"
            className="py-3 px-3 rounded-lg text-pantry-cream font-semibold hover:bg-white/10 hover:text-pantry-amber transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-amber focus-visible:ring-offset-2 focus-visible:ring-offset-pantry-green"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/inventory"
            className="py-3 px-3 rounded-lg text-pantry-cream font-semibold hover:bg-white/10 hover:text-pantry-amber transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-amber focus-visible:ring-offset-2 focus-visible:ring-offset-pantry-green"
            onClick={() => setMobileOpen(false)}
          >
            Inventory
          </Link>
          <Link
            href="/recipes"
            className="py-3 px-3 rounded-lg text-pantry-cream font-semibold hover:bg-white/10 hover:text-pantry-amber transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pantry-amber focus-visible:ring-offset-2 focus-visible:ring-offset-pantry-green"
            onClick={() => setMobileOpen(false)}
          >
            Recipes
          </Link>
        </div>
      </div>
    </nav>
  );
}
