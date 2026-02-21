import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-pantry-green px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-xl text-pantry-cream" style={{ fontFamily: "Dancing Script, cursive" }}>
        The Pantry
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
