// Voice Card Component.
// Renders a single voice item (System or Custom) within the catalog.
// Provides inline audio previews streamed from `/api/voices/:id`.
// Handles deletion flows for custom voices owned by the organization.
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import { Mic, MoreHorizontal, Pause, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Spinner } from "@/components/ui/spinner";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

import { VOICE_CATEGORY_LABELS } from "@/features/voices/data/voice-categories";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type VoiceItem =
  inferRouterOutputs<AppRouter>["voices"]["getAll"]["custom"][number];

interface VoiceCardProps {
  voice: VoiceItem;
}

const regionNames = new Intl.DisplayNames(["en"], {
  type: "region",
});

// Locale Normalization Utility.
// Converts diverse locale string formats ("en-US", "US") into standard ISO-3166 alpha-2 
// country codes for deterministic flag rendering. Fallback to a globe for unknown regions.
function parseLanguage(locale?: string | null) {
  if (!locale?.trim()) {
    return {
      country: null,
      region: "Unknown region",
    };
  }

  let country = "";

  // Handles:
  // en-US -> US
  // US -> US
  if (locale.includes("-")) {
    [, country] = locale.split("-");
  } else {
    country = locale;
  }

  country = country.toUpperCase();

  // Only ISO-3166 alpha-2 region codes are valid for flag rendering.
  if (country.length !== 2) {
    return {
      country: null,
      region: locale,
    };
  }

  const region = regionNames.of(country) ?? locale;

  return { country, region };
}

export function VoiceCard({ voice }: VoiceCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { country, region } = parseLanguage(voice.language);

  const audioSrc = `/api/voices/${encodeURIComponent(voice.id)}`;

  const { isPlaying, isLoading, togglePlay } = useAudioPlayback(audioSrc);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    trpc.voices.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Voice deleted successfully");

        queryClient.invalidateQueries({
          queryKey: trpc.voices.getAll.queryKey(),
        });
      },

      onError: (error) => {
        toast.error(error.message ?? "Failed to delete voice");
      },
    }),
  );

  return (
    <div
      className={cn(
        "flex items-center gap-1 overflow-hidden rounded-2xl bg-card/80 pr-3 shadow-sm transition-shadow duration-200 hover:shadow-md lg:pr-6",
        isPlaying && "border-primary/30 shadow-md shadow-primary/10",
      )}
    >
      <div className="relative h-24 w-20 shrink-0 lg:h-30 lg:w-24">
        <div className="absolute left-0 top-0 h-24 w-10 border-r bg-gradient-to-b from-primary/12 via-primary/6 to-transparent lg:h-30 lg:w-12" />

        <div className="absolute inset-0 flex items-center justify-center">
          <VoiceAvatar
            seed={voice.id}
            name={voice.name}
            className="size-14 border border-white/70 shadow-md ring-1 ring-white/40 lg:size-18"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 lg:gap-3">
        <div className="flex items-center gap-1.5 line-clamp-1 text-sm font-medium tracking-tight">
          {voice.name}

          <span className="size-1 shrink-0 rounded-full bg-muted-foreground/50" />

          <span className="text-primary/80">
            {VOICE_CATEGORY_LABELS[voice.category]}
          </span>
        </div>

        <p className="line-clamp-1 text-xs text-muted-foreground">
          {voice.description}
        </p>

        <p className="flex items-center gap-1.5 text-xs">
          {country ? (
            <ReactCountryFlag
              countryCode={country}
              svg
              style={{
                width: "1rem",
                height: "1rem",
                borderRadius: "2px",
              }}
              title={region}
            />
          ) : (
            <span className="text-sm leading-none">🌍</span>
          )}

          <span className="truncate font-medium">{region}</span>
        </p>
      </div>

      <div className="ml-1 flex shrink-0 items-center gap-1 lg:ml-3 lg:gap-2">
        <Button
          variant="default"
          size="icon-sm"
          className="cursor-pointer rounded-full shadow-sm"
          onClick={togglePlay}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className="size-4" />
          ) : isPlaying ? (
            <Pause className="size-4 fill-background" />
          ) : (
            <Play className="size-4 fill-background" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outlineAccent"
              size="icon-sm"
              className="cursor-pointer rounded-full hover:bg-muted/80 text-gray-700 focus-visible:ring-0 focus-visible:border-transparent focus:outline-none"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <DropdownMenuItem
              asChild
              className="
                cursor-pointer
                text-primary
                focus:bg-primary/10
                focus:text-primary
                data-[highlighted]:bg-primary/10
                data-[highlighted]:text-primary
              "
            >
              <Link
                href={`/text-to-speech?voiceId=${voice.id}`}
                className="flex items-center gap-2"
              >
                <Mic className="size-4 text-primary" />

                <span className="font-medium">Use this voice</span>
              </Link>
            </DropdownMenuItem>

            {voice.variant === "CUSTOM" && (
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="
                  cursor-pointer
                  text-[oklch(0.62_0.19_20)]
                  focus:bg-[oklch(0.62_0.19_20/.10)]
                  focus:text-[oklch(0.62_0.19_20)]
                  data-[highlighted]:bg-[oklch(0.62_0.19_20/.10)]
                  data-[highlighted]:text-[oklch(0.62_0.19_20)]
                "
              >
                <Trash2 className="size-4 text-[oklch(0.62_0.19_20)]" />

                <span className="font-medium">Delete voice</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {voice.variant === "CUSTOM" && (
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete voice</AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to delete &nbsp;&quot;{voice.name}
                  &quot;? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  className="cursor-pointer"
                  variant="softPrimary"
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  variant="default"
                  className="cursor-pointer"
                  disabled={deleteMutation.isPending}
                  onClick={(e) => {
                    e.preventDefault();

                    deleteMutation.mutate(
                      { id: voice.id },
                      {
                        onSuccess: () => setShowDeleteDialog(false),
                      },
                    );
                  }}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
