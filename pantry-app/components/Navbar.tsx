import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg">
        Pantry Recipes
      </Link>
      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/ingredients">Ingredients</Link>
        <Link href="/recipes">Recipes</Link>
        <Link href="/inventory">Pantry Inventory</Link>
      </div>
    </nav>
  );
}
