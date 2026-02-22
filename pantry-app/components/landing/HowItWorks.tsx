"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal3D, spring, springBouncy } from "./animations";

const steps = [
  { step: "1", title: "Visit the Pantry", body: "Walk in during open hours and swipe your student ID. No forms, no judgment.", color: "text-pantry-green", pill: "bg-pantry-green/10 text-pantry-green", shift: "ml-0 mr-auto", },
  { step: "2", title: "Pick Your Items", body: "3 points per student per day. Mix and match produce, snacks, canned goods, and more.", color: "text-pantry-amber", pill: "bg-pantry-amber/10 text-pantry-amber", shift: "sm:ml-[14%]", },
  { step: "3", title: "Cook Something Real", body: "Tell us what you grabbed and we'll instantly generate a real recipe from it.", color: "text-pantry-coral", pill: "bg-pantry-coral/10 text-pantry-coral", shift: "sm:ml-[28%]", },
];

function Step({ step, title, body, color, pill, shift, index }: typeof steps[0] & { index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div style={{ perspective: "900px" }} className={shift}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -50, rotateY: 18, y: 20 }}
        animate={inView ? { opacity: 1, x: 0, rotateY: 0, y: 0 } : {}}
        transition={{ ...spring, delay: index * 0.15 }}
        className="flex items-center gap-6"
      >
        {/* Big number — bounces in */}
        <motion.span
          initial={{ opacity: 0, scale: 0.4 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ ...springBouncy, delay: index * 0.15 + 0.1 }}
          className={`${color} font-black leading-none select-none shrink-0 w-24 sm:w-32 text-right`}
          style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)", letterSpacing: "-0.05em" }}
        >
          {step}
        </motion.span>

        <div className={`w-px h-14 ${color} opacity-20 shrink-0`} />

        <div className="flex flex-col gap-1 min-w-0">
          <span className={`${pill} text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full self-start`}>
            Step {step}
          </span>
          <h3 className="text-lg font-bold text-foreground leading-snug">{title}</h3>
          <p className="text-sm text-muted leading-relaxed">{body}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="px-6 py-20 bg-surface overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <Reveal3D className="text-center mb-12">
          <span className="text-pantry-coral text-[11px] font-bold uppercase tracking-[0.2em]">How It Works</span>
          <h2 className="text-5xl sm:text-6xl text-foreground mt-3" style={{ fontFamily: "var(--font-display)" }}>
            Three points.{" "}
            <span className="text-pantry-green">Infinite meals.</span>
          </h2>
        </Reveal3D>

        <div className="flex flex-col gap-6">
          {steps.map((s, i) => (
            <Step key={s.step} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
