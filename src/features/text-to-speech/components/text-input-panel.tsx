"use client";

import { useStore } from "@tanstack/react-form";
import { Coins } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ttsFormOptions } from "./text-to-speech-form";
import { GenerateButton } from "./generate-button";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { SettingsDrawer } from "./settings-drawer";
import { VoiceSelectorButton } from "./voice-selector-button";
import { HistoryDrawer } from "./history-drawer";
import { PromptSuggestions } from "./prompt-suggestions";
import { COST_PER_UNIT, TEXT_MAX_LENGTH } from "../data/constants";

const generateButtonClass =
  "bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] cursor-pointer text-white font-light shadow-lg hover:brightness-110 hover:shadow-xl active:scale-[0.98] cursor-pointer";

export function TextInputPanel() {
  const form = useTypedAppFormContext(ttsFormOptions);

  const text = useStore(form.store, (s) => s.values.text);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
  const isValid = useStore(form.store, (s) => s.isValid);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col   bg-card/70 backdrop-blur-lg">
      <div className="relative min-h-0 flex-1">
        <form.Field name="text">
          {(field) => (
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Start typing or paste your text"
              maxLength={TEXT_MAX_LENGTH}
              disabled={isSubmitting}
              className="absolute inset-0 resize-none border-0 bg-transparent p-5 pb-4 text-lg leading-relaxed tracking-tight font-medium shadow-none wrap-break-word placeholder:text-muted-foreground/70 placeholder:font-normal focus-visible:ring-0 lg:p-6 lg:pb-5 lg:text-xl"
            />
          )}
        </form.Field>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-card to-transparent" />{" "}
      </div>

      <div className="shrink-0 p-4 lg:p-6">
        {/* Mobile */}
        <div className="flex flex-col gap-3 lg:hidden">
          <div className="flex items-center gap-2">
            <SettingsDrawer>
              <VoiceSelectorButton />
            </SettingsDrawer>

            <HistoryDrawer />
          </div>

          <GenerateButton
            className="bg-[linear-gradient(120deg,oklch(0.85_0.08_60),oklch(0.75_0.12_300))] text-foreground border border-border shadow-sm hover:brightness-105 hover:saturate-110 hover:shadow-md active:scale-[0.99]"
            disabled={isSubmitting}
            isSubmitting={isSubmitting}
            onSubmit={() => form.handleSubmit()}
          />
        </div>

        {/* Desktop */}
        <div className="hidden transition-all duration-200 lg:block">
          {text.length > 0 ? (
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="gap-1.5 border-border/60 bg-card/80 shadow-sm"
              >
                <Coins className="size-3 text-[oklch(0.74_0.19_78)]" />

                <span className="text-xs font-medium tabular-nums">
                  <span className="tabular-nums">
                    ${(text.length * COST_PER_UNIT).toFixed(4)}
                  </span>
                  &nbsp; estimated
                </span>
              </Badge>

              <div className="flex items-center gap-4">
                <p className="text-xs tracking-tight font-medium tabular-nums">
                  {text.length.toLocaleString()}
                  <span className="text-muted-foreground">
                    &nbsp;/&nbsp;{TEXT_MAX_LENGTH.toLocaleString()} characters
                  </span>
                </p>

                <GenerateButton
                  className={generateButtonClass}
                  disabled={isSubmitting || !isValid}
                  isSubmitting={isSubmitting}
                  onSubmit={() => form.handleSubmit()}
                />
              </div>
            </div>
          ) : (
            <PromptSuggestions
              onSelect={(prompt) => form.setFieldValue("text", prompt)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
