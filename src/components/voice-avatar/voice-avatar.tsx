// Deterministic avatar image for a voice id via useVoiceAvatar (Dicebear/multiavatar).
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useVoiceAvatar } from "./use-voice-avatar";

interface VoiceAvatarProps {
  seed: string;
  name: string;
  className?: string;
}

export function VoiceAvatar({ seed, name, className }: VoiceAvatarProps) {
  const avatarUrl = useVoiceAvatar(seed); // Converts a deterministic SVG avatar into a data URI

  return (
    <Avatar
      className={cn(
        "size-8 shrink-0 rounded-full border border-white/60 bg-[linear-gradient(135deg,oklch(0.98_0.01_40),oklch(0.94_0.02_300))] shadow-sm ring-1 ring-border/30 transition-all duration-200",
        className,
      )}
    >
      <AvatarImage
        src={avatarUrl}
        alt={name}
        className="object-cover scale-[0.96]"
      />

      <AvatarFallback className="bg-transparent text-[10px] font-semibold tracking-tight text-muted-foreground">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
