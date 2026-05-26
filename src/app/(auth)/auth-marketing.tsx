// AI explanation: Marketing copy and visuals beside Clerk auth forms.

import Image from "next/image";
import Link from "next/link";
import { AudioWaveform, BookOpen, Mic2, ShieldCheck, Zap } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function AuthMarketing() {
  return (
    <div className="flex h-full flex-col overflow-hidden px-10 py-8 lg:px-14">
      {/* Brand */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="elevated cursor-pointer flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border">
            <Link href="/" >

              <Image
                src="/resona.svg"
                alt="Resona"
                width={28}
                height={28}
                priority
              />
            </Link>
          </div>
          <div>
            <p className="text-xl font-semibold tracking-tight">Resona</p>
            <p className="text-sm text-muted-foreground">
              Production Voice AI Platform
            </p>
          </div>
        </div>

        <Link
          href="https://github.com/verkiya/Resona"
          target="_blank"
          rel="noopener noreferrer"
          className="group cursor-pointer! elevated flex items-center gap-2 rounded-2xl border px-4 py-2 transition hover:scale-105"
        >
          <FaGithub className="h-5 w-5 transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-primary" />
          <span className="text-sm font-medium">Source Code</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-xl">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
          Build, clone, and generate AI voices at scale.
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground xl:text-lg">
          Create custom AI voices, generate realistic speech, and manage
          everything inside secure team workspaces built for modern voice
          products.
        </p>
      </div>

      {/* Features */}
      <div className="mt-8 grid flex-1 gap-4 sm:grid-cols-2">
        <FeatureCard
          icon={<Mic2 className="h-5 w-5 text-primary" />}
          title="Voice Cloning"
          description="Create reusable AI voices from uploaded recordings."
        />

        <FeatureCard
          icon={<Zap className="h-5 w-5 text-primary" />}
          title="Text-to-Speech"
          description="Generate realistic speech instantly with live playback."
        />

        <FeatureCard
          icon={<ShieldCheck className="h-5 w-5 text-primary" />}
          title="Team Workspaces"
          description="Secure organization-based access with tenant isolation."
        />

        <FeatureCard
          icon={<AudioWaveform className="h-5 w-5 text-primary" />}
          title="Usage Billing"
          description="Metered subscriptions built for scalable monetization."
        />
      </div>

      <Button
        asChild
        variant="shimmerCta"
        className="absolute bottom-4 left-1/2 mt-4 flex -translate-x-1/2 items-center gap-2 rounded-2xl border bg-primary px-5 py-3 text-sm font-medium shadow-lg transition hover:-translate-x-1/2 hover:scale-105 hover:text-muted"
      >
        <Link href="/learnings">
          <BookOpen className="h-4 w-4 text-muted" />
          What I Learned Building Resona
        </Link>
      </Button>

      {/* Footer */}
      <div className="mt-6 border-t border-border/60 pt-5">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Built with
          </p>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="flex min-h-16 items-center justify-between rounded-2xl border border-border/60 px-4 py-3 shadow-sm transition-transform hover:-translate-y-0.5"
                style={{ background: tech.background }}
              >
                <div>
                  <p className="text-sm font-semibold tracking-tight text-foreground">
                    {tech.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{tech.label}</p>
                </div>
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: tech.accent }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Built for creators, teams, and production-grade AI voice workflows.
          </p>
        </div>
      </div>
    </div>
  );
}

const TECH_STACK = [
  {
    name: "Next.js",
    label: "App Router frontend",
    background:
      "linear-gradient(135deg, oklch(0.98 0.004 270), oklch(0.95 0.006 270))",
    accent: "oklch(0.2 0.01 270)",
  },
  {
    name: "TypeScript",
    label: "Type-safe application code",
    background:
      "linear-gradient(135deg, oklch(0.975 0.02 250), oklch(0.94 0.026 250))",
    accent: "oklch(0.56 0.14 250)",
  },
  {
    name: "Clerk",
    label: "Authentication and orgs",
    background:
      "linear-gradient(135deg, oklch(0.975 0.02 300), oklch(0.94 0.028 300))",
    accent: "oklch(0.7 0.14 300)",
  },
  {
    name: "Polar",
    label: "Subscriptions and metering",
    background:
      "linear-gradient(135deg, oklch(0.98 0.02 36), oklch(0.95 0.03 36))",
    accent: "oklch(0.72 0.12 28)",
  },
  {
    name: "tRPC",
    label: "Shared server/client contracts",
    background:
      "linear-gradient(135deg, oklch(0.975 0.015 225), oklch(0.94 0.02 225))",
    accent: "oklch(0.62 0.1 225)",
  },
  {
    name: "Prisma",
    label: "Database access layer",
    background:
      "linear-gradient(135deg, oklch(0.975 0.014 295), oklch(0.945 0.02 295))",
    accent: "oklch(0.58 0.08 295)",
  },
  {
    name: "PostgreSQL",
    label: "Relational persistence",
    background:
      "linear-gradient(135deg, oklch(0.975 0.015 255), oklch(0.94 0.02 255))",
    accent: "oklch(0.52 0.1 255)",
  },
  {
    name: "AWS S3",
    label: "Private audio storage",
    background:
      "linear-gradient(135deg, oklch(0.978 0.018 78), oklch(0.945 0.028 78))",
    accent: "oklch(0.72 0.12 78)",
  },
];

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="elevated flex min-h-[140px] flex-col rounded-2xl border p-4 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
        {icon}
      </div>

      <h3 className="text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
