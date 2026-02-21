"use client";

import Image from "next/image";
import { Reveal } from "./animations";

export default function MissionQuote() {
  return (
    <section className="px-6 py-28 bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <Reveal className="relative order-2 lg:order-1">
          <div className="absolute -top-6 -left-6 w-56 h-56 bg-pantry-amber/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] ring-1 ring-border">
            <Image
              src="/image1.jpeg"
              alt="Volunteers working at The Pantry"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-pantry-green/15 to-transparent" />
          </div>
          <div className="absolute -bottom-5 -right-5 bg-pantry-green rounded-2xl shadow-xl px-5 py-4 text-white">
            <span className="block text-2xl font-black">50K+</span>
            <span className="text-[11px] text-pantry-cream/70 uppercase tracking-widest">visits</span>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="order-1 lg:order-2 flex flex-col gap-4">
          <span className="text-pantry-coral text-[11px] font-bold uppercase tracking-[0.2em]">Our Mission</span>
          <span
            className="text-7xl leading-none text-pantry-amber/40"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            &ldquo;
          </span>
          <p className="text-2xl sm:text-[1.65rem] font-light text-foreground leading-snug -mt-4">
            The Pantry aids UC Davis students in their pursuit of higher education by ensuring that{" "}
            <em className="not-italic font-semibold text-pantry-green">no student ever has to miss a meal</em>{" "}
            or lack basic necessities due to financial reasons.
          </p>
          <span
            className="text-7xl leading-none text-pantry-amber/40 self-end -mt-2"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            &rdquo;
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted mt-1">
            Over 50,000 visits · 2018–2019 school year
          </span>
        </Reveal>

      </div>
    </section>
  );
}
