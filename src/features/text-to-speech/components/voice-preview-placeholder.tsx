import Link from "next/link";
import { AudioLines, AudioWaveformIcon, BookOpen, Mic, MicIcon, Sparkles, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function VoicePreviewPlaceholder() {
  return (
    <div className="relative hidden h-full flex-1 flex-col items-center justify-center gap-6 lg:flex">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

      <div className="flex flex-col items-center gap-4">
        <div className="relative flex w-36 items-center justify-center">
          <div className="absolute left-1 -rotate-12 rounded-full border border-border/50 bg-card p-4 shadow-sm">
            <AudioWaveformIcon className="size-5 text-muted-foreground" />
          </div>

          <div className="relative z-10 rounded-full bg-[linear-gradient(135deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] p-5 shadow-[0_0_30px_oklch(0.75_0.15_300/.25)] transition-transform duration-500 ">
            <MicIcon className="size-5 text-white" />
          </div>

          <div className="absolute right-1 rotate-12 rounded-full border border-border/50 bg-card p-4 shadow-sm">
            <AudioWaveformIcon className="size-5 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-center text-xl font-semibold tracking-tight text-foreground">
            Your generated voice appears here
          </p>

          <p className="max-w-80 text-center text-sm leading-relaxed text-muted-foreground">
            Generate speech to preview studio-quality AI audio, download
            results, and iterate instantly.
          </p>
        </div>
      </div>


    </div>
  );
}
