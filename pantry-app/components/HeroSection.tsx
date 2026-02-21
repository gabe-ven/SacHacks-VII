import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Turn your Pantry ingredients into simple meals.
      </h1>
      <p className="text-gray-600 mb-8 max-w-xl mx-auto">
        UC Davis students — use what's available at the Pantry to cook real meals, no grocery run needed.
      </p>
      <Link
        href="/ingredients"
        className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
      >
        Start Cooking
      </Link>
    </section>
  );
}
