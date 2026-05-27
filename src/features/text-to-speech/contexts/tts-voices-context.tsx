"use client";
// Shares the voices list from the page loader with nested TTS components so selectors do not each refetch voices.getAll.

import { createContext, useContext } from "react";
import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app"; // Basically a single type definition of our entire API

type TTSVoiceItem =
  inferRouterOutputs<AppRouter>["voices"]["getAll"]["system"][number];

interface TTSVoicesContextValue {
  customVoices: TTSVoiceItem[];
  systemVoices: TTSVoiceItem[];
  allVoices: TTSVoiceItem[];
}

const TTSVoicesContext = createContext<TTSVoicesContextValue | null>(null);

export function TTSVoicesProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: TTSVoicesContextValue;
}) {
  return (
    <TTSVoicesContext.Provider value={value}>
      {children}
    </TTSVoicesContext.Provider>
  );
}

export function useTTSVoices() {
  const context = useContext(TTSVoicesContext);

  if (!context) {
    throw new Error("useTTSVoices must be used within a TTSVoicesProvider");
  }

  return context;
}
