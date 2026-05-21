// AI explanation: Lists past generations for the org with links to detail routes.
"use client";

import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AudioLines, AudioWaveform, Clock } from "lucide-react";
import Link from "next/link";

export function SettingsPanelHistory() {
  const trpc = useTRPC();

  const { data: generations } = useSuspenseQuery(
    trpc.generations.getAll.queryOptions(),
  );

  if (!generations.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <div className="relative flex w-28 items-center justify-center">
          <div className="absolute left-1 -rotate-12 rounded-full border border-black/40! bg-card/70 p-3 shadow-sm">
            <AudioLines className="size-4 text-muted-foreground" />
          </div>

          <div className="relative z-10 rounded-full  border-transparent! bg-transparent! p-4 ">
            <AudioWaveform className="size-5 text-black/50!" />
          </div>

          <div className="absolute right-1 rotate-12 rounded-full border border-black/40! bg-card/70 p-3 shadow-sm">
            <AudioLines className="size-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-center text-base font-semibold tracking-tight text-foreground">
            No generations yet
          </p>

          <p className="max-w-60 text-center text-sm leading-relaxed text-muted-foreground">
            Your generated voices, previews, and experiments will show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3 scrollbar-premium">
      {generations.map((generation) => (
        <Link
          href={`/text-to-speech/${generation.id}`}
          key={generation.id}
          className="group flex items-start gap-3 rounded-2xl border border-border/30 bg-card/50 p-4 text-left shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-card/80 hover:shadow-md"
        >
          <VoiceAvatar
            seed={generation.voiceId ?? generation.voiceName}
            name={generation.voiceName}
            className="mt-0.5 shrink-0"
          />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="line-clamp-2 text-sm font-semibold tracking-tight text-foreground">
              {generation.text}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-medium">{generation.voiceName}</span>

              <span>&middot;</span>

              <span className="rounded-full bg-background/70 px-2 py-0.5">
                {formatDistanceToNow(new Date(generation.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
