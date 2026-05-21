// AI explanation: Dashboard variant of the shared text prompt panel (routes into TTS with query params).
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  COST_PER_UNIT,
  TEXT_MAX_LENGTH,
} from "@/features/text-to-speech/data/constants";
export function TextInputPanel() {
  const [text, setText] = useState("");
  const router = useRouter();
  const handleGenerate = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    router.push(`/text-to-speech?text=${encodeURIComponent(trimmed)}`);
  };
  return (
    <div
      className="
rounded-[22px] bg-[linear-gradient(185deg,#6d28d9cc_10%,#a855f7cc_45%,#db2777cc_75%,#f97316cc_100%)] p-0.5 shadow-[0_0_0_4px_white]
"
    >
      {/* Using px values for border-radius to ensure proper gradient border math (outer - padding = inner). */}
      {/* Standard classes like rounded-4xl use CSS calc() which doesn't align cleanly at corners. */}
      <div className="rounded-[20px] bg-[#F9F9F9] p-1">
        <div className="space-y-2  rounded-2xl bg-card p-2 shadow-sm transition-all duration-300 hover:shadow-md">
          {" "}
          <Textarea
            placeholder="Start typing or paste your text here..."
            className="h-46 max-h-46 text-lg! overflow-y-auto leading-relaxed font-medium resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={TEXT_MAX_LENGTH}
          />
          {/* Bottom info */}
          <div className="flex items-center justify-between ">
            <Badge
              variant="outline"
              className="h-7 gap-1 px-2 border-border/60 bg-background/60"
            >
              <Coins className="size-4 text-[oklch(0.74_0.19_78)]" />{" "}
              <span className="text-xs tabular-nums">
                {text.length === 0 ? (
                  "Estimated cost appears here"
                ) : (
                  <>
                    <span className="tabular-nums text-xs">
                      ${(text.length * COST_PER_UNIT).toFixed(4)}
                    </span>{" "}
                    estimated
                  </>
                )}
              </span>
            </Badge>
            <span className="text-xs tabular-nums text-muted-foreground">
              {text.length.toLocaleString()} /{" "}
              {TEXT_MAX_LENGTH.toLocaleString()} characters
            </span>
          </div>
        </div>
        {/* Action bar */}
        <div className="flex items-center justify-center p-2 border-t border-border/50 ">
          <Button
            size="default"
            disabled={!text.trim()}
            onClick={handleGenerate}
            variant="neonAi"
            className=" cursor-[url('/resona.png')_16_16,pointer] w-full rounded-3xl"
          >
            Generate speech
          </Button>
        </div>
      </div>
    </div>
  );
}
