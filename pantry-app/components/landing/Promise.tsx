"use client";

import { Reveal, StaggerGrid, StaggerItem } from "./animations";

const promises = [
  { word: "Warm", desc: "A welcoming, inclusive team empathetic to every student's situation." },
  { word: "Reliable", desc: "Here every single week. Just swipe your ID — no explanation needed." },
  { word: "Confidential", desc: "We don't judge. Grab your items and go. Your privacy is sacred." },
];

export default function Promise() {
  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-14">
          <span className="text-pantry-green text-[11px] font-bold uppercase tracking-[0.2em]">Our Promise</span>
          <h2 className="text-5xl sm:text-6xl text-[#1a1a1a] mt-3" style={{ fontFamily: "Dancing Script, cursive" }}>
            Warm. <span className="text-pantry-amber">Reliable.</span> Confidential.
          </h2>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-3">
          {promises.map(({ word, desc }) => (
            <StaggerItem key={word}>
              <div className="flex flex-col gap-3 text-center px-8 py-6 sm:py-0 border-b sm:border-b-0 sm:border-r border-[#1a1a1a]/6 last:border-0">
                <h3 className="text-4xl text-pantry-coral" style={{ fontFamily: "Dancing Script, cursive" }}>{word}</h3>
                <p className="text-sm text-[#1a1a1a]/45 leading-relaxed">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
