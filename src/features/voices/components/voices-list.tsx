import { AudioLines, Mic } from "lucide-react";

import { VoiceCard } from "./voice-card";
import type { VoiceItem } from "./voice-card";

interface VoicesListProps {
  title: string;
  voices: VoiceItem[];
}

export function VoicesList({ title, voices }: VoicesListProps) {
  if (!voices.length) {
    return (
      <div className="space-y-5 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <Mic className="size-4 text-primary" />
          </div>

          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="text-xs text-muted-foreground">0 available voices</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />

            <div className="absolute flex items-end gap-1">
              <span className="h-5 w-1 rounded-full bg-primary/40 animate-pulse" />
              <span className="h-8 w-1 rounded-full bg-primary animate-pulse [animation-delay:120ms]" />
              <span className="h-4 w-1 rounded-full bg-primary/50 animate-pulse [animation-delay:240ms]" />
              <span className="h-7 w-1 rounded-full bg-primary/70 animate-pulse [animation-delay:360ms]" />
              <span className="h-5 w-1 rounded-full bg-primary/40 animate-pulse [animation-delay:480ms]" />
            </div>

            <div className="relative z-10 rounded-full border border-primary/20 bg-background p-4 shadow-sm">
              <Mic className="size-5 text-primary" />
            </div>
          </div>

          <div className="space-y-1 text-center">
            <p className="text-lg font-semibold tracking-tight text-foreground">
              No voices yet
            </p>

            <p className="max-w-md text-sm text-muted-foreground">
              Create or import voices and they’ll appear here for instant
              playback.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <AudioLines className="size-4 text-primary" />
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">
            {voices.length} available voice{voices.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:gap-6 lg:grid-cols-2">
        {voices.map((voice) => (
          <VoiceCard key={voice.id} voice={voice} />
        ))}
      </div>
    </div>
  );
}
