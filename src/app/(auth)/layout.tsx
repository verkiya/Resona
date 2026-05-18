import Link from "next/link";
import { AuthMarketing } from "./auth-marketing";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <header className="absolute top-0 right-0 z-50 p-6">
        <nav className="flex items-center gap-3">
          <Button
            asChild
            variant="softGradient"
            className="surface-hover cursor-pointer rounded-xl border bg-card px-4 py-2 text-sm font-medium shadow-sm"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="ctaGlow"
            className="rounded-xl cursor-pointer bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </nav>
      </header>

      <div className="grid h-full lg:grid-cols-2">
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
