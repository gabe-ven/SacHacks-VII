"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal, ease } from "./animations";

const promises = [
  {
    num: "1",
    word: "Warm",
    desc: "A welcoming, inclusive team empathetic to every student's situation.",
    color: "text-pantry-green",
    line: "bg-pantry-green",
  },
  {
    num: "2",
    word: "Reliable",
    desc: "Here every single week. Just swipe your ID — no explanation needed.",
    color: "text-pantry-amber",
    line: "bg-pantry-amber",
  },
  {
    num: "3",
    word: "Confidential",
    desc: "We don't judge. Grab your items and go. Your privacy is sacred.",
    color: "text-pantry-coral",
    line: "bg-pantry-coral",
  },
];

function Card({ num, word, desc, color, line, index }: typeof promises[0] & { index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      className="flex flex-col items-center text-center gap-4"
    >
      <div className={`h-px w-12 ${line}`} />
      <span className="text-[10px] font-bold text-muted/40 tabular-nums">{num}</span>
      <span
        className={`${color} leading-none`}
        style={{ fontFamily: "Dancing Script, cursive", fontSize: "clamp(2.4rem, 4vw, 3rem)" }}
      >
        {word}
      </span>
      <p className="text-sm text-muted leading-relaxed max-w-[220px]">{desc}</p>
    </motion.div>
  );
}

export default function Promise() {
  return (
    <section className="px-6 py-24 bg-background">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <Reveal className="text-center mb-16">
          <span className="text-pantry-green text-[11px] font-bold uppercase tracking-[0.2em]">Our Promise</span>
          <h2 className="text-4xl sm:text-5xl text-foreground mt-3 whitespace-nowrap" style={{ fontFamily: "Dancing Script, cursive" }}>
            Built on <span className="text-pantry-coral">three promises.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 w-full">
          {promises.map((p, i) => (
            <Card key={p.word} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
