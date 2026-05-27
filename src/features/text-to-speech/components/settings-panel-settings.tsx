// Sliders for temperature, topP, topK, and repetition penalty bound to the TTS form.
"use client";

import { useStore } from "@tanstack/react-form";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useTypedAppFormContext } from "@/hooks/use-app-form";

import { sliders } from "@/features/text-to-speech/data/sliders";
import { ttsFormOptions } from "@/features/text-to-speech/components/text-to-speech-form";
import { VoiceSelector } from "./voice-selector";

export function SettingsPanelSettings() {
  const form = useTypedAppFormContext(ttsFormOptions);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  return (
    <>
      {/* Voice selector */}
      <div className="border-b border-border/40 bg-background/30 p-5 backdrop-blur-sm">
        <VoiceSelector />
      </div>

      {/* Voice controls */}
      <div className="flex-1 p-5">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Voice adjustments
          </p>
        </div>

        <FieldGroup className="gap-5">
          {sliders.map((slider) => (
            <form.Field key={slider.id} name={slider.id}>
              {(field) => (
                <Field className="rounded-2xl border border-border/40 bg-card/50 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-card/70 hover:shadow-md">
                  <FieldLabel className="text-sm font-semibold tracking-tight">
                    {slider.label}
                  </FieldLabel>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
                      {slider.leftLabel}
                    </span>

                    <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
                      {slider.rightLabel}
                    </span>
                  </div>

                  <Slider
                    value={[field.state.value]}
                    onValueChange={(value) => field.handleChange(value[0])}
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    disabled={isSubmitting}
                    className=" **:data-[slot=slider-thumb]:size-4  **:data-[slot=slider-thumb]:border  **:data-[slot=slider-thumb]:border-white/50  **:data-[slot=slider-thumb]:bg-[linear-gradient(135deg,oklch(0.92_0.04_70),oklch(0.82_0.08_55))]  **:data-[slot=slider-thumb]:shadow-[0_4px_12px_oklch(0.75_0.08_50/.22)]  **:data-[slot=slider-thumb]:transition-transform  **:data-[slot=slider-thumb]:duration-200  **:data-[slot=slider-thumb]:hover:scale-110  **:data-[slot=slider-track]:h-1.5  **:data-[slot=slider-track]:bg-[oklch(0.93_0.01_70)]  **:data-[slot=slider-range]:bg-[linear-gradient(90deg,oklch(0.94_0.03_80),oklch(0.82_0.08_55))]"
                  />
                </Field>
              )}
            </form.Field>
          ))}
        </FieldGroup>
      </div>
    </>
  );
}
