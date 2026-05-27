// Single dashboard shortcut card linking into a feature route.
"use client"

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { QuickAction } from "@/features/dashboard/data/quick-actions";
import { cn } from "@/lib/utils";

type QuickActionCardProps = QuickAction;

export function QuickActionCard({
  title,
  description,
  gradient,
  href,
}: QuickActionCardProps) {
  return (
    <>
      <div className="group flex gap-3 rounded-2xl border border-border/60 bg-card/80 p-3 shadow-sm transition-all duration-300 hover:border-border hover:shadow-lg">
        <div
          className={cn(
            "relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-linear-to-br",
            gradient,
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-10 w-10 rounded-full bg-white/20 blur-lg" />

            <div className="absolute flex items-end gap-1">
              <span
                className="wave-bar h-5 w-1 rounded-full bg-white/70"
                style={{ animationDelay: "0s" }}
              />
              <span
                className="wave-bar h-8 w-1 rounded-full bg-white/90"
                style={{ animationDelay: "0.1s" }}
              />
              <span
                className="wave-bar h-4 w-1 rounded-full bg-white/70"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="wave-bar h-6 w-1 rounded-full bg-white/80"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>

          <div className="absolute inset-2 rounded-lg ring-1 ring-inset ring-white/20" />
        </div>

        <div className="flex min-w-0 flex-col justify-between py-0.5">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold tracking-tight">{title}</h3>

            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <Button variant="secondary" size="sm" className="w-fit" asChild>
            <Link href={href}>
              Use prompt
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .wave-bar {
          transform-origin: bottom;
          animation: equalizer 3.2s ease-in-out infinite;
        }

        @keyframes equalizer {
          0%,
          100% {
            transform: scaleY(0.45);
            opacity: 0.65;
          }
          50% {
            transform: scaleY(1.15);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
