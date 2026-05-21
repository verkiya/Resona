// AI explanation: Decorative background pattern on the dashboard marketing hero.
"use client";

import { motion, useReducedMotion } from "framer-motion";

type HeroPatternProps = {
  isActive?: boolean;
};

export function HeroPattern({ isActive = false }: HeroPatternProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 mb-50 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex h-full w-[200%] opacity-75"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: ["0%", "-50%"],
              }
        }
        transition={{
          duration: isActive ? 14 : 28,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <WaveSVG />
        <WaveSVG />
      </motion.div>
    </div>
  );
}

function WaveSVG() {
  return (
    <svg
      className="h-full w-1/2"
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
    >
      <path
        d="M0 165 Q 360 85 720 165 T 1440 165"
        stroke="rgba(99,102,241,0.42)"
        strokeWidth="70"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      <path
        d="M0 148 Q 360 70 720 148 T 1440 148"
        stroke="rgba(56,189,248,0.38)"
        strokeWidth="60"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      <path
        d="M0 132 Q 360 56 720 132 T 1440 132"
        stroke="rgba(168,85,247,0.32)"
        strokeWidth="50"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
