import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="bg-pantry-green text-pantry-cream px-6 py-24 text-center flex flex-col items-center gap-6">
        <p className="text-pantry-amber text-sm font-semibold uppercase tracking-widest">
          The Pantry at ASUCD · UC Davis
        </p>
        <h1
          className="text-5xl md:text-7xl leading-tight"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          No student goes hungry.
        </h1>
        <p className="max-w-xl text-lg text-pantry-cream/80 leading-relaxed">
          Turn what&apos;s available at the Pantry this week into a real meal.
          Free food, no questions asked — just swipe your Aggie ID.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/ingredients"
            className="bg-pantry-coral text-white px-8 py-3 rounded-full font-semibold hover:bg-pantry-amber hover:text-pantry-green transition-colors"
          >
            Start Cooking
          </Link>
          <Link
            href="/inventory"
            className="border border-pantry-cream/50 text-pantry-cream px-8 py-3 rounded-full font-semibold hover:bg-pantry-cream/10 transition-colors"
          >
            This Week&apos;s Inventory
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-pantry-cream px-6 py-20 text-center">
        <p className="text-pantry-green text-sm font-semibold uppercase tracking-widest mb-3">
          How It Works
        </p>
        <h2
          className="text-4xl text-pantry-green mb-12"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          Three points. Infinite meals.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: "1", title: "Visit the Pantry", body: "Walk in during open hours and swipe your student ID. No forms, no judgment, no questions asked." },
            { step: "2", title: "Pick Your Items", body: "Every student gets 3 points per day. Mix and match produce, snacks, canned goods, and more." },
            { step: "3", title: "Cook Something Real", body: "Use this app to turn your Pantry haul into a simple, satisfying meal — we'll do the thinking." },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pantry-green text-pantry-cream flex items-center justify-center text-xl font-bold">
                {step}
              </div>
              <h3 className="font-semibold text-lg text-pantry-green">{title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission banner ── */}
      <section className="bg-pantry-amber px-6 py-16 text-center">
        <p className="max-w-2xl mx-auto text-pantry-green text-lg font-medium leading-relaxed">
          &ldquo;The Pantry aids UC Davis students in their pursuit of higher education by ensuring
          that no student ever has to miss a meal or lack basic necessities due to financial reasons.&rdquo;
        </p>
        <p className="mt-4 text-pantry-green/70 text-sm font-semibold uppercase tracking-widest">
          Over 50,000 visits — 2018–2019 school year
        </p>
      </section>

      {/* ── Core Values ── */}
      <section className="bg-pantry-cream px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-pantry-green text-sm font-semibold uppercase tracking-widest mb-3 text-center">
            Core Values
          </p>
          <h2
            className="text-4xl text-pantry-green mb-12 text-center"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            What we stand for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🌱", value: "Fight Food Insecurity", desc: "Destigmatize and fight food insecurity across the UC Davis community." },
              { icon: "💚", value: "Student Health", desc: "Promote physical and mental health amongst the student population." },
              { icon: "🔑", value: "Resource", desc: "Remain a free, accessible resource for every student to obtain basic necessities." },
            ].map(({ icon, value, desc }) => (
              <div
                key={value}
                className="bg-white/60 border border-pantry-tan rounded-2xl p-6 flex flex-col gap-3"
              >
                <span className="text-3xl">{icon}</span>
                <h3 className="font-bold text-pantry-green text-lg">{value}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personality / Why trust us ── */}
      <section className="bg-pantry-tan/40 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-pantry-green text-sm font-semibold uppercase tracking-widest mb-3 text-center">
            Our Promise
          </p>
          <h2
            className="text-4xl text-pantry-green mb-12 text-center"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            Warm. Reliable. Confidential.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { word: "Warm", desc: "We are a welcoming, inclusive team — empathetic to every student's situation." },
              { word: "Reliable", desc: "We are here for you every week. Just swipe your ID. No explanation needed." },
              { word: "Confidential", desc: "We don't judge. Grab your items and go — your privacy is always respected." },
            ].map(({ word, desc }) => (
              <div key={word} className="flex flex-col items-center gap-2">
                <h3
                  className="text-3xl text-pantry-coral"
                  style={{ fontFamily: "Dancing Script, cursive" }}
                >
                  {word}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-pantry-green px-6 py-20 text-center flex flex-col items-center gap-5">
        <h2
          className="text-4xl md:text-5xl text-pantry-cream"
          style={{ fontFamily: "Dancing Script, cursive" }}
        >
          What&apos;s in your Pantry bag today?
        </h2>
        <p className="text-pantry-cream/70 max-w-md">
          Tell us what you picked up and we&apos;ll turn it into a simple, delicious meal.
        </p>
        <Link
          href="/ingredients"
          className="bg-pantry-amber text-pantry-green px-10 py-3 rounded-full font-bold hover:bg-pantry-coral hover:text-white transition-colors"
        >
          Start Cooking →
        </Link>
      </section>

    </div>
  );
}
