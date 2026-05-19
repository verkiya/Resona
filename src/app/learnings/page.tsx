import Link from "next/link";
import {
  ArrowLeft,
  AudioWaveform,
  ShieldCheck,
  Database,
  CreditCard,
  HardDrive,
  Bug,
  Workflow,
  Mic2,
  Zap,
  Layers3,
  Server,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LearningsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <Button
          asChild
          variant="softGradient"
          className="mb-8 inline-flex items-center gap-2 text-sm"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
        {/* Hero */}
        <section className="mb-16">
          <h1 className="mt-6 text-5xl font-semibold tracking-tight lg:text-7xl">
            What I Learned Building Resona
          </h1>

          <p className="mt-6 max-w-5xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
            Resona is a production-oriented AI voice generation SaaS platform
            built around self-hosted text-to-speech infrastructure, custom voice
            cloning workflows, secure multi-tenant architecture, usage-based
            billing, observability, and deployment-ready engineering practices.
          </p>
        </section>

        {/* Overview */}
        <section className="mb-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            icon={<Mic2 className="h-5 w-5 text-primary" />}
            title="Voice Cloning"
            description="Reusable custom AI voices through uploaded samples or browser recording."
          />

          <FeatureCard
            icon={<Zap className="h-5 w-5 text-primary" />}
            title="Text-to-Speech"
            description="Natural speech generation with interactive playback workflows."
          />

          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5 text-primary" />}
            title="Multi-Tenant SaaS"
            description="Organization-aware authentication, routing, and isolated product workflows."
          />

          <FeatureCard
            icon={<CreditCard className="h-5 w-5 text-primary" />}
            title="Monetization"
            description="Subscriptions, metered usage, premium feature enforcement, and upgrade flows."
          />
        </section>

        {/* Project Scope */}
        <Section title="Project Scope">
          <Bullet>
            Self-hosted Chatterbox text-to-speech inference pipeline
          </Bullet>
          <Bullet>Custom voice cloning through uploaded audio samples</Bullet>
          <Bullet>Browser-based voice recording and upload workflows</Bullet>
          <Bullet>
            Interactive audio waveform playback, seeking, and downloads
          </Bullet>
          <Bullet>Voice management CRUD workflows</Bullet>
          <Bullet>Secure multi-tenant SaaS architecture</Bullet>
          <Bullet>Subscription billing and usage metering</Bullet>
          <Bullet>Production observability and deployment workflows</Bullet>
        </Section>

        {/* Architecture */}
        <Section title="Architecture Overview">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <ArchitectureCard
              icon={<Layers3 className="h-5 w-5 text-primary" />}
              title="Frontend"
              description="Next.js App Router application powering dashboards, forms, audio workflows, and responsive user interaction."
            />

            <ArchitectureCard
              icon={<Server className="h-5 w-5 text-primary" />}
              title="Application Layer"
              description="Type-safe tRPC APIs connecting frontend workflows to business logic."
            />

            <ArchitectureCard
              icon={<Database className="h-5 w-5 text-primary" />}
              title="Persistence"
              description="Prisma ORM with PostgreSQL for relational domain modeling and durable storage."
            />

            <ArchitectureCard
              icon={<HardDrive className="h-5 w-5 text-primary" />}
              title="Media Storage"
              description="Cloudflare R2 object storage with signed URL delivery for uploaded and generated audio."
            />

            <ArchitectureCard
              icon={<ShieldCheck className="h-5 w-5 text-primary" />}
              title="Identity"
              description="Clerk authentication, sessions, organizations, and middleware-driven route protection."
            />

            <ArchitectureCard
              icon={<Bug className="h-5 w-5 text-primary" />}
              title="Observability"
              description="Sentry monitoring, runtime diagnostics, logs, stack traces, and debugging context."
            />
          </div>
        </Section>

        {/* Technical Stack */}
        <Section title="Technical Stack">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <StackCard
              title="Frontend"
              items={[
                "Next.js",
                "React",
                "Tailwind CSS",
                "ShadCN UI",
                "TanStack React Form",
                "Nuqs",
                "WaveSurfer.js",
              ]}
            />

            <StackCard
              title="Backend"
              items={["tRPC", "Prisma ORM", "PostgreSQL"]}
            />

            <StackCard
              title="Storage"
              items={["Cloudflare R2", "AWS S3-compatible SDK"]}
            />

            <StackCard title="Authentication" items={["Clerk"]} />

            <StackCard title="Billing" items={["Polar SDK"]} />

            <StackCard
              title="Monitoring"
              items={["Sentry", "Structured Debugging"]}
            />
          </div>
        </Section>

        {/* Engineering Learnings */}
        <Section title="Key Engineering Learnings">
          <div className="space-y-5">
            <LearningBlock
              title="Owning the AI Pipeline Changes Product Economics"
              content="Self-hosting the text-to-speech model fundamentally changes platform economics. Instead of paying per request to a third-party API, inference ownership gives direct control over deployment, scaling, infrastructure decisions, and cost behavior."
            />

            <LearningBlock
              title="Multi-Tenancy Should Be Designed Early"
              content="Organizations, authentication boundaries, route protection, and isolated workflows are foundational architecture concerns. Retrofitting tenancy later creates complexity and product inconsistency."
            />

            <LearningBlock
              title="Type Safety Reduces Fullstack Friction"
              content="Using TypeScript, Prisma, and tRPC significantly reduces coordination overhead between frontend and backend. Shared contracts improve refactoring confidence and reduce runtime mismatch failures."
            />

            <LearningBlock
              title="Billing Is Not a UI Feature"
              content="Usage metering, subscriptions, feature gating, checkout workflows, and premium enforcement belong in system architecture, not as superficial product additions."
            />

            <LearningBlock
              title="Media Security Matters"
              content="Signed URLs provide controlled access to private generated audio instead of exposing assets publicly. This becomes critical when user-generated media is part of the product."
            />

            <LearningBlock
              title="Observability Should Exist Before Production"
              content="Monitoring, logs, stack traces, and debugging context reduce production debugging time dramatically. Waiting until incidents happen is poor engineering discipline."
            />
          </div>
        </Section>

        {/* Product Features */}
        <Section title="Product Capabilities">
          <div className="grid gap-6 md:grid-cols-2">
            <CapabilityCard
              title="Voice Management"
              points={[
                "Upload custom voice samples",
                "Record audio directly in browser",
                "Preview uploaded audio",
                "Search and browse voices",
                "Delete voice assets",
                "Reusable voice library workflows",
              ]}
            />

            <CapabilityCard
              title="Audio Experience"
              points={[
                "Waveform visualization",
                "Playback controls",
                "Seek controls",
                "Download generated outputs",
                "Responsive desktop/mobile audio UX",
              ]}
            />

            <CapabilityCard
              title="Authentication & Access"
              points={[
                "User authentication",
                "Organization membership",
                "Protected routes",
                "Organization selection workflows",
                "Secure access boundaries",
              ]}
            />

            <CapabilityCard
              title="Monetization"
              points={[
                "Usage-based billing",
                "Subscription management",
                "Premium feature enforcement",
                "Upgrade workflows",
                "Billing portal integration",
              ]}
            />
          </div>
        </Section>

        {/* Deployment */}
        <Section title="Production Readiness">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Resona was built with production deployment concerns in mind
              rather than purely demo-focused implementation.
            </p>

            <p>
              This includes CI/CD workflows, deployment automation, environment
              variable management, observability integration, consistent build
              behavior, and deployment-ready infrastructure decisions.
            </p>

            <p>
              Production readiness also means accounting for operational issues
              like database connection lifecycle management, secure media
              access, failure monitoring, and predictable infrastructure
              behavior.
            </p>
          </div>
        </Section>

        {/* DX */}
        <Section title="Developer Experience Learnings">
          <div className="space-y-5">
            <DXCard
              title="Prisma Singleton Pattern"
              description="Next.js hot reload can repeatedly recreate Prisma clients in development, causing database connection exhaustion. Global singleton reuse avoids this."
            />

            <DXCard
              title="Route Group Semantics"
              description="Next.js route groups affect layout organization, not URL structure. Misunderstanding this creates access control mistakes."
            />

            <DXCard
              title="Middleware Discipline"
              description="Authentication middleware logic must align precisely with routing structure, protected boundaries, and organization-aware workflows."
            />

            <DXCard
              title="Type-Safe Contracts"
              description="Shared API contracts improve iteration speed, autocomplete quality, and confidence during architectural refactors."
            />
          </div>
        </Section>

        {/* Closing */}
        <section className="elevated rounded-3xl border p-10 mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-semibold tracking-tight">
              Closing Thoughts
            </h2>
          </div>

          <p className="leading-relaxed text-muted-foreground text-lg">
            Resona was a practical exercise in building a modern AI SaaS product
            with production-oriented engineering decisions.
          </p>

          <p className="leading-relaxed text-muted-foreground text-lg mt-5">
            The strongest lessons came from infrastructure ownership, type-safe
            fullstack architecture, authentication boundaries, billing design,
            observability discipline, and understanding how real product systems
            differ from prototype demos.
          </p>
        </section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="mb-6 text-3xl font-semibold tracking-tight">{title}</h2>
      <div className="elevated rounded-3xl border p-8">{children}</div>
    </section>
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
    <div className="elevated rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ArchitectureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function StackCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <p key={item} className="text-sm text-muted-foreground">
            • {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function LearningBlock({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="leading-relaxed text-muted-foreground">{content}</p>
    </div>
  );
}

function CapabilityCard({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        {points.map((point) => (
          <p key={point} className="text-sm text-muted-foreground">
            • {point}
          </p>
        ))}
      </div>
    </div>
  );
}

function DXCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 leading-relaxed text-muted-foreground">• {children}</p>
  );
}
