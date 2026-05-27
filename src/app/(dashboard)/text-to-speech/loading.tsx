// TTS loading state: renders a streaming skeleton while the RSC tree and client hydration complete.
import { Skeleton } from "@/components/ui/skeleton";
import { VoicePreviewPlaceholder } from "@/features/text-to-speech/components/voice-preview-placeholder";

function TextareaWaveSkeleton() {
  const bars = [10, 22, 14, 30, 18, 26, 12, 20, 28, 16, 24];

  return (
    <div className="flex h-full flex-col rounded-xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm">
      <div className="space-y-3">
        <Skeleton className="h-4 w-2/3 bg-muted/60" />
        <Skeleton className="h-4 w-5/6 bg-muted/50" />
        <Skeleton className="h-4 w-3/4 bg-muted/40" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex items-end gap-1.5 opacity-80">
          {bars.map((height, index) => (
            <div
              key={index}
              className="w-1 rounded-full bg-primary/35 animate-[pulse_1.8s_ease-in-out_infinite]"
              style={{
                height: `${height}px`,
                animationDelay: `${index * 100}ms`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-4/5 bg-muted/40" />
        <Skeleton className="h-4 w-2/3 bg-muted/30" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 p-4 lg:p-6">
            <TextareaWaveSkeleton />
          </div>

          <div className="shrink-0 p-4 lg:p-6">
            <div className="flex flex-col gap-3 lg:hidden">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 flex-1 rounded-lg bg-muted/60" />
                <Skeleton className="h-9 w-9 rounded-lg bg-muted/60" />
              </div>

              <Skeleton className="h-9 w-full rounded-lg bg-muted/60" />
            </div>

            <div className="hidden items-center justify-between gap-4 lg:flex">
              <Skeleton className="h-6 w-40 rounded-full bg-muted/60" />

              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-48 bg-muted/60" />
                <Skeleton className="h-9 w-32 rounded-lg bg-muted/60" />
              </div>
            </div>
          </div>
        </div>

        <VoicePreviewPlaceholder />
      </div>

      <div className="hidden w-105 min-h-0 flex-col border-l lg:flex">
        <div className="grid h-12 grid-cols-2 border-b">
          <div className="flex items-center justify-center border-r px-4">
            <Skeleton className="h-4 w-20 bg-muted/60" />
          </div>

          <div className="flex items-center justify-center px-4">
            <Skeleton className="h-4 w-20 bg-muted/60" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <div className="space-y-3 border-b border-dashed pb-4">
              <Skeleton className="h-4 w-24 bg-muted/60" />
              <Skeleton className="h-10 w-full rounded-lg bg-muted/60" />
            </div>

            <div className="space-y-6">
              {["Temperature", "Top P", "Top K", "Repetition"].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-4 w-28 bg-muted/60" />
                  <Skeleton className="h-4 w-full rounded-full bg-muted/60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
