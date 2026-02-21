import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import MissionQuote from "@/components/landing/MissionQuote";
import CoreValues from "@/components/landing/CoreValues";
import Promise from "@/components/landing/Promise";
import CallToAction from "@/components/landing/CallToAction";

export default function HomePage() {
  return (
    <div className="flex flex-col bg-background text-foreground overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <MissionQuote />
      <CoreValues />
      <Promise />
      <CallToAction />
    </div>
  );
}
