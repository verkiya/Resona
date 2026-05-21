// AI explanation: Clickable sample prompts that prefill the TTS text field.
"use client";

import {
  Dumbbell,
  Skull,
  Mic2,
  Sword,
  Gem,
  MoonStar,
  FlameKindling,
  BadgeAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

const PROMPT_SUGGESTIONS: {
  label: string;
  prompt: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    label: "Villain monologue",
    prompt:
      "You came all this way thinking you were the hero. Heroes are predictable. Heroes hesitate. Heroes cling to hope even when the world is already burning. That is why you lose.",
    icon: Skull,
    color:
      "border-[oklch(0.42_0.12_310/.20)] bg-[oklch(0.42_0.12_310/.10)] text-[oklch(0.42_0.12_310)] hover:bg-[oklch(0.42_0.12_310/.16)]",
  },
  {
    label: "Podcast intro",
    prompt:
      "Welcome back to Signal and Static, the show where we break down the strange stories shaping technology, culture, and the future. Today, we uncover how one overlooked email nearly destroyed a billion dollar startup.",
    icon: Mic2,
    color:
      "border-[oklch(0.50_0.10_260/.20)] bg-[oklch(0.50_0.10_260/.10)] text-[oklch(0.50_0.10_260)] hover:bg-[oklch(0.50_0.10_260/.16)]",
  },
  {
    label: "Anime protagonist",
    prompt:
      "I have been weak before. I know exactly what that feels like. But I am done running. Even if I fail, even if I fall, I will stand up again. This time, I am not losing.",
    icon: Sword,
    color:
      "border-[oklch(0.56_0.16_295/.20)] bg-[oklch(0.56_0.16_295/.10)] text-[oklch(0.56_0.16_295)] hover:bg-[oklch(0.56_0.16_295/.16)]",
  },
  {
    label: "Luxury ad voice",
    prompt:
      "Introducing Aureline No 7. A fragrance crafted for those who leave an impression without saying a word. Smoked vanilla, saffron, and midnight cedar. This is not perfume. It is presence.",
    icon: Gem,
    color:
      "border-[oklch(0.72_0.08_85/.20)] bg-[oklch(0.72_0.08_85/.10)] text-[oklch(0.58_0.09_85)] hover:bg-[oklch(0.72_0.08_85/.16)]",
  },
  {
    label: "Guided calm",
    prompt:
      "Take a slow breath in. Hold it gently. Now release. Let your shoulders soften. Let the noise of the day dissolve. For this moment, there is nowhere to rush.",
    icon: MoonStar,
    color:
      "border-[oklch(0.62_0.08_190/.20)] bg-[oklch(0.62_0.08_190/.10)] text-[oklch(0.52_0.08_190)] hover:bg-[oklch(0.62_0.08_190/.16)]",
  },
  {
    label: "Final boss speech",
    prompt:
      "So the last of the heroes finally arrives. I watched kingdoms fall while you trained with wooden swords and false hope. Kneel, and I may grant your people mercy.",
    icon: FlameKindling,
    color:
      "border-[oklch(0.40_0.13_345/.20)] bg-[oklch(0.40_0.13_345/.10)] text-[oklch(0.40_0.13_345)] hover:bg-[oklch(0.40_0.13_345/.16)]",
  },
  {
    label: "Gym motivation",
    prompt:
      "The bar does not care how you feel today. Show up. Lift. Adapt. Discipline beats motivation every single time.",
    icon: Dumbbell,
    color:
      "border-[oklch(0.60_0.12_55/.20)] bg-[oklch(0.60_0.12_55/.10)] text-[oklch(0.54_0.12_55)] hover:bg-[oklch(0.60_0.12_55/.16)]",
  },
  {
    label: "Interrogation scene",
    prompt:
      "You said you were home at eleven. The taxi driver says midnight. So tell me something. Why were you standing beside the victim five minutes before he died?",
    icon: BadgeAlert,
    color:
      "border-[oklch(0.46_0.02_260/.20)] bg-[oklch(0.46_0.02_260/.10)] text-[oklch(0.46_0.02_260)] hover:bg-[oklch(0.46_0.02_260/.16)]",
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
            className={`
              cursor-pointer gap-1.5 rounded-md
              px-2.5 py-1 text-xs
              backdrop-blur-sm
              transition-all duration-200
              hover:scale-[1.02]
              ${suggestion.color}
            `}
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
