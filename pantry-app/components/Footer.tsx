export default function Footer() {
  return (
    <footer className="bg-pantry-green text-pantry-cream/60 px-6 py-5 mt-auto">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <p>
          <span className="font-semibold text-pantry-cream">The Pantry at ASUCD</span>
          {" · "}UC Davis · Free food and basic necessities for every student
        </p>
        <a
          href="https://thepantry.ucdavis.edu/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pantry-amber transition-colors"
        >
          thepantry.ucdavis.edu ↗
        </a>
      </div>
    </footer>
  );
}
