"use client";
// Desktop playback UI for a saved generation — audioUrl points at /api/audio/:id and WaveSurfer handles waveform + transport.

import { useState } from "react";
import { Pause, Play, Download, Redo, Undo } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import { useWaveSurfer } from "../hooks/use-wavesurfer";

type VoicePreviewPanelVoice = {
  id?: string;
  name: string;
};

function formatTime(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${secs}`;
}

export function VoicePreviewPanel({
  audioUrl,
  voice,
  text,
}: {
  audioUrl: string;
  voice: VoicePreviewPanelVoice | null;
  text: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const selectedVoiceName = voice?.name ?? null;
  const selectedVoiceSeed = voice?.id ?? null;

  const {
    containerRef,
    isPlaying,
    isReady,
    currentTime,
    duration,
    togglePlayPause,
    seekBackward,
    seekForward,
  } = useWaveSurfer({
    url: audioUrl,
    autoplay: sessionStorage.getItem("autoplay-audio") === "true",
  });

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

    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="hidden h-full flex-1 flex-col border-t border-border/40 bg-card/30 backdrop-blur-xl lg:flex">
      {/* Header */}
      <div className="border-b border-border/30 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Resona Playback
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
          Voice Preview
        </h3>
      </div>

      {/* Waveform */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-8">
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Badge
              variant="outline"
              className="
                gap-2 rounded-2xl border border-border/40
                bg-background/80 px-4 py-2
                text-sm text-muted-foreground
                shadow-xl backdrop-blur-xl
              "
            >
              <Spinner className="size-4" />
              <span>Preparing waveform...</span>
            </Badge>
          </div>
        )}

        <div
          className="
            w-full rounded-3xl border border-border/30
            bg-[radial-gradient(circle_at_center,oklch(0.97_0.01_40),transparent)]
            bg-background/40 p-5 shadow-inner
          "
        >
          <div
            ref={containerRef}
            className={cn(
              "w-full cursor-pointer transition-opacity duration-300",
              !isReady && "opacity-0", // Loading Wavesurfer, we have to mount this, otherwise Wavesurfer won't load, so we hide with opacity attribute
            )}
          />
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center justify-center px-6">
        <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {formatTime(currentTime)}
          <span className="text-muted-foreground">
            &nbsp;/ {formatTime(duration)}
          </span>
        </p>
      </div>

      {/* Footer */}
      <div className="p-6">
        <div className="grid w-full grid-cols-3 items-center gap-6">
          {" "}
          {/* Metadata */}
          <div className="min-w-0 rounded-2xl border border-border/30 bg-primary/20 p-2 shadow-sm backdrop-blur-sm ">
            <p className="line-clamp-2 truncate text-sm font-medium text-foreground">
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
          {/* Controls */}
          <div className="flex items-center justify-center gap-3 ">
            <Button
              variant="ghost"
              size="icon-lg"
              className="
                cursor-pointer rounded-2xl border bg-primary/50 border-border/30
                 hover:bg-primary/70
              "
              onClick={() => seekBackward(10)}
              disabled={!isReady}
            >
              <div className="flex flex-col items-center">
                <Undo className="size-4 -mb-1" />
                <span className="text-[10px] font-medium">10</span>
              </div>
            </Button>

            <Button
              size="icon-lg"
              variant="audioControl"
              className="
                h-16 w-16 cursor-pointer rounded-full


                hover:scale-105
              "
              onClick={togglePlayPause}
              disabled={!isReady}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-white text-white" />
              ) : (
                <Play className="size-5 fill-white text-white" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon-lg"
              className="
               cursor-pointer rounded-2xl border bg-primary/50 border-border/30
                 hover:bg-primary/70
              "
              onClick={() => seekForward(10)}
              disabled={!isReady}
            >
              <div className="flex flex-col items-center">
                <Redo className="size-4 -mb-1" />
                <span className="text-[10px] font-medium">10</span>
              </div>
            </Button>
          </div>
          {/* Download */}
          <div className="flex justify-end">
            <Button
              variant="pillGradient"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="
                cursor-pointer rounded-2xl border border-border/40
                bg-background/40 px-4 shadow-sm
                hover:bg-background/70
              "
            >
              <Download className="size-4" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
