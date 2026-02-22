"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const ease = [0.16, 1, 0.3, 1] as const;
export const spring = { type: "spring", stiffness: 280, damping: 22 } as const;
export const springBouncy = { type: "spring", stiffness: 400, damping: 18 } as const;

/* ── flat fade + rise (original) ───────────────────────────── */
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 3-D flip up from flat ──────────────────────────────────── */
export function Reveal3D({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div style={{ perspective: "900px" }} className={className}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40, rotateX: 18 }}
        animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ duration: 0.75, delay, ease }}
        style={{ transformOrigin: "top center" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── slide in from a side ───────────────────────────────────── */
export function SlideIn({ children, from = "left", delay = 0, className = "" }: {
  children: React.ReactNode; from?: "left" | "right" | "bottom"; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const initial =
    from === "left"   ? { opacity: 0, x: -60, rotateY: 12 } :
    from === "right"  ? { opacity: 0, x:  60, rotateY: -12 } :
                        { opacity: 0, y:  60 };
  return (
    <div style={{ perspective: "1000px" }} className={className}>
      <motion.div
        ref={ref}
        initial={initial}
        animate={inView ? { opacity: 1, x: 0, y: 0, rotateY: 0 } : {}}
        transition={{ ...spring, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── pop in with bounce ─────────────────────────────────────── */
export function PopIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.75, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ ...springBouncy, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── stagger grid ───────────────────────────────────────────── */
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 30, rotateX: 12, scale: 0.96 },
  show: {
    opacity: 1, y: 0, rotateX: 0, scale: 1,
    transition: { duration: 0.55, ease },
  },
};

export function StaggerGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      style={{ perspective: "1200px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} style={{ transformOrigin: "top center" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── recipe card scroll animations (trigger per card as you scroll) ────────── */
const recipeCardEase = [0.25, 0.46, 0.45, 0.94] as const;

export function RecipeCardGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function RecipeCardItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -40px 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 32, scale: 0.98 }}
      transition={{ duration: 0.52, ease: recipeCardEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
