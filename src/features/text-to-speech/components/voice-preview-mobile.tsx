// AI explanation: Mobile-only playback strip for a generation (WaveSurfer + metadata).
"use client";

import { useRef, useState, useEffect } from "react";
import { Pause, Play, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { useIsMobile } from "@/hooks/use-mobile";

type VoicePreviewMobileVoice = {
  id?: string;
  name: string;
};

export function VoicePreviewMobile({
  audioUrl,
  voice,
  text,
}: {
  audioUrl: string;
  voice: VoicePreviewMobileVoice | null;
  text: string;
}) {
  const isMobile = useIsMobile();
  const selectedVoiceName = voice?.name ?? null;
  const selectedVoiceSeed = voice?.id ?? null;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handleTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    audio.pause();
    audio.currentTime = 0;
    setProgress(0);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!isMobile) {
      audioRef.current?.pause();
    }
  }, [isMobile]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);

    const safeName =
      text
        .slice(0, 50)
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "speech";

    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${safeName}.wav`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsDownloading(false), 800);
  };

  if (!audioUrl) return null;

  return (
    <div className="lg:hidden border-t border-border/40 bg-card/40 p-4 backdrop-blur-xl">
      <audio ref={audioRef} src={audioUrl} />

      {/* Header */}
      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Resona Playback
        </p>
      </div>

      {/* Main row */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        {/* Metadata */}
        <div className="min-w-0 rounded-2xl border border-border/30 bg-primary/15 p-3 shadow-sm backdrop-blur-sm">
          <p className="truncate text-sm font-medium text-foreground">
            {text}
          </p>

          {selectedVoiceName && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <VoiceAvatar
                seed={selectedVoiceSeed ?? selectedVoiceName}
                name={selectedVoiceName}
                className="shrink-0"
              />
              <span className="truncate">{selectedVoiceName}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={isDownloading}
            onClick={handleDownload}
            className="
              cursor-pointer rounded-2xl border border-border/30
              bg-background/40 hover:bg-background/70
            "
          >
            <Download className="size-4" />
          </Button>

          <Button
            variant="neonAi"
            size="icon"
            className="
              h-11 w-11 cursor-pointer rounded-full
              shadow-lg transition-transform duration-200
              hover:scale-105
            "
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="size-4 fill-background" />
            ) : (
              <Play className="ml-0.5 size-4 fill-background" />
            )}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="
            h-full rounded-full
            bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))]
            transition-all duration-200
          "
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
