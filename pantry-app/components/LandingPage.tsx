"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const steps = [
  { step: "01", title: "Visit the Pantry", body: "Walk in during open hours and swipe your student ID. No forms, no judgment." },
  { step: "02", title: "Pick Your Items", body: "3 points per student per day. Mix and match produce, snacks, canned goods, and more." },
  { step: "03", title: "Cook Something Real", body: "Tell us what you grabbed and we'll instantly generate a real recipe from it." },
];

const values = [
  { icon: "🌱", label: "Fight Food Insecurity", desc: "Destigmatize and fight food insecurity across the UC Davis community." },
  { icon: "💚", label: "Student Health", desc: "Promote physical and mental health for every student on campus." },
  { icon: "🔑", label: "Free Resource", desc: "Always free, always accessible. No cost, no catch, no questions." },
];

const promises = [
  { word: "Warm", desc: "A welcoming, inclusive team empathetic to every student's situation." },
  { word: "Reliable", desc: "Here every single week. Just swipe your ID — no explanation needed." },
  { word: "Confidential", desc: "We don't judge. Grab your items and go. Your privacy is sacred." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-white text-[#1a1a1a] overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="min-h-[92vh] flex flex-col justify-center items-center text-center px-6 py-24 relative overflow-hidden">
        {/* subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#5E7F64 1px, transparent 1px), linear-gradient(90deg, #5E7F64 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-pantry-green/10 text-pantry-green text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 inline-block border border-pantry-green/20"
        >
          The Pantry at ASUCD · UC Davis
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight max-w-4xl"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          <span className="text-pantry-green">No student</span>
          <br />
          <span className="text-pantry-coral">goes hungry.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 max-w-md text-base sm:text-lg text-[#1a1a1a]/50 leading-relaxed"
        >
          Turn what&apos;s available at the Pantry this week into a real meal —
          free, no questions asked, just your Aggie ID.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <Link
            href="/ingredients"
            className="bg-pantry-green text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-pantry-coral transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-center"
          >
            Start Cooking →
          </Link>
          <Link
            href="/inventory"
            className="border border-[#1a1a1a]/15 text-[#1a1a1a]/70 px-8 py-3.5 rounded-full font-semibold text-sm hover:border-pantry-green hover:text-pantry-green transition-all duration-300 text-center"
          >
            This Week&apos;s Inventory
          </Link>
        </motion.div>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-16 border-t border-[#1a1a1a]/8 pt-12 w-full max-w-2xl"
        >
          {[
            { number: "50K+", label: "Visits per year" },
            { number: "3 pts", label: "Per student/day" },
            { number: "Free", label: "No questions asked" },
            { number: "Est. 2010", label: "UC Davis" },
          ].map(({ number, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl sm:text-3xl font-black text-pantry-green">{number}</span>
              <span className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-24 bg-[#f8f8f6]">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="text-pantry-coral text-xs font-bold uppercase tracking-widest">How It Works</span>
            <h2
              className="text-5xl sm:text-6xl text-[#1a1a1a] mt-2"
              style={{ fontFamily: "Dancing Script, cursive" }}
            >
              Three points.{" "}
              <span className="text-pantry-green">Infinite meals.</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map(({ step, title, body }, i) => (
              <FadeUp key={step} delay={i * 0.12}>
                <div className="bg-white rounded-3xl p-8 flex flex-col gap-5 border border-[#1a1a1a]/6 hover:border-pantry-green/30 hover:shadow-xl transition-all duration-400 h-full group">
                  <span className="text-7xl font-black text-pantry-green/10 leading-none group-hover:text-pantry-green/20 transition-colors duration-300">
                    {step}
                  </span>
                  <h3 className="font-bold text-[#1a1a1a] text-lg -mt-4">{title}</h3>
                  <p className="text-sm text-[#1a1a1a]/50 leading-relaxed">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission quote ── */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="flex flex-col gap-5">
              <span
                className="text-8xl leading-none text-pantry-amber"
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                &ldquo;
              </span>
              <p className="text-2xl sm:text-3xl font-light text-[#1a1a1a] leading-snug tracking-tight -mt-6">
                The Pantry aids UC Davis students in their pursuit of higher education by ensuring that{" "}
                <span className="font-semibold text-pantry-green">no student ever has to miss a meal</span>{" "}
                or lack basic necessities due to financial reasons.
              </p>
              <span
                className="text-8xl leading-none text-pantry-amber self-end -mt-4"
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                &rdquo;
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/30">
                Over 50,000 visits · 2018–2019 school year
              </span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="px-6 py-24 bg-[#f8f8f6]">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="text-pantry-coral text-xs font-bold uppercase tracking-widest">Core Values</span>
            <h2
              className="text-5xl sm:text-6xl text-[#1a1a1a] mt-2"
              style={{ fontFamily: "Dancing Script, cursive" }}
            >
              What we{" "}
              <span className="text-pantry-coral">stand for</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {values.map(({ icon, label, desc }, i) => (
              <FadeUp key={label} delay={i * 0.1}>
                <div className="bg-white rounded-3xl p-8 flex flex-col gap-4 border border-[#1a1a1a]/6 hover:shadow-xl hover:border-pantry-coral/20 transition-all duration-300 h-full">
                  <span className="text-4xl">{icon}</span>
                  <h3 className="font-bold text-pantry-green text-base">{label}</h3>
                  <p className="text-sm text-[#1a1a1a]/50 leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promise ── */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="text-pantry-green text-xs font-bold uppercase tracking-widest">Our Promise</span>
            <h2
              className="text-5xl sm:text-6xl text-[#1a1a1a] mt-2"
              style={{ fontFamily: "Dancing Script, cursive" }}
            >
              Warm.{" "}
              <span className="text-pantry-amber">Reliable.</span>{" "}
              Confidential.
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1a1a1a]/8">
            {promises.map(({ word, desc }, i) => (
              <FadeIn key={word} delay={i * 0.15}>
                <div className="flex flex-col gap-3 text-center px-10 py-8 sm:py-0">
                  <h3
                    className="text-4xl text-pantry-coral"
                    style={{ fontFamily: "Dancing Script, cursive" }}
                  >
                    {word}
                  </h3>
                  <p className="text-sm text-[#1a1a1a]/50 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-24 bg-pantry-green overflow-hidden relative">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-pantry-amber/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pantry-coral/10 rounded-full blur-3xl pointer-events-none" />

        <FadeUp className="relative z-10 flex flex-col items-center text-center gap-5 max-w-xl mx-auto">
          <h2
            className="text-5xl sm:text-6xl text-white"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            What&apos;s in your bag today?
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Tell us what you picked up and we&apos;ll turn it into a real meal in seconds.
          </p>
          <Link
            href="/ingredients"
            className="bg-pantry-amber text-pantry-green px-10 py-3.5 rounded-full font-bold text-sm hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-2"
          >
            Start Cooking →
          </Link>
        </FadeUp>
      </section>

    </div>
  );
}
