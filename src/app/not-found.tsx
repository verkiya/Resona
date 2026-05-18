import Link from "next/link";
import { Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border bg-muted shadow-sm">
          <Sparkles className="h-8 w-8" />
        </div>

        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Error 404
        </p>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          This voice got lost.
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          The page you’re looking for doesn’t exist, was moved, or never made it
          into production.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium transition hover:bg-muted"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
