"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SlideIn, spring, springBouncy } from "./animations";

export default function MissionQuote() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const quoteRef = useRef(null);
  const quoteInView = useInView(quoteRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="px-6 py-28 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: image slides in from left with rotateY */}
        <SlideIn from="left" className="relative order-2 lg:order-1">
          <div className="absolute -top-6 -left-6 w-56 h-56 bg-pantry-amber/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] ring-1 ring-border">
            <motion.div className="absolute inset-0" style={{ y: imageY }}>
              <Image src="/image1.jpeg" alt="Volunteers working at The Pantry" fill className="object-cover scale-110" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-br from-pantry-green/15 to-transparent" />
          </div>

          {/* Badge pops in with bounce */}
          <motion.div
            style={{ y: badgeY }}
            initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ ...springBouncy, delay: 0.4 }}
            className="absolute -bottom-5 -right-5 bg-pantry-green rounded-2xl shadow-xl px-5 py-4 text-pantry-cream"
          >
            <span className="block text-2xl font-black">50K+</span>
            <span className="text-[11px] text-pantry-cream/70 uppercase tracking-widest">visits</span>
          </motion.div>
        </SlideIn>

        {/* Right: quote slides from right */}
        <div ref={quoteRef} className="order-1 lg:order-2 flex flex-col gap-4" style={{ perspective: "900px" }}>
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -12 }}
            animate={quoteInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ ...spring, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <span className="text-pantry-coral text-[11px] font-bold uppercase tracking-[0.2em]">Our Mission</span>
            <div className="relative">
              <span
                className="absolute -top-4 -left-2 text-6xl leading-none text-pantry-amber/30 select-none pointer-events-none"
                style={{ fontFamily: "var(--font-display)" }}
                aria-hidden="true"
              >&ldquo;</span>
              <p className="text-2xl sm:text-[1.65rem] font-light text-foreground leading-snug pt-4">
                The Pantry aids UC Davis students in their pursuit of higher education by ensuring that{" "}
                <motion.em
                  className="not-italic font-semibold text-pantry-green"
                  initial={{ opacity: 0 }}
                  animate={quoteInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  no student ever has to miss a meal
                </motion.em>{" "}
                or lack basic necessities due to financial reasons.
              </p>
              <span
                className="absolute -bottom-6 right-0 text-6xl leading-none text-pantry-amber/30 select-none pointer-events-none"
                style={{ fontFamily: "var(--font-display)" }}
                aria-hidden="true"
              >&rdquo;</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted mt-1">
              Over 50,000 visits · 2018–2019 school year
            </span>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
