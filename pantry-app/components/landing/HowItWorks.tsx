"use client";

import { Reveal, StaggerGrid, StaggerItem } from "./animations";

const steps = [
  { step: "01", title: "Visit the Pantry", body: "Walk in during open hours and swipe your student ID. No forms, no judgment." },
  { step: "02", title: "Pick Your Items", body: "3 points per student per day. Mix and match produce, snacks, canned goods, and more." },
  { step: "03", title: "Cook Something Real", body: "Tell us what you grabbed and we'll instantly generate a real recipe from it." },
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-24 bg-[#f9f9f7]">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <span className="text-pantry-coral text-[11px] font-bold uppercase tracking-[0.2em]">How It Works</span>
          <h2 className="text-5xl sm:text-6xl text-[#1a1a1a] mt-3" style={{ fontFamily: "Dancing Script, cursive" }}>
            Three points.{" "}
            <span className="text-pantry-green">Infinite meals.</span>
          </h2>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map(({ step, title, body }) => (
            <StaggerItem key={step}>
              <div className="bg-white rounded-2xl p-8 flex flex-col gap-4 border border-[#1a1a1a]/5 hover:border-pantry-green/20 hover:shadow-lg transition-all duration-300 h-full group cursor-default">
                <span className="text-6xl font-black text-[#1a1a1a]/5 leading-none select-none group-hover:text-pantry-green/10 transition-colors duration-300">
                  {step}
                </span>
                <h3 className="font-semibold text-[#1a1a1a] text-base -mt-2">{title}</h3>
                <p className="text-sm text-[#1a1a1a]/45 leading-relaxed">{body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
