"use client";

import { Reveal } from "./animations";

export default function MissionQuote() {
  return (
    <section className="px-6 py-24 bg-white">
      <Reveal className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          <span className="text-7xl leading-none text-pantry-amber/60" style={{ fontFamily: "Dancing Script, cursive" }}>
            &ldquo;
          </span>
          <p className="text-2xl sm:text-[1.75rem] font-light text-[#1a1a1a] leading-snug -mt-4">
            The Pantry aids UC Davis students in their pursuit of higher education by ensuring that{" "}
            <em className="not-italic font-semibold text-pantry-green">no student ever has to miss a meal</em>{" "}
            or lack basic necessities due to financial reasons.
          </p>
          <span className="text-7xl leading-none text-pantry-amber/60 self-end -mt-2" style={{ fontFamily: "Dancing Script, cursive" }}>
            &rdquo;
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/25 mt-1">
            Over 50,000 visits · 2018–2019 school year
          </span>
        </div>
      </Reveal>
    </section>
  );
}
