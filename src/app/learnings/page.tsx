// Public learnings page: client-rendered engineering write-up with static content and local section components (whitelisted in proxy.ts).
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Database,
  CreditCard,
  HardDrive,
  Bug,
  Mic2,
  Zap,
  Server,
  Code2,
  Lock,
  Wrench,
  Layers3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LearningsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden cursor-[url('/resona.png')_0_0,pointer] bg-background pb-28 text-foreground md:pb-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top_left,oklch(0.72_0.13_25/0.14),transparent_42%),radial-gradient(circle_at_top_right,oklch(0.75_0.15_300/0.12),transparent_38%)]" />
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <section className="mb-16 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground shadow-sm backdrop-blur-sm">
            Engineering breakdown
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight lg:text-[5.5rem] lg:leading-[1.02]">
                Building
                <span className="block text-primary">Resona</span>
              </h1>

              <p className="mt-6 max-w-2xl border-l-2 border-primary/70 pl-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
                A full-stack AI voice product built to study the hard parts of
                shipping software: orchestration, tenancy, media delivery,
                billing, and the operational edges that prototypes usually skip.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <HeroStat label="Inference" value="Self-hosted" />
              <HeroStat label="Tenancy" value="Org-scoped" />
              <HeroStat label="Delivery" value="Signed URLs" />
            </div>
          </div>
        </section>

        <Block label="00" title="Why I Built This">
          <p className="text-muted-foreground leading-relaxed">
            Most AI side projects stop at a model call wrapped in a form. I
            wanted to build something that forced me to understand the pieces
            that make a product durable: identity, org boundaries, data flow,
            storage, billing, and deployment. The interesting work was never the
            prompt-to-audio path by itself, but everything around it.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Resona became a vehicle for that investigation. Voice generation was
            the domain; production engineering was the subject.
          </p>
        </Block>

        <Block label="01" title="System Architecture">
          <p className="text-muted-foreground leading-relaxed mb-8">
            The application is easiest to understand if you split it into two
            flows: the interactive dashboard and the generation pipeline. They
            share the same product boundary, but they fail and scale for very
            different reasons.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs tracking-widest uppercase text-primary mb-4">
                Web Application Flow
              </p>
              <div className="space-y-1">
                {[
                  { label: "Browser (Next.js / React)", note: "Client" },
                  { label: "Clerk Middleware", note: "Auth + org check" },
                  { label: "tRPC API Layer", note: "Type-safe RPC" },
                  { label: "Business Logic", note: "Validation + checks" },
                  { label: "Prisma ORM", note: "Relational queries" },
                  { label: "PostgreSQL", note: "Persistence" },
                ].map((step, i, arr) => (
                  <FlowStep
                    key={step.label}
                    step={step}
                    last={i === arr.length - 1}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-widest uppercase text-primary mb-4">
                Voice Generation Pipeline
              </p>
              <div className="space-y-1">
                {[
                  { label: "tRPC mutation triggered", note: "Frontend action" },
                  { label: "Billing check", note: "Usage enforced" },
                  { label: "Next.js backend", note: "Orchestration" },
                  { label: "Chatterbox API (Modal)", note: "FastAPI + TTS" },
                  { label: "AWS S3", note: "Audio stored" },
                  { label: "/api/audio proxy", note: "Org-scoped stream" },
                  { label: "WaveSurfer.js", note: "Client playback" },
                ].map((step, i, arr) => (
                  <FlowStep
                    key={step.label}
                    step={step}
                    last={i === arr.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-xs tracking-widest uppercase text-primary mb-4">
              Deployment Topology
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {[
                { service: "Frontend / API", host: "Vercel" },
                { service: "Inference", host: "Modal (FastAPI)" },
                { service: "Database", host: "PostgreSQL" },
                { service: "Object Storage", host: "AWS S3" },
                { service: "Auth", host: "Clerk" },
                { service: "Billing", host: "Polar SDK" },
                { service: "Error Monitoring", host: "Sentry" },
                { service: "CI / CD", host: "GitHub Actions" },
              ].map((t) => (
                <div key={t.service} className="rounded-lg border bg-card p-3">
                  <p className="text-[11px] text-muted-foreground mb-1">
                    {t.service}
                  </p>
                  <p className="text-sm font-semibold text-primary">{t.host}</p>
                </div>
              ))}
            </div>
          </div>
        </Block>

        <Block label="02" title="Database Schema">
          <p className="text-muted-foreground leading-relaxed mb-6">
            The schema is intentionally small and opinionated. Each entity owns
            a single concern, and organization scope is the default context
            rather than an afterthought.
          </p>
          <div className="rounded-xl border bg-card p-5 overflow-x-auto">
            <pre className="text-sm leading-relaxed text-muted-foreground whitespace-pre">{`Clerk User + Organization (auth only — not Prisma tables)

Voice (SYSTEM | CUSTOM)
 ├── orgId?           // null for SYSTEM, set for CUSTOM
 ├── objectKey?       // reference clip in S3
 └── generations[]

Generation
 ├── orgId            // tenant scope on every row
 ├── voiceId?         // SetNull if voice deleted
 ├── voiceName        // snapshot at generation time
 ├── text, objectKey? // WAV in S3 when upload completes
 └── inference params (temperature, topP, topK, …)

Billing: Polar (subscriptions + usage events at request time)`}</pre>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            The important part is the shape of the relationships: generations
            hang off voices, Clerk carries org identity, and Polar handles
            subscription state outside Postgres.
          </p>
        </Block>

        <Block label="03" title="Technical Decisions & Tradeoffs">
          <div className="space-y-6">
            <TradeoffCard
              question="Why self-host inference instead of an API?"
              answer="Third-party voice APIs charge per character or per request, which turns usage into a direct tax on growth. Self-hosting Chatterbox TTS shifts the cost model, removes quota ceilings, and lets the product own latency, scaling, and deployment behavior. The tradeoff is operational work, but that work is part of the product rather than a dependency you cannot influence."
              icon={<Zap className="h-4 w-4 text-primary" />}
            />
            <TradeoffCard
              question="Why Clerk instead of rolling auth?"
              answer="Rolling auth from scratch would mean building and maintaining the whole security surface: sessions, password flows, OAuth, org switching, and edge cases around route protection. Clerk removes that maintenance burden and gives a mature organization model that fits the product's tenancy requirements without custom security plumbing."
              icon={<Lock className="h-4 w-4 text-primary" />}
            />
            <TradeoffCard
              question="Why tRPC instead of REST?"
              answer="tRPC keeps the request and response contract in one place, so refactors surface as compiler errors instead of runtime surprises. That matters in a codebase where the frontend, API layer, and database schema evolve together. Prisma reinforces the same pattern by making the data model itself type-aware."
              icon={<Server className="h-4 w-4 text-primary" />}
            />
            <TradeoffCard
              question="Why AWS S3 for storage?"
              answer="S3 is the standard object store for voice samples and generated WAVs in this stack. The AWS SDK handles uploads and short-lived signed URLs, so buckets stay private while the app serves audio through authenticated routes."
              icon={<HardDrive className="h-4 w-4 text-primary" />}
            />
            <TradeoffCard
              question="Why Polar for billing?"
              answer="Polar gives the project metered billing without rebuilding a full payments and webhook stack from scratch. The useful part is not only checkout, but the ability to emit usage from business logic and keep subscription state in the server layer where enforcement actually matters."
              icon={<CreditCard className="h-4 w-4 text-primary" />}
            />
          </div>
        </Block>

        <Block label="04" title="Billing Architecture">
          <p className="text-muted-foreground leading-relaxed mb-6">
            Billing is a state machine, not a button. The important part is the
            order of events: verify access, attempt generation, record usage
            only after success, and expose the portal as a management surface
            rather than the source of truth.
          </p>
          <div className="space-y-1 mb-8">
            {[
              {
                label: "User triggers speech generation",
                note: "tRPC mutation",
              },
              { label: "Subscription check", note: "Polar active plan" },
              { label: "Generation proceeds", note: "Modal TTS + S3 upload" },
              { label: "Usage event emitted", note: "Polar meter updated" },
              {
                label: "UI reflects updated usage",
                note: "Transparent to user",
              },
              {
                label: "Billing portal available",
                note: "Polar-hosted management",
              },
            ].map((step, i, arr) => (
              <FlowStep
                key={step.label}
                step={step}
                last={i === arr.length - 1}
              />
            ))}
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs tracking-widest uppercase text-primary mb-3">
              Protected premium actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                "AI speech generation",
                "Custom voice creation",
                "Voice cloning uploads",
                "Org-wide shared voices",
              ].map((action) => (
                <div
                  key={action}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {action}
                </div>
              ))}
            </div>
          </div>
        </Block>

        <Block label="05" title="Security Considerations">
          <p className="text-muted-foreground leading-relaxed mb-6">
            The security model is layered, with controls split between routing,
            storage, validation, and billing enforcement. That keeps the product
            safe even when a user bypasses the normal UI flow.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Tenant Isolation",
                desc: "All tenant queries filter by ctx.orgId from Clerk. Custom voices and generations never leak across organizations.",
              },
              {
                title: "Signed URL Delivery",
                desc: "Audio assets in S3 are never publicly accessible. Signed URLs expire after a short window, preventing unauthorized hotlinking or enumeration.",
              },
              {
                title: "Middleware Route Protection",
                desc: "Clerk middleware enforces authentication and organization selection on all protected routes before any page or API handler runs.",
              },
              {
                title: "Upload Validation",
                desc: "MIME type, file size (~20MB cap), and audio duration are validated both client-side and server-side. Server validation is the authoritative check.",
              },
              {
                title: "Premium Enforcement",
                desc: "Feature gates run server-side in tRPC procedures — not just in the UI. Bypassing the frontend doesn't bypass billing enforcement.",
              },
              {
                title: "Error Monitoring",
                desc: "Sentry captures failures with org/voice/request context attached. Sensitive values are never logged — only opaque identifiers.",
              },
              {
                title: "Environment Isolation",
                desc: "All secrets are environment-scoped. No credentials are hardcoded or committed. CI/CD pipelines use encrypted secret storage.",
              },
              {
                title: "Polar at request time",
                desc: "Subscription checks call Polar during mutations (generate, create voice). Usage events are emitted after successful work, not before.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Block>

        <Block label="06" title="Multi-Tenancy in Practice">
          <p className="text-muted-foreground leading-relaxed mb-6">
            Multi-tenancy is mostly about discipline. The code has to carry the
            organization boundary everywhere, and the easiest place to lose that
            boundary is in the edge cases.
          </p>
          <div className="rounded-xl border bg-card p-5 mb-5 overflow-x-auto">
            <pre className="text-sm leading-relaxed text-muted-foreground whitespace-pre">{`// orgProcedure attaches ctx.orgId from Clerk on every tenant mutation.

const generation = await prisma.generation.findUnique({
  where: { id: input.id, orgId: ctx.orgId },
});

const voice = await prisma.voice.findUnique({
  where: {
    id: input.voiceId,
    OR: [
      { variant: "SYSTEM" },
      { variant: "CUSTOM", orgId: ctx.orgId },
    ],
  },
});`}</pre>
          </div>
          <div className="space-y-3">
            {[
              "Organization selection is enforced before page or API logic runs",
              "Session context carries orgId into every tRPC procedure",
              "Database reads are always filtered by an explicit organization boundary",
              "Org switching updates the active context instead of reusing stale state",
              "Voice and generation records are only visible inside the owning org",
            ].map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                {point}
              </div>
            ))}
          </div>
        </Block>

        <Block label="07" title="Challenges I Solved">
          <div className="space-y-6">
            <ChallengeCard
              title="Prisma connection exhaustion in development"
              description="Next.js hot reload recreates module instances on every save. Without a singleton pattern, each reload spawns a new Prisma client and a new database connection pool, which quietly exhausts local resources. The fix is to reuse the existing client from a process-level singleton whenever it already exists."
              code={`// src/lib/db.ts
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}`}
            />
            <ChallengeCard
              title="Next.js route groups and layout confusion"
              description="Route groups affect layout organization, not URL structure. Misunderstanding that distinction can accidentally attach an authenticated layout to a public route or expose a protected route in the wrong shell. The fix was to treat route groups as structure only and keep access control in middleware."
            />
            <ChallengeCard
              title="Signed URL expiry during long playback sessions"
              description="Audio signed URLs have a limited TTL for security. If a user starts playback near expiry, the URL can become invalid mid-session, which feels like a broken player. Generating fresh URLs at playback time keeps security intact without degrading the listening experience."
            />
            <ChallengeCard
              title="Browser recording compatibility"
              description="MediaRecorder behavior differs across browsers, especially around supported MIME types and blob handling. RecordRTC hides a lot of that variance, but upload handling still needs MIME normalization so the server can treat every recording consistently before it reaches storage."
            />
            <ChallengeCard
              title="Metered billing accuracy"
              description="Usage events must be emitted after successful generation, not before. If the generation fails but the meter fires, the user gets charged for nothing. Emitting the event only after the S3 upload confirmation keeps billing aligned with actual output."
            />
          </div>
        </Block>

        <Block label="08" title="Key Engineering Learnings">
          <div className="space-y-5">
            {[
              {
                title: "Owning inference changes the economics",
                body: "Self-hosting TTS removes per-request cost, eliminates vendor quota risk, and gives infrastructure-level control. The operational complexity is real, but the leverage is larger because the product owns the entire cost curve.",
              },
              {
                title: "Multi-tenancy has to be foundational",
                body: "Retrofitting tenant isolation into an existing codebase is painful. If organizations are part of the product, they need to be treated as a first-class database, routing, and middleware concern from day one.",
              },
              {
                title: "Type safety is a productivity multiplier",
                body: "tRPC + Prisma + TypeScript means a schema change propagates visibly through the entire stack at compile time. Refactors that would take days of cross-referencing become manageable because the compiler points to the breakage immediately.",
              },
              {
                title: "Billing is architecture, not UI",
                body: "Feature gates, usage metering, and subscription enforcement belong in the application layer. If they exist only in the frontend, they are not policy — they are decoration.",
              },
              {
                title: "Observability before production, not after",
                body: "Sentry was set up before the first deployment. When things broke, the stack traces, org context, and request metadata were already there, which made debugging a fast exercise instead of a forensic one.",
              },
              {
                title: "Signed URLs are the correct default for private media",
                body: "Public buckets are the wrong default for any user-generated content. Time-limited signed URLs give controlled access without the overhead of a full proxy layer or the risk of permanent public access.",
              },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-primary pl-4">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Block>

        <Block label="09" title="Performance Considerations">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                label: "Signed URL delivery",
                desc: "S3 holds private blobs; signed URLs and app proxies gate playback so the bucket never needs to be public.",
              },
              {
                label: "Loading skeletons",
                desc: "Skeleton states prevent layout shift and communicate progress during async operations instead of making the page feel frozen.",
              },
              {
                label: "React Server Components",
                desc: "Data-fetching components run server-side where possible, reducing client-side JS and avoiding extra waterfall requests.",
              },
              {
                label: "Debounced search",
                desc: "Voice search is debounced so typing does not trigger a tRPC query on every keystroke.",
              },
              {
                label: "Nuqs for URL state",
                desc: "Filter and search state lives in the URL, which keeps it bookmarkable, shareable, and cheaper than mirroring everything in component state.",
              },
              {
                label: "Streamed audio previews",
                desc: "WaveSurfer.js streams audio progressively rather than waiting for the full file to download before playback starts.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border bg-card p-4">
                <p className="text-sm font-semibold mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Block>

        <Block label="10" title="Future Improvements">
          <p className="text-muted-foreground leading-relaxed mb-6">
            These are the next real gaps to close if the product grows, not a
            generic backlog of nice-to-haves.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                item: "Background job queue for voice generation",
                reason:
                  "Moves inference out of the HTTP request lifecycle and removes timeout pressure.",
              },
              {
                item: "Redis caching for org/subscription state",
                reason:
                  "Cuts repeated lookups on authenticated requests that do the same checks over and over.",
              },
              {
                item: "Webhook retry strategy",
                reason:
                  "Prevents billing state drift when provider events arrive late or fail once.",
              },
              {
                item: "Granular RBAC within orgs",
                reason:
                  "Separates member and admin powers without widening the auth model everywhere.",
              },
              {
                item: "Usage analytics dashboards",
                reason:
                  "Gives organizations visibility into what they are consuming and when.",
              },
              {
                item: "Rate limiting per org",
                reason:
                  "Adds a safety valve against runaway usage and accidental abuse.",
              },
              {
                item: "API key system",
                reason:
                  "Would let external developers access the inference pipeline directly.",
              },
              {
                item: "Distributed inference workers",
                reason:
                  "Scale Modal/Chatterbox workers horizontally beyond a single inference container.",
              },
            ].map((f) => (
              <div key={f.item} className="rounded-xl border bg-card p-4">
                <p className="text-sm font-semibold mb-1">{f.item}</p>
                <p className="text-xs text-muted-foreground">{f.reason}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block label="11" title="Error Handling Patterns">
          <p className="text-muted-foreground leading-relaxed mb-6">
            A production product needs a coherent error strategy, not ad-hoc
            try/catch blocks scattered across the codebase. The pattern here is
            layered: tRPC procedures throw typed errors, the frontend catches
            them with consistent toast feedback, and Sentry captures everything
            with enough context to debug without reproducing.
          </p>
          <div className="space-y-6">
            <TradeoffCard
              question="Why typed tRPC errors instead of generic status codes?"
              answer="tRPC's TRPCError carries a code (UNAUTHORIZED, FORBIDDEN, NOT_FOUND, etc.) that maps directly to the business domain. The frontend can pattern-match on error codes to show contextual messages — 'upgrade your plan' vs 'voice not found' — instead of a generic 'something went wrong'. This makes error handling a product feature rather than a debug afterthought."
              icon={<Bug className="h-4 w-4 text-primary" />}
            />
            <TradeoffCard
              question="How does Sentry context get enriched?"
              answer="Every tRPC procedure runs inside middleware that attaches orgId, userId, and request metadata to the Sentry scope. When an error bubbles up, the stack trace arrives with enough context to identify the tenant, the action, and the input shape — without logging sensitive content like voice audio or billing tokens."
              icon={<Layers3 className="h-4 w-4 text-primary" />}
            />
            <TradeoffCard
              question="What about client-side error boundaries?"
              answer="React error boundaries catch rendering crashes and show a recovery UI instead of a blank screen. Combined with tRPC's onError callback and toast notifications, the user always sees feedback — whether the failure is a network timeout, a validation rejection, or an unexpected server error."
              icon={<ShieldCheck className="h-4 w-4 text-primary" />}
            />
          </div>
        </Block>

        <Block label="12" title="State Management Strategy">
          <p className="text-muted-foreground leading-relaxed mb-6">
            State management in Resona is deliberately split across three
            boundaries. Each boundary owns a specific responsibility, and mixing
            them is where most React apps accumulate unnecessary complexity.
          </p>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {[
              {
                title: "Server State",
                desc: "Owned by tRPC + React Query. Voices, generations, and subscription status are fetched, cached, and invalidated through query keys. No manual Redux-style stores.",
              },
              {
                title: "URL State",
                desc: "Owned by Nuqs. Search filters, active voice selection, and pagination live in the URL. This makes the UI bookmarkable, shareable, and free from component-level sync issues.",
              },
              {
                title: "Ephemeral UI State",
                desc: "Owned by React useState/useRef. Modal open/close, recording status, playback position — state that has no meaning outside the current session and should never be persisted.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border bg-card p-5 overflow-x-auto">
            <pre className="text-sm leading-relaxed text-muted-foreground whitespace-pre">{`// Example: URL state with Nuqs keeps filters shareable and persistent.
// No useEffect sync — the URL is the single source of truth.

const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
const [voiceType, setVoiceType] = useQueryState("type", parseAsString);

// tRPC query reads directly from URL state:
const { data } = trpc.voice.list.useQuery({
  search,
  variant: voiceType ?? undefined,
  orgId: ctx.orgId,
});`}</pre>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            The key discipline is never duplicating server state in local
            component state. If it came from a query, it stays in the query
            cache. If it belongs in the URL, Nuqs owns it.
          </p>
        </Block>

        <Block label="13" title="Inference Orchestration & Failure Recovery">
          <p className="text-muted-foreground leading-relaxed mb-6">
            The generation pipeline crosses three systems (tRPC → Modal/FastAPI
            → S3), so the orchestration has to handle partial failures at every
            boundary. The pattern is a two-phase write with rollback, plus
            fire-and-forget metering so billing telemetry never blocks the user
            response.
          </p>
          <div className="rounded-xl border bg-card p-5 mb-6 overflow-x-auto">
            <pre className="text-sm leading-relaxed text-muted-foreground whitespace-pre">{`// Simplified generation orchestration from generations.ts

// Phase 1: Create DB row (no objectKey yet)
const generation = await prisma.generation.create({
  data: { orgId, text, voiceName, voiceId, ...params },
});

try {
  // Phase 2: Upload WAV to S3, then link to DB row
  await uploadAudio({ buffer, key: objectKey });
  await prisma.generation.update({
    where: { id: generation.id },
    data: { objectKey },
  });
} catch {
  // Rollback: delete orphaned DB row so clients never see
  // a generation without audio
  await prisma.generation.delete({ where: { id: generation.id } });
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
}

// Fire-and-forget: metering cannot slow or fail the response
polar.events.ingest({ ... }).catch(() => {});`}</pre>
          </div>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            {[
              {
                title: "Two-Phase Write with Rollback",
                desc: "The DB row is created before the S3 upload. If the upload fails, the row is deleted so clients never see a generation without audio. This avoids orphaned records without requiring distributed transactions.",
              },
              {
                title: "Fire-and-Forget Metering",
                desc: "Polar usage events emit after success but are non-blocking. The .catch(() => {}) ensures billing telemetry cannot slow down or break the generation response path.",
              },
              {
                title: "Cross-Language Type Safety",
                desc: "The FastAPI inference server exposes an OpenAPI spec. A dev script (sync-api.ts) fetches it and generates TypeScript types. The client uses openapi-fetch with those types — so the Python ↔ TypeScript boundary is type-checked at compile time.",
              },
              {
                title: "Modal CloudBucketMount",
                desc: "The GPU container mounts the S3 bucket read-only at /storage. Voice reference audio is accessed as local files inside the container — no per-request S3 fetches during inference.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            The important constraint is ordering: verify subscription → generate
            audio → store in S3 → write objectKey → emit usage event. Each step
            depends on the previous one succeeding, and failure at any point
            rolls back cleanly without leaving inconsistent state.
          </p>
        </Block>

        <section className="rounded-2xl border bg-card p-8 mt-6">
          <div className="flex items-center gap-3 mb-5">
            <Code2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              Closing Thoughts
            </h2>
          </div>
          <p className="leading-relaxed text-muted-foreground mb-4">
            The hardest parts of Resona had little to do with AI itself. They
            were the same hard parts any production product faces: clear
            boundaries, reliable billing, private media handling, and making
            failures visible early enough to act on them.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Inference ownership is a meaningful architectural choice, but it is
            only one part of the system. The product becomes real when tenancy,
            billing, and observability work together without leaking complexity
            back into the user experience.
          </p>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/85 px-4 py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-7xl justify-center">
          <Button
            asChild
            variant="pillGradient"
            size="lg"
            className="shadow-xl shadow-primary/10"
          >
            <Link href="/" aria-label="Go back to home">
              <ArrowLeft className="h-4 w-4" />
              <span>Go back to home</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

// Local presentational components used only by this page.

function Block({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16 scroll-mt-24">
      <div className="mb-5 flex items-center gap-3">
        <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold tracking-[0.2em] text-primary">
          {label}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground lg:text-[2rem]">
          {title}
        </h2>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm md:p-8">
        {children}
      </div>
    </section>
  );
}

function FlowStep({
  step,
  last,
}: {
  step: { label: string; note: string };
  last: boolean;
}) {
  return (
    <div className="flex items-stretch gap-3">
      <div className="flex flex-col items-center">
        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
        {!last && <div className="mt-0.5 w-px flex-1 bg-border" />}
      </div>
      <div className="pb-3">
        <span className="text-sm font-medium text-foreground">
          {step.label}
        </span>
        <span className="ml-2 text-xs text-muted-foreground">{step.note}</span>
      </div>
    </div>
  );
}

function TradeoffCard({
  question,
  answer,
  icon,
}: {
  question: string;
  answer: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-5 transition-shadow hover:shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{icon}</div>
        <h3 className="text-sm font-semibold leading-snug text-foreground">
          {question}
        </h3>
      </div>
      <p className="pl-7 text-sm leading-relaxed text-muted-foreground">
        {answer}
      </p>
    </div>
  );
}

function ChallengeCard({
  title,
  description,
  code,
}: {
  title: string;
  description: string;
  code?: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-5 transition-shadow hover:shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Wrench className="h-4 w-4 text-primary flex-shrink-0" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {code && (
        <pre className="overflow-x-auto whitespace-pre rounded-lg border border-border/60 bg-background p-3 text-xs leading-relaxed text-muted-foreground">
          {code}
        </pre>
      )}
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
