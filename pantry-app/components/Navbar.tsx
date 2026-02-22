"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-6 py-1 flex items-center justify-between bg-pantry-green/80 backdrop-blur-md shadow-sm border-b border-white/10">
      <Link href="/">
        <Image
          src="/pantry.png"
          alt="The Pantry"
          width={200}
          height={60}
          className="object-contain h-14 w-auto"
        />
      </Link>
      <div className="flex gap-6 text-pantry-cream text-sm font-medium">
        <Link href="/" className="hover:text-pantry-amber transition-colors">Home</Link>
        <Link href="/ingredients" className="hover:text-pantry-amber transition-colors">Ingredients</Link>
        <Link href="/recipes" className="hover:text-pantry-amber transition-colors">Recipes</Link>
        <Link href="/inventory" className="hover:text-pantry-amber transition-colors">Pantry Inventory</Link>
      </div>
    </nav>
  );
}
