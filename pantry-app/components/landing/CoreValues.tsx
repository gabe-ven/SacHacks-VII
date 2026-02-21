"use client";

import { Reveal, StaggerGrid, StaggerItem } from "./animations";

const values = [
  {
    label: "Fight Food Insecurity",
    desc: "Destigmatize and fight food insecurity across the UC Davis community.",
    bg: "bg-pantry-green",
    tint: "hover:bg-pantry-green/5 hover:border-pantry-green/20",
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 4v5l3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h.01M12 10h.01M15 10h.01M9 14h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 10c0-2.76 2.24-5 5-5s5 2.24 5 5" />
        <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
      </svg>
    ),
    stat: "50K+ students helped",
  },
  {
    label: "Student Health",
    desc: "Promote physical and mental health for every student on campus.",
    bg: "bg-pantry-amber",
    tint: "hover:bg-pantry-amber/5 hover:border-pantry-amber/20",
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    stat: "3 pts per day",
  },
  {
    label: "Free Resource",
    desc: "Always free, always accessible. No cost, no catch, no questions.",
    bg: "bg-pantry-coral",
    tint: "hover:bg-pantry-coral/5 hover:border-pantry-coral/20",
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    stat: "No ID scan, no judgment",
  },
];

export default function CoreValues() {
  return (
    <section className="px-6 py-28 bg-surface">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="text-pantry-coral text-[11px] font-bold uppercase tracking-[0.2em]">Core Values</span>
          <h2 className="text-5xl sm:text-6xl text-foreground mt-3" style={{ fontFamily: "Dancing Script, cursive" }}>
            What we <span className="text-pantry-coral">stand for</span>
          </h2>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {values.map(({ label, desc, bg, tint, icon, stat }) => (
            <StaggerItem key={label}>
              <div className={`rounded-2xl border border-border ${tint} hover:shadow-sm hover:-translate-y-px transition-[transform,box-shadow,border-color,background-color] duration-500 ease-out overflow-hidden h-full flex flex-col cursor-default`}>

                {/* colored banner */}
                <div className={`${bg} px-7 pt-8 pb-10 flex flex-col gap-4 relative overflow-hidden`}>
                  {/* faint circle decoration */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/5" />
                  {icon}
                  <h3 className="font-bold text-white text-lg leading-snug relative z-10">{label}</h3>
                </div>

                {/* body */}
                <div className="bg-surface-card px-7 py-6 flex flex-col gap-4 flex-1">
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                  <div className="mt-auto pt-4 border-t border-border">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{stat}</span>
                  </div>
                </div>

              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
