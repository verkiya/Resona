"use client";

import {
  Dumbbell,
  HeartPulse,
  Utensils,
  Flame,
  Zap,
  Clapperboard,
  Gamepad2,
  Brain,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

const PROMPT_SUGGESTIONS: {
  label: string;
  prompt: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Gym motivation speech",
    prompt:
      "You don’t need motivation. You need discipline. The bar doesn’t care how you feel today. Show up, lift heavy, and prove to yourself that you’re not the same person you were yesterday. One more rep. Then another.",
    icon: Dumbbell,
  },
  {
    label: "Fat loss reality check",
    prompt:
      "You can’t outrun a bad diet. Fat loss isn’t magic — it’s consistency. Fewer excuses, more steps, better food choices. The mirror reflects habits, not wishes. Fix the habits.",
    icon: Flame,
  },
  {
    label: "Nutrition advice (real talk)",
    prompt:
      "Protein is non-negotiable. Eat whole foods, stop fearing carbs, and stop overeating junk disguised as convenience. Your body isn’t confused — your choices are.",
    icon: Utensils,
  },
  {
    label: "Athlete mindset",
    prompt:
      "Every training session is a vote for the person you’re becoming. You either build resilience, or you reinforce weakness. There is no neutral.",
    icon: Zap,
  },
  {
    label: "Anime protagonist speech",
    prompt:
      "I’ve been weak before… I know what that feels like. But I’m done running. Even if I fail, even if I fall, I’ll stand up again. This time, I’m not losing.",
    icon: Gamepad2,
  },
  {
    label: "Movie-style monologue",
    prompt:
      "You think this is about winning? No. It’s about proving that when everything falls apart, I’m still standing. That’s what scares you.",
    icon: Clapperboard,
  },
  {
    label: "Mental clarity / focus",
    prompt:
      "Silence the noise. The world is loud, but your path isn’t. Focus on what matters. Cut distractions. Build something real.",
    icon: Brain,
  },
  {
    label: "Recovery & longevity",
    prompt:
      "Progress isn’t just training hard — it’s recovering smart. Sleep deeper, move better, and respect your body enough to let it rebuild stronger.",
    icon: HeartPulse,
  },
];

export function PromptSuggestions({
  onSelect,
}: {
  onSelect: (prompt: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-sm text-muted-foreground">Try something real</p>
      <div className="flex flex-wrap gap-2">
        {PROMPT_SUGGESTIONS.map((suggestion) => (
          <Badge
            key={suggestion.label}
            variant="outline"
            className="cursor-pointer gap-1.5 py-1 px-2.5 text-xs hover:bg-accent rounded-md"
            onClick={() => onSelect(suggestion.prompt)}
          >
            <suggestion.icon className="size-3.5 shrink-0" />
            {suggestion.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
