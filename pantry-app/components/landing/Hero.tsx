"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ease } from "./animations";

const stats = [
  { number: "50K+", label: "Visits per year" },
  { number: "3 pts", label: "Per student/day" },
  { number: "Free", label: "No questions asked" },
  { number: "Est. 2010", label: "UC Davis" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[94vh] flex flex-col justify-center overflow-hidden">

      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image3.jpeg"
          alt="The Pantry at UC Davis"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient: solid white on the left fading to transparent, then a bottom vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,1) 30%, rgba(255,255,255,0.85) 52%, rgba(255,255,255,0.35) 72%, rgba(255,255,255,0) 100%)",
          }}
        />
        {/* Subtle top+bottom fade for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-28">

        {/* Text block — left half only so image shows on right */}
        <div className="flex flex-col items-start max-w-xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="bg-pantry-green/10 text-pantry-green text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-8 inline-block border border-pantry-green/20"
          >
            The Pantry at ASUCD · UC Davis
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease }}
            className="text-6xl sm:text-7xl md:text-[5.5rem] leading-[1.05] tracking-tight"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            <span className="text-pantry-green">No student</span>
            <br />
            <span className="text-pantry-coral">goes hungry.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
            className="mt-7 max-w-sm text-base sm:text-lg text-[#1a1a1a]/50 leading-relaxed"
          >
            Turn your Pantry haul into a real meal — free, no questions asked, just your Aggie ID.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease }}
            className="mt-9 flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/ingredients"
              className="bg-pantry-green text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-pantry-coral transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 text-center"
            >
              Start Cooking →
            </Link>
            <Link
              href="/inventory"
              className="border border-[#1a1a1a]/15 text-[#1a1a1a]/60 px-8 py-3.5 rounded-full font-semibold text-sm hover:border-pantry-green/50 hover:text-pantry-green transition-all duration-300 text-center bg-white/50 backdrop-blur-sm"
            >
              This Week&apos;s Inventory
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 border-t border-[#1a1a1a]/8 pt-10 w-full"
          >
            {stats.map(({ number, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 + i * 0.08, ease }}
                className="flex flex-col gap-1"
              >
                <span className="text-2xl sm:text-3xl font-black text-pantry-green">{number}</span>
                <span className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
