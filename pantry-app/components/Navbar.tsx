"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-6 py-1 flex items-center bg-pantry-green/80 backdrop-blur-md shadow-sm border-b border-white/10">
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
      {/* spacer to balance logo on the left */}
      <div className="shrink-0 w-[200px]" />
    </nav>
  );
}
