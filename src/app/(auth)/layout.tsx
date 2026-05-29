// Authentication Layout.
// Provides the split-screen shell for all Clerk authentication routes (sign-in, sign-up).
// Keeps the marketing/branding panel persistent while nested auth flows transition.
import Link from "next/link";
import { AuthMarketing } from "./auth-marketing";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-background cursor-[url('/resona.png')_0_0,pointer]">
      <header className="absolute top-0 right-0 z-50 p-6">
        <nav className="flex items-center gap-3">
          <Button
            asChild
            variant="pillGradient"
            className="surface-hover cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium shadow-sm"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="pillGradient"
            className="rounded-xl cursor-pointer px-4 py-2 text-sm font-medium shadow-sm transition hover:opacity-90"
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </nav>
      </header>

      <div className="grid h-full lg:grid-cols-[3fr_1fr]">
        <section className="hidden h-full border-r bg-muted/30 lg:block">
          <AuthMarketing />
        </section>

        <section className="flex h-full items-center justify-center px-6">
          {children}
        </section>
      </div>
    </div>
  );
}
