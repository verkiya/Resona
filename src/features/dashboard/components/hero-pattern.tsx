"use client";

import { motion } from "framer-motion";

type HeroPatternProps = {
  isActive?: boolean;
};

export function HeroPattern({ isActive = false }: HeroPatternProps) {
  return (
    <div className="pointer-events-none absolute mb-50 inset-0 overflow-hidden">
      <motion.div
        className="flex w-[200%] h-full"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: isActive ? 10 : 22,
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
      className="w-1/2 h-full"
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
    >
      {/* 🔥 BIG BASE WAVE */}
      <path
        d="M0 160 Q 360 80 720 160 T 1440 160"
        stroke="rgba(99,102,241,0.55)" // indigo
        strokeWidth="70"
        strokeLinecap="round"
        fill="none"
        style={{ filter: "blur(1px)" }}
      />

      {/* 🔥 OVERLAY WAVE */}
      <path
        d="M0 150 Q 360 70 720 150 T 1440 150"
        stroke="rgba(56,189,248,0.5)" // sky
        strokeWidth="60"
        strokeLinecap="round"
        fill="none"
        style={{ filter: "blur(1px)" }}
      />

      {/* 🔥 TOP HIGHLIGHT */}
      <path
        d="M0 140 Q 360 60 720 140 T 1440 140"
        stroke="rgba(168,85,247,0.45)" // violet
        strokeWidth="50"
        strokeLinecap="round"
        fill="none"
        style={{ filter: "blur(0.8px)" }}
      />

      {/* 🔥 LOWER FILL BAND */}
      <path
        d="M0 190 Q 360 120 720 190 T 1440 190"
        stroke="rgba(16,185,129,0.35)" // emerald contrast
        strokeWidth="55"
        strokeLinecap="round"
        fill="none"
        style={{ filter: "blur(1.2px)" }}
      />
    </svg>
  );
}
