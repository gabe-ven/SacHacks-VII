"use client";

import Link from "next/link";
import { Reveal } from "./animations";

export default function CallToAction() {
  return (
    <section className="px-6 py-16 bg-pantry-cream relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-pantry-amber/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-pantry-coral/10 rounded-full blur-3xl pointer-events-none" />

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

        <div className="flex flex-col items-center gap-3 mt-4 pt-6 border-t border-[#1a1a1a]/8 w-full">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#1a1a1a]/30 font-semibold">Follow us</p>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/ucdpantry/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:border-pantry-green/40 hover:text-pantry-green flex items-center justify-center transition-all duration-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@asucdpantry" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
              className="w-9 h-9 rounded-full border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:border-pantry-green/40 hover:text-pantry-green flex items-center justify-center transition-all duration-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@asucdpantry2884" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
              className="w-9 h-9 rounded-full border border-[#1a1a1a]/10 text-[#1a1a1a]/40 hover:border-pantry-green/40 hover:text-pantry-green flex items-center justify-center transition-all duration-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
              </svg>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
