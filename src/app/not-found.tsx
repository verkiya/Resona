// App-wide 404 boundary: rendered when no route matches, with branded recovery links.

import Link from "next/link";
import { Home, AudioLines, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-8%] top-[12%] h-80 w-80 rounded-full bg-primary/8 blur-3xl"
          style={{
            animation: "floatSlow 14s ease-in-out infinite",
          }}
        />

        <div
          className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-accent/6 blur-3xl"
          style={{
            animation: "floatSlowReverse 18s ease-in-out infinite",
          }}
        />

        <div className="absolute inset-0 opacity-[0.12]">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
          >
            <path
              d="M0,420 C120,360 240,500 360,430 C480,360 600,500 720,430 C840,360 960,500 1080,430 C1200,360 1320,500 1440,430"
              fill="none"
              stroke="oklch(0.72 0.13 25)"
              strokeWidth="2"
              className="wave-line"
            />
            <path
              d="M0,500 C140,430 280,580 420,500 C560,420 700,580 840,500 C980,420 1120,580 1260,500 C1360,450 1440,520 1440,520"
              fill="none"
              stroke="oklch(0.75 0.15 300)"
              strokeWidth="2"
              className="wave-line wave-delay"
            />
            <path
              d="M0,600 C100,540 220,680 340,600 C460,520 580,680 700,600 C820,520 940,680 1060,600 C1180,520 1300,680 1440,600"
              fill="none"
              stroke="oklch(0.72 0.13 25 / 0.7)"
              strokeWidth="1.5"
              className="wave-line wave-slow"
            />
          </svg>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,oklch(0.97_0.01_280/.35))]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-border/60 bg-card/80 p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/15 bg-[linear-gradient(135deg,oklch(0.72_0.13_25/.14),oklch(0.75_0.15_300/.12))] shadow-lg">
            <AudioLines className="h-9 w-9 text-primary" />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Error 404
          </p>

          <h1 className="bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-6xl">
            This voice vanished.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The page you’re looking for doesn’t exist, was moved, or got lost
            somewhere between inference, billing, and production deployment.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] px-6 py-3 text-sm font-medium text-white shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>

            <Link
              href="/voices"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-6 py-3 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:scale-[1.01]"
            >
              <ArrowLeft className="h-4 w-4" />
              Explore Voices
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
