// WaveSurfer Audio Visualizer Hook.
// Manages the complete lifecycle of the WaveSurfer.js canvas for TTS playback.
// Recreates the instance when the URL changes and guarantees teardown on unmount
// to prevent zombie audio nodes.
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
}: UseWaveSurferOptions): UseWaveSurferReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const isMobile = useIsMobile();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    setIsReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }

    // Guard against late callbacks after URL changes.
    let destroyed = false;

    const waveColor = resolveThemeColor("--border", "#E9D8D0");
    const progressColor = "#E38B63";
    const cursorColor = resolveThemeColor("--ring", "#D97757");

    const ws = WaveSurfer.create({
      container: containerRef.current,

      waveColor,
      progressColor,
      cursorColor,

      cursorWidth: isMobile ? 1 : 1.5,

      barWidth: isMobile ? 2 : 3,
      barGap: isMobile ? 1.5 : 3,
      barRadius: 999,
      barMinHeight: 3,

      height: isMobile ? 72 : 110,

      dragToSeek: true,
      normalize: true,
    });

    wavesurferRef.current = ws;

    ws.on("ready", () => {
      setIsReady(true);
      setDuration(ws.getDuration());
      setCurrentTime(0);
      ws.seekTo(0);
// Catch NotAllowedError when the browser blocks autoplay without user interaction.
// This is a common requirement in modern browsers to prevent unexpected audio playback.
      if (autoplay) {
        ws.play().catch(() => {});
      }

      onReady?.();
    });

    ws.on("play", () => setIsPlaying(true));

    ws.on("pause", () => setIsPlaying(false));

    ws.on("finish", () => {
      setIsPlaying(false);
      setCurrentTime(0);
      ws.seekTo(0);
    });

    ws.on("timeupdate", (time) => {
      setCurrentTime(time);
    });

    ws.on("error", (error) => {
      if (destroyed) return;

      if (process.env.NODE_ENV === "development") {
        console.error("WaveSurfer error:", error);
      }

      onError?.(new Error(String(error)));
    });

    ws.load(url).catch((error) => {
      if (destroyed) return;

      if (process.env.NODE_ENV === "development") {
        console.error("WaveSurfer load error:", error);
      }

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
