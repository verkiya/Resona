"use client";

import { useStore } from "@tanstack/react-form";

import { VOICE_CATEGORY_LABELS } from "@/features/voices/data/voice-categories";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";

import { useTTSVoices } from "../contexts/tts-voices-context";
import { ttsFormOptions } from "./text-to-speech-form";

const selectLabelClass =
  "px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/70";

const selectItemClass =
  "cursor-pointer rounded-xl py-2.5 data-[highlighted]:bg-primary/20 data-[highlighted]:text-foreground";

export function VoiceSelector() {
  const { customVoices, systemVoices, allVoices: voices } = useTTSVoices();

  const form = useTypedAppFormContext(ttsFormOptions);
  const voiceId = useStore(form.store, (s) => s.values.voiceId);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  const selectedVoice = voices.find((v) => v.id === voiceId);
  const hasMissingSelectedVoice = Boolean(voiceId) && !selectedVoice;

  const currentVoice = selectedVoice
    ? selectedVoice
    : hasMissingSelectedVoice
      ? {
          id: voiceId,
          name: "Voice Unavailable",
          category: null as null,
        }
      : voices[0];

  return (
    <Field>
      <FieldLabel className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Voice style
      </FieldLabel>

      <Select
        value={voiceId}
        onValueChange={(v) => form.setFieldValue("voiceId", v)}
        disabled={isSubmitting}
      >
        <SelectTrigger className="!h-16 w-full cursor-pointer rounded-xl bg-primary/20 px-3 shadow-sm transition-all duration-200 hover:bg-primary/30">
          <SelectValue>
            {currentVoice && (
              <div className="flex min-w-0 items-center gap-3">
                <VoiceAvatar
                  seed={currentVoice.id}
                  name={currentVoice.name}
                  className="size-9"
                />

                <div className="min-w-0 flex flex-col text-left">
                  <span className="truncate text-sm font-semibold tracking-tight">
                    {currentVoice.name}
                  </span>

                  {currentVoice.category && (
                    <span className="truncate text-xs text-muted-foreground">
                      {VOICE_CATEGORY_LABELS[currentVoice.category]}
                    </span>
                  )}
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="rounded-2xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150">
          {hasMissingSelectedVoice && currentVoice && (
            <>
              <SelectGroup>
                <SelectLabel className={selectLabelClass}>
                  Selected Voice
                </SelectLabel>

                <SelectItem
                  className={selectItemClass}
                  value={currentVoice.id}
                >
                  <VoiceAvatar
                    seed={currentVoice.id}
                    name={currentVoice.name}
                  />

                  <span className="truncate text-sm font-medium">
                    {currentVoice.name}
                    {currentVoice.category &&
                      ` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`}
                  </span>
                </SelectItem>
              </SelectGroup>

              {(customVoices.length > 0 || systemVoices.length > 0) && (
                <SelectSeparator className="my-2 bg-border/50" />
              )}
            </>
          )}

          {customVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel className={selectLabelClass}>
                Team Voices
              </SelectLabel>

              {customVoices.map((v) => (
                <SelectItem
                  className={selectItemClass}
                  key={v.id}
                  value={v.id}
                >
                  <VoiceAvatar seed={v.id} name={v.name} />

                  <span className="truncate text-sm font-medium">
                    {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}

          {customVoices.length > 0 && systemVoices.length > 0 && (
            <SelectSeparator className="my-2 bg-border/50" />
          )}

          {systemVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel className={selectLabelClass}>
                Resona Voices
              </SelectLabel>

              {systemVoices.map((v) => (
                <SelectItem
                  className={selectItemClass}
                  key={v.id}
                  value={v.id}
                >
                  <VoiceAvatar seed={v.id} name={v.name} />

                  <span className="truncate text-sm font-medium">
                    {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </Field>
  );
}
