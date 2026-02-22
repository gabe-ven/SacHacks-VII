"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ease, spring, springBouncy } from "./animations";

const stats = [
  { from: 0, to: 50, suffix: "K+", label: "Visits per year" },
  { from: 0, to: 3,  suffix: " pts", label: "Per student/day" },
  { from: 0, to: 100, suffix: "%", label: "Always free" },
  { from: 2005, to: 2010, suffix: "", prefix: "Est. ", label: "UC Davis" },
];

function CountUp({ from, to, suffix = "", prefix = "", duration = 1.4, delay = 0 }: {
  from: number; to: number; suffix?: string; prefix?: string; duration?: number; delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(from);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const range = to - from;
    const step = (ts: number) => {
      if (!start) start = ts + delay * 1000;
      const elapsed = Math.max(0, ts - start);
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(from + range * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, from, to, duration, delay]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

export default function Hero() {
  return (
    <section className="relative h-screen max-h-screen flex flex-col justify-center overflow-hidden -mt-16">

      <div className="absolute inset-0 z-0">
        <Image src="/image3.jpeg" alt="The Pantry at UC Davis" fill className="object-cover object-center" priority />
        <div className="absolute inset-0" style={{ background: "var(--hero-gradient)" }} />
        <div className="absolute inset-0" style={{ background: "var(--hero-vignette)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-16 pb-8">
        <div className="flex flex-col items-start max-w-xl">

          {/* Logo — floats gently */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.05 }}
            className="mb-5"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src="/pantrylogo.png" alt="The Pantry" width={280} height={160} className="w-44 h-auto object-contain" />
            </motion.div>
          </motion.div>

          {/* Headline — 3D flip in per line */}
          <div style={{ perspective: "800px" }}>
            <motion.h1
              initial={{ opacity: 0, rotateX: 20, y: 30 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ ...spring, delay: 0.15 }}
              style={{ transformOrigin: "top left", fontFamily: "var(--font-display)" }}
              className="text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight"
            >
              <span className="text-pantry-green">No student</span>
              <br />
              <motion.span
                className="text-pantry-coral inline-block"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springBouncy, delay: 0.3 }}
              >
                goes hungry.
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease }}
            className="mt-4 max-w-sm text-sm sm:text-base text-muted leading-relaxed"
          >
            Turn your Pantry haul into a real meal — free, no questions asked, just your Aggie ID.
          </motion.p>

          {/* Buttons — pop in with bounce */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...springBouncy, delay: 0.55 }}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/inventory"
              className="bg-pantry-green text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-pantry-coral transition-colors duration-200 shadow-sm text-center"
            >
              Start Cooking →
            </Link>
            <a
              href="https://thepantry.ucdavis.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border text-muted px-7 py-3 rounded-full font-semibold text-sm hover:border-pantry-green/50 hover:text-pantry-green transition-colors duration-200 text-center bg-surface-card/50 backdrop-blur-sm"
            >
              About the Pantry ↗
            </a>
          </motion.div>

          {/* Stats — staggered pop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-10 grid grid-cols-4 gap-6 sm:gap-10 border-t border-border pt-8 w-full"
          >
            {stats.map(({ from, to, suffix, prefix, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...springBouncy, delay: 0.75 + i * 0.08 }}
                className="flex flex-col gap-0.5"
              >
                <span className="text-xl sm:text-2xl font-black text-pantry-green whitespace-nowrap">
                  <CountUp from={from} to={to} suffix={suffix} prefix={prefix} delay={0.8 + i * 0.08} />
                </span>
                <span className="text-[10px] text-muted uppercase tracking-wider">{label}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
