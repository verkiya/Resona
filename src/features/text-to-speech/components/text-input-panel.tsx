"use client";
import { useState } from "react";
import { COST_PER_UNIT, TEXT_MAX_LENGTH } from "../data/constants";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";
import { useStore } from "@tanstack/react-form";
import { ttsFormOptions } from "./text-to-speech-form";
import { GenerateButton } from "./generate-button";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
export function TextInputPanel() {
  const form = useTypedAppFormContext(ttsFormOptions);
  const text = useStore(form.store, (s) => s.values.text);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
  const isValid = useStore(form.store, (s) => s.isValid);
  return (
    <div className="flex h-full min-h-0 flex-col flex-1">
      <div className="relative min-h-0 flex-1">
        <form.Field name="text">
          {(field) => (
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Start typing or paste your text"
              maxLength={TEXT_MAX_LENGTH}
              disabled={isSubmitting}
              className="absolute inset-0 resize-none border-0 bg-transparent p-4 pb-6 lg:p-6 lg:pb-8 text-base! leading-relaxed tracking-tight shadow-none wrap-break-word focus-visible:ring-0"
            />
          )}
        </form.Field>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background to-transparent" />
      </div>
      <div className="shrink-0 p-4 lg:p-6">
        <div className="flex flex-col lg:hidden gap-3">
          <GenerateButton
            className="bg-[linear-gradient(120deg,oklch(0.85_0.08_60),oklch(0.75_0.12_300))] text-foreground border border-border shadow-sm hover:brightness-105 hover:saturate-110 hover:shadow-md active:scale-[0.99]"
            disabled={isSubmitting}
            isSubmitting={isSubmitting}
            onSubmit={() => form.handleSubmit()}
          />
        </div>
        {text.length > 0 ? (
          <div className="hidden items-center justify-between lg:flex">
            <Badge variant="outline" className="gap-1.5 border-dashed">
              <Coins className="size-3 text-chart-5 text-amber-600" />
              <span className="text-xs">
                <span className="tabular-nums">
                  ${(text.length * COST_PER_UNIT).toFixed(4)}
                </span>
                &nbsp; estimated
              </span>
            </Badge>
            <div className="flex items-center gap-3">
              <p className="text-xs tracking-tight">
                {text.length.toLocaleString()}
                <span className="text-muted-foreground">
                  &nbsp;/&nbsp;{TEXT_MAX_LENGTH.toLocaleString()} characters
                </span>
              </p>
              <GenerateButton
                className=" bg-[linear-gradient(120deg,oklch(0.85_0.08_60),oklch(0.75_0.12_300))] text-foreground border border-border shadow-sm hover:brightness-105 hover:saturate-110 hover:shadow-md active:scale-[0.99]"
                disabled={isSubmitting || !isValid}
                isSubmitting={isSubmitting}
                onSubmit={() => form.handleSubmit()}
              />
            </div>
          </div>
        ) : (
          <div className="hidden lg:block">
            <p className="text-sm text-muted-foreground">
              Type to get started or paste text...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
