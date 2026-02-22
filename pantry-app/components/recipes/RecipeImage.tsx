"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  large?: boolean;
}

export default function RecipeImage({ src, alt, className, large }: Props) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <Placeholder large={large} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={className ?? "absolute inset-0 w-full h-full object-cover"}
    />
  );
}

function Placeholder({ large }: { large?: boolean }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--pantry-green) 1px, transparent 1px), linear-gradient(90deg, var(--pantry-green) 1px, transparent 1px)",
          backgroundSize: large ? "32px 32px" : "24px 24px",
        }}
      />
      <svg
        className={`absolute inset-0 m-auto ${large ? "w-14 h-14 text-pantry-cream/25" : "w-10 h-10 text-pantry-brown/30"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7.8-5 12a5 5 0 0010 0c0-4.2-3.8-6.6-5-12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M9 9.5c-.5 1 .5 2 1.5 2" />
      </svg>
    </>
  );
}
