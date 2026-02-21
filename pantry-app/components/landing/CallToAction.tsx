"use client";

import Link from "next/link";
import { Reveal } from "./animations";

export default function CallToAction() {
  return (
    <section className="px-6 py-28 bg-white relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-pantry-amber/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-pantry-green/8 rounded-full blur-3xl pointer-events-none" />

      <Reveal className="relative z-10 flex flex-col items-center text-center gap-5 max-w-lg mx-auto">
        <h2 className="text-5xl sm:text-6xl text-pantry-green" style={{ fontFamily: "Dancing Script, cursive" }}>
          What&apos;s in your bag today?
        </h2>
        <p className="text-[#1a1a1a]/45 text-sm leading-relaxed max-w-xs">
          Tell us what you picked up and we&apos;ll turn it into a real meal in seconds.
        </p>
        <Link
          href="/ingredients"
          className="bg-pantry-green text-white px-10 py-3.5 rounded-full font-bold text-sm hover:bg-pantry-coral transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 mt-2"
        >
          Start Cooking →
        </Link>
      </Reveal>
    </section>
  );
}
