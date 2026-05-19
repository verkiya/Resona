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
          <div className="elevated flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border">
            <Image
              src="/resona.svg"
              alt="Resona"
              width={28}
              height={28}
              priority
            />
          </div>

          <div>
            <p className="text-xl font-semibold tracking-tight">Resona</p>
            <p className="text-sm text-muted-foreground">
              AI Voice Generation SaaS
            </p>
          </div>
        </div>

        <Link
          href="https://github.com/verkiya/Resona"
          target="_blank"
          rel="noopener noreferrer"
          className="group cursor-[url('/resona.png')_0_0,pointer] elevated flex items-center gap-2 rounded-2xl border px-4 py-2 transition hover:scale-105"
        >
          <FaGithub className="h-5 w-5 transition-all duration-500 ease-out group-hover:rotate-[18deg] group-hover:scale-110 group-hover:text-primary" />
          <span className="text-sm font-medium">Source Code</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-xl">


        <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
          Build, clone, and generate AI voices at scale.
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground xl:text-lg">
          Resona is a full-stack AI voice generation platform with secure
          authentication, team workspaces, text-to-speech generation, voice
          cloning workflows, and scalable SaaS billing infrastructure.
        </p>
      </div>

      {/* Features */}
      <div className="mt-8 grid flex-1 gap-4 sm:grid-cols-2">
        <FeatureCard
          icon={<Mic2 className="h-5 w-5 text-primary" />}
          title="Voice Cloning"
          description="Upload recordings and create reusable custom AI voices."
        />

        <FeatureCard
          icon={<Zap className="h-5 w-5 text-primary" />}
          title="Text-to-Speech"
          description="Generate natural speech instantly with playback support."
        />

        <FeatureCard
          icon={<ShieldCheck className="h-5 w-5 text-primary" />}
          title="Multi-Tenant SaaS"
          description="Secure organization workspaces with role-based access."
        />

        <FeatureCard
          icon={<AudioWaveform className="h-5 w-5 text-primary" />}
          title="Usage Billing"
          description="Built for subscriptions, quotas, and scalable monetization."
        />
      </div>
      <Button
        asChild
        variant="ctaGlow"
        className="absolute bottom-4 left-1/2 flex mt-4 -translate-x-1/2 items-center gap-2 rounded-2xl border bg-primary px-5 py-3 text-sm font-medium shadow-lg transition hover:-translate-x-1/2 hover:scale-105 hover:text-muted"
      >
        <Link href="/learnings">
          <BookOpen className="h-4 w-4 text-muted" />
          What I Learned Building Resona
        </Link>
      </Button>
      {/* Footer */}
      <div className="mt-6 border-t pt-5">
        <p className="text-sm text-muted-foreground">
          Built with Next.js, Clerk, tRPC, Prisma, PostgreSQL, and modern AI
          infrastructure.
        </p>
      </div>
    </div>
  );
}

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
