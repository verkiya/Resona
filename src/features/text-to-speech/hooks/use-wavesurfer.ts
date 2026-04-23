"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { useIsMobile } from "@/hooks/use-mobile";

function resolveThemeColor(cssVariable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;

  const rootValue = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVariable)
    .trim();

  if (!rootValue) return fallback;

  // Convert tokens like oklch(...) into a canvas-safe computed color string.
  const probe = document.createElement("span");
  probe.style.color = rootValue;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();

  return resolved || fallback;
}

interface UseWaveSurferOptions {
  url?: string;
  autoplay?: boolean;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

interface UseWaveSurferReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isPlaying: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
  togglePlayPause: () => void;
  seekForward: (seconds?: number) => void;
  seekBackward: (seconds?: number) => void;
}

export function useWaveSurfer({
  url,
  autoplay,
  onReady,
  onError,
}: UseWaveSurferOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const isMobile = useIsMobile();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    // Reset UI state for each new source to avoid stale elapsed/duration values.
    setIsReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }

    let destroyed = false;

    const waveColor = resolveThemeColor("--muted-foreground", "#C89D95");
    const progressColor = resolveThemeColor("--primary", "#B16051");
    const cursorColor = resolveThemeColor("--ring", "#B16051");

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      cursorColor,
      cursorWidth: 2,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      barMinHeight: 4,
      height: "auto",
      normalize: true,
    });

    wavesurferRef.current = ws;

    ws.on("ready", () => {
      setIsReady(true);
      setDuration(ws.getDuration());
      setCurrentTime(0);
      ws.seekTo(0);

      // Catch NotAllowedError when browser blocks autoplay without user interaction
      if (autoplay) ws.play().catch(() => {});
      onReady?.();
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => setIsPlaying(false));
    ws.on("timeupdate", (time) => setCurrentTime(time));

    ws.on("error", (error) => {
      if (destroyed) return;
      console.error("WaveSurfer error:", error);
      onError?.(new Error(String(error)));
    });

    ws.load(url).catch((error) => {
      if (destroyed) return;
      console.error("WaveSurfer load error:", error);
      onError?.(new Error(String(error)));
    });

    return () => {
      destroyed = true;
      ws.destroy();
    };
  }, [url, autoplay, onReady, onError, isMobile]);

  const togglePlayPause = useCallback(() => {
    wavesurferRef.current?.playPause();
  }, []);

  const seekForward = useCallback((seconds = 5) => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    const totalDuration = ws.getDuration();
    if (!totalDuration) return;

    const newTime = Math.min(ws.getCurrentTime() + seconds, totalDuration);
    ws.seekTo(newTime / totalDuration);
  }, []);

  const seekBackward = useCallback((seconds = 5) => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    const totalDuration = ws.getDuration();
    if (!totalDuration) return;

    const newTime = Math.max(ws.getCurrentTime() - seconds, 0);
    ws.seekTo(newTime / totalDuration);
  }, []);

  return {
    containerRef,
    isPlaying,
    isReady,
    currentTime,
    duration,
    togglePlayPause,
    seekForward,
    seekBackward,
  };
}
