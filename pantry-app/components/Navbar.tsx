"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-6 py-1 flex items-center bg-pantry-green/85 backdrop-blur-md shadow-sm border-b border-white/10">
      <Link href="/" className="shrink-0">
        <Image
          src="/pantry.png"
          alt="The Pantry"
          width={200}
          height={60}
          className="object-contain h-14 w-auto"
        />
      </Link>
      <div className="flex-1 flex justify-center gap-8 text-pantry-cream text-base font-semibold">
        <Link href="/" className="hover:text-pantry-amber transition-colors">Home</Link>
        <Link href="/inventory" className="hover:text-pantry-amber transition-colors">Pantry Inventory</Link>
        <Link href="/recipes" className="hover:text-pantry-amber transition-colors">Recipes</Link>
      </div>
      <div className="shrink-0 w-[200px] flex justify-end">
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
      </div>
    </nav>
  );
}
