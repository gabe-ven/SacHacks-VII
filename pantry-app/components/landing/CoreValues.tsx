"use client";

import { Reveal, StaggerGrid, StaggerItem } from "./animations";

const values = [
  { icon: "🌱", label: "Fight Food Insecurity", desc: "Destigmatize and fight food insecurity across the UC Davis community." },
  { icon: "💚", label: "Student Health", desc: "Promote physical and mental health for every student on campus." },
  { icon: "🔑", label: "Free Resource", desc: "Always free, always accessible. No cost, no catch, no questions." },
];

export default function CoreValues() {
  return (
    <section className="px-6 py-24 bg-[#f9f9f7]">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <span className="text-pantry-coral text-[11px] font-bold uppercase tracking-[0.2em]">Core Values</span>
          <h2 className="text-5xl sm:text-6xl text-[#1a1a1a] mt-3" style={{ fontFamily: "Dancing Script, cursive" }}>
            What we <span className="text-pantry-coral">stand for</span>
          </h2>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {values.map(({ icon, label, desc }) => (
            <StaggerItem key={label}>
              <div className="bg-white rounded-2xl p-8 flex flex-col gap-4 border border-[#1a1a1a]/5 hover:shadow-lg hover:border-pantry-coral/15 transition-all duration-300 h-full cursor-default">
                <span className="text-3xl">{icon}</span>
                <h3 className="font-semibold text-pantry-green text-sm tracking-wide">{label}</h3>
                <p className="text-sm text-[#1a1a1a]/45 leading-relaxed">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
