"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
        {[
          { href: "/", label: "Home" },
          { href: "/inventory", label: "Pantry" },
          { href: "/recipes", label: "Recipes" },
        ].map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${active ? "text-pantry-amber font-semibold" : "hover:text-pantry-amber"}`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
