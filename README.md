<div align="center">

# 🎙️ Resona

### AI Voice Generation SaaS Platform

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)](https://sentry.io/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

<br/>

</div>

---

## 🌟 Overview

Full-stack AI voice generation platform with self-hosted inference, multi-tenant organization workspaces, metered subscription billing, and private media delivery.

| Capability | Description |
|:---|:---|
| 🎤 **Speech Generation** | Text-to-speech via self-hosted Chatterbox TTS on Modal |
| 🧬 **Voice Cloning** | Upload or record custom voices, scoped per organization |
| 🏢 **Multi-Tenancy** | Org-isolated workspaces with Clerk-backed Next.js Proxy enforcement |
| 💳 **Metered Billing** | Polar SDK subscriptions with post-success usage event emission |
| ☁️ **Secure Storage** | Private S3 buckets, opaque object keys, and authenticated app proxies |
| 🔭 **Observability** | Sentry error tracking with structured logs on critical paths |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          🌐 WEB APPLICATION FLOW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   Browser (Next.js / React)                                               │
│       │                                                                   │
│       ▼                                                                   │
│   🔐 Clerk Proxy ──── Auth + org check                                    │
│       │                                                                   │
│       ▼                                                                   │
│   ⚡ tRPC API Layer ──── Type-safe RPC                                    │
│       │                                                                   │
│       ▼                                                                   │
│   🧠 Business Logic ──── Validation + billing checks                     │
│       │                                                                   │
│       ▼                                                                   │
│   🗄️ Prisma ORM ──── Relational queries                                  │
│       │                                                                   │
│       ▼                                                                   │
│   🐘 PostgreSQL ──── Persistence                                         │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                     🎙️ VOICE GENERATION PIPELINE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   tRPC mutation ──── Frontend action                                      │
│       │                                                                   │
│       ▼                                                                   │
│   💳 Polar billing check ──── Active subscription verified                │
│       │                                                                   │
│       ▼                                                                   │
│   🖥️ Next.js backend ──── Orchestration                                   │
│       │                                                                   │
│       ▼                                                                   │
│   🤖 Chatterbox API (Modal) ──── FastAPI + GPU inference                  │
│       │                                                                   │
│       ▼                                                                   │
│   ☁️ AWS S3 ──── WAV stored, signed URL generated                        │
│       │                                                                   │
│       ▼                                                                   │
│   🔊 /api/audio proxy ──── Org-scoped stream to client                   │
│       │                                                                   │
│       ▼                                                                   │
│   🎵 WaveSurfer.js ──── Waveform playback + scrubbing                    │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 🌍 Deployment Topology

| Service | Host |
|:---|:---|
| 🖥️ Frontend / API | **Vercel** — Next.js app, API routes, tRPC |
| 🤖 Inference | **Modal** — Chatterbox TTS (FastAPI, GPU) |
| 🐘 Database | **PostgreSQL** |
| ☁️ Object Storage | **AWS S3** — signed URLs, app-proxied delivery |
| 🔐 Auth | **Clerk** — users, organizations, sessions |
| 💳 Billing | **Polar SDK** — subscriptions, metered usage |
| 🔭 Monitoring | **Sentry** — errors, session replay |

### 🧱 Architectural Boundaries

| Boundary | Responsibility |
|:---|:---|
| Frontend | Next.js App Router pages, React Server Components where possible, client components for waveform, recording, forms, and dashboard interactions |
| API Layer | tRPC routers for product mutations/queries; route handlers for binary upload and audio streaming |
| Auth Layer | Clerk sessions and organizations; Proxy guards page routes while API/tRPC handlers enforce auth again server-side |
| Data Layer | Prisma models for voices and generations only; Clerk and Polar remain external systems of record |
| Billing Layer | Polar checkout, portal sessions, subscription checks, and post-success usage events keyed by Clerk org ID |
| Storage Layer | AWS S3 stores system voices, custom voice references, and generated WAVs behind application-controlled access |
| Inference Layer | Modal-hosted FastAPI service wraps Chatterbox TTS and reads voice reference audio from the S3 bucket mount |
| Observability | Sentry captures errors and request context on critical API/tRPC paths |

---

## 🎙️ Voice Generation & Audio

Self-hosted Chatterbox TTS inference running on Modal (FastAPI + GPU). No third-party voice API dependency.

- Self-hosted inference shifts generation cost and reliability concerns into owned infrastructure
- Real-time text-to-speech with configurable parameters (temperature, topP, topK)
- WaveSurfer.js waveform rendering with scrubbing, seeking, and progressive streaming
- Desktop + mobile audio players with download support
- Signed URL delivery — S3 buckets stay private, browsers never see raw object keys

### Generation Flow

1. The dashboard submits text, voice ID, and inference parameters through `generations.create`.
2. The tRPC procedure verifies an active Polar subscription for the current Clerk organization.
3. The selected voice must be either a global `SYSTEM` voice or a `CUSTOM` voice owned by the same organization.
4. The Next.js API calls the Modal/FastAPI Chatterbox endpoint and receives WAV bytes.
5. A `Generation` row is created, the WAV is uploaded to S3, and the row is updated with the S3 object key.
6. If storage or the final DB update fails, the newly created row is deleted so the UI does not show broken audio.
7. Polar usage is emitted only after successful storage using event `tts_generation` with metadata `{ characters }`.
8. Playback goes through `/api/audio/:generationId`, which re-checks organization ownership before streaming audio.

---

## 🧬 Custom Voice Cloning

Org-scoped custom voice creation with upload and in-browser recording.

| Workflow | Details |
|:---|:---|
| 📤 Upload | MIME type + duration + file-size (~20MB) validation, client + server |
| 🎙️ Record | In-browser via RecordRTC with preview before upload |
| 🎨 Avatars | Auto-generated via DiceBear |
| 🔍 Search | Debounced queries with Nuqs URL state |
| 🗑️ Delete | Cascade-safe — `SetNull` on generation foreign keys |

### Voice Cloning Flow

1. The client uploads raw audio bytes to `/api/voices/create` with validated metadata in query params.
2. The route checks Clerk auth, active organization, and Polar subscription before reading the body.
3. The server validates file presence, size, content type, parseable audio metadata, and minimum duration.
4. A `CUSTOM` voice row is created without an object key, then the audio is uploaded to S3.
5. The row is updated with `voices/orgs/:orgId/:voiceId`; failures roll back the initial DB insert.
6. Polar usage is emitted only after durable storage using event `voice_creation`.
7. Previews go through `/api/voices/:voiceId`; `SYSTEM` voices are globally readable after auth, while `CUSTOM` voices require org ownership.

---

## 🏢 Multi-Tenant Architecture

Organization isolation is enforced at the database, routing, and Proxy/procedure layers.

- Clerk-backed Proxy enforces auth + org selection for protected page routes
- API routes and tRPC procedures enforce their own server-side guards
- Every tRPC procedure receives `ctx.orgId` — all queries filter by it
- Org switching updates session context; no stale state reuse
- Voices and generations are only visible inside the owning organization

```typescript
// orgProcedure attaches ctx.orgId from Clerk on every tenant mutation.
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
});
```

---

## 💳 Billing Architecture

Polar SDK handles subscriptions and metered usage. Billing enforcement is server-side in tRPC procedures — not frontend-only.

```
User triggers generation ──► Subscription check (Polar)
      │                              │
      │                     ❌ No plan → Upgrade prompt
      │                     ✅ Active → Proceed
      │                              │
      ▼                              ▼
Generation executes ◄──────── Modal TTS + S3 upload
      │
      ▼
Usage event emitted ──► Polar meter updated (only after success)
```

**Protected premium actions:** AI speech generation, custom voice creation, voice cloning uploads, org-wide voice sharing — all gated server-side.

Usage events emit **after** S3 upload confirmation, not before. Failed generations never increment the meter.

### Polar Contract

Polar uses the Clerk organization ID as `externalCustomerId`. That is the multi-tenant billing boundary: subscriptions, portal sessions, and usage events all attach to the organization rather than an individual user.

Configured billing behavior depends on Polar dashboard state plus the event names emitted by code:

| Product Surface | Code Event | Meter Semantics |
|:---|:---|:---|
| Text-to-speech | `tts_generation` | Sum metadata property `characters` |
| Custom voice creation | `voice_creation` | Count successful events |

`billing.getStatus` reads Polar customer state at request time and sums active subscription meter amounts for the dashboard estimate. There is no local subscription cache or webhook mirror in Postgres.

---

## 🗄️ Database Schema

Intentionally small. Each entity owns a single concern, org scope is the default.

```
Clerk User + Organization (auth only — not Prisma tables)

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

Billing: Polar (subscriptions + usage events at request time)
```

Generations reference voices. Clerk carries org identity. Polar handles subscription state outside Postgres.

---

## 🛡️ Security Model

Layered controls across routing, storage, validation, and billing enforcement.

| Layer | Mechanism |
|:---|:---|
| 🏢 **Tenant Isolation** | All queries filter by `ctx.orgId`. No cross-org data leakage. |
| 🔐 **Signed URLs** | Private S3 buckets. Time-limited URLs expire after a short window. |
| 🚧 **Route Protection** | Clerk-backed Proxy guards pages; API/tRPC handlers validate auth server-side. |
| 📏 **Upload Validation** | MIME type, file size (~20MB), audio duration — server is authoritative. |
| 💳 **Premium Enforcement** | tRPC procedures enforce billing. Bypassing UI doesn't bypass policy. |
| 🔭 **Error Monitoring** | Sentry captures errors and structured logs from critical request paths. |
| 🔑 **Secrets** | Environment-scoped and validated at startup. No hardcoded credentials. |

---

## 🖥️ Frontend Stack

| Technology | Purpose |
|:---|:---|
| ⚡ **Next.js 16** | App Router, React Server Components |
| ⚛️ **React 19** | UI components |
| 🎨 **Tailwind CSS v4** | Utility-first styling |
| 🧩 **ShadCN UI** | Accessible component primitives |
| 📝 **TanStack React Form** | Type-safe form management |
| 🔗 **Nuqs** | URL state management |
| 🌊 **WaveSurfer.js** | Audio waveform rendering + playback |
| 🎙️ **RecordRTC** | Cross-browser audio recording |
| 📂 **React Dropzone** | File upload interactions |
| 🎨 **DiceBear** | Auto-generated voice avatars |

---

## ⚙️ Backend Stack

| Technology | Purpose |
|:---|:---|
| ⚡ **tRPC** | End-to-end type-safe API |
| 🗄️ **Prisma ORM** | Schema-driven database access |
| 🐘 **PostgreSQL** | Relational persistence |
| 📋 **OpenAPI TS** | Generated client types for inference API |
| 🐍 **FastAPI** | Chatterbox TTS inference on Modal |

### 🧠 Type Safety Pipeline

```
Prisma Schema  ──►  Generated Types  ──►  tRPC Procedures  ──►  React Hooks
      │                    │                     │                     │
      └────────── Compile-time safety across the entire stack ────────┘
```

---

## ☁️ Storage

| Aspect | Implementation |
|:---|:---|
| 📦 **Provider** | AWS S3 via `@aws-sdk/client-s3` |
| 🔐 **Access** | Private buckets + time-limited signed URLs |
| 🔀 **Delivery** | App proxies (`/api/audio/:id`, `/api/voices/:id`) — browsers never see raw keys |
| 📂 **Content** | System voice samples, custom voice references, generated WAVs |
| 🧭 **Key Shape** | `voices/system/:id.wav`, `voices/orgs/:orgId/:voiceId`, `generations/orgs/:orgId/:generationId` |

The Next.js app owns writes to S3. Modal mounts the same bucket read-only at `/storage`, so inference can resolve `voice_key` values as local files without receiving S3 credentials from each request.

Deletes are best-effort after the database record is removed. If strict storage hygiene becomes required, add a reconciliation job that compares live object keys against Prisma rows.

---

## 📊 Observability

Sentry was configured before the first deployment.

| Context | Tracked |
|:---|:---|
| 🏢 Organization | `orgId` on guarded generation/billing paths |
| 🎤 Voice | `voiceId`, voice variant |
| 📨 Request | Text length, generation params |
| ❌ Failures | API errors with full stack traces |

Session replay, structured logging, and context-aware debugging included.

---

## 🚀 Performance

| Strategy | Implementation |
|:---|:---|
| 🖥️ **React Server Components** | Data-fetching runs server-side, reducing client JS |
| 💀 **Loading skeletons** | Prevent layout shift during async operations |
| ⏱️ **Debounced search** | Voice search doesn't fire tRPC queries on every keystroke |
| 🔗 **Nuqs URL state** | Filters live in the URL — no component-level sync overhead |
| 🎵 **Streamed audio** | WaveSurfer.js streams progressively, no full-file preload |

---

## 🔧 Challenges Solved

<details>
<summary>🔄 <strong>Prisma connection exhaustion in development</strong></summary>

Next.js hot reload recreates module instances on every save, spawning new Prisma clients and connection pools. Fixed with a process-level singleton.

```typescript
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```
</details>

<details>
<summary>📂 <strong>Next.js route groups and layout confusion</strong></summary>

Route groups affect layout organization, not URL structure. Misplacing them attaches authenticated layouts to public routes. Fix: treat route groups as structure only, keep access control in `proxy.ts` and server handlers.
</details>

<details>
<summary>⏱️ <strong>Signed URL expiry during playback</strong></summary>

Signed URLs have a limited TTL. If playback starts near expiry, the URL becomes invalid mid-session. Fix: generate fresh URLs at playback time.
</details>

<details>
<summary>🎙️ <strong>Browser recording compatibility</strong></summary>

`MediaRecorder` MIME type and blob behavior differs across browsers. RecordRTC abstracts most variance, but upload handling still needs MIME normalization for consistent server-side processing.
</details>

<details>
<summary>💰 <strong>Metered billing accuracy</strong></summary>

Usage events emit only after S3 upload confirmation. If generation fails, the meter doesn't increment — billing stays aligned with actual output.
</details>

---

## 🚢 Deployment & Operations

| Component | Details |
|:---|:---|
| 🌐 **Vercel** | Next.js app, API routes, tRPC endpoints |
| 🤖 **Modal** | Chatterbox TTS inference (`chatterbox_tts.py`, FastAPI) |

### Operational Workflows

| Workflow | Command / Location | Why It Matters |
|:---|:---|:---|
| Generate Prisma client | `prisma generate` via `predev`, `prebuild`, and `postinstall` | Keeps Prisma 7 generated client in sync with schema changes |
| Sync inference types | `npm run sync-api` | Regenerates `src/types/chatterbox-api.d.ts` from the deployed Modal/FastAPI OpenAPI spec |
| Seed system voices | `npx prisma db seed` / `scripts/seed-system-voices.ts` | Uploads bundled WAV presets and upserts global `SYSTEM` voice rows |
| Deploy inference | `python -m modal deploy chatterbox_tts.py` | Publishes the Chatterbox FastAPI service used by `CHATTERBOX_API_URL` |
| Configure storage mount | Modal secret `aws-storage` or `AWS_MODAL_SECRET_NAME` | Lets Modal read the same bucket the app writes to |

The Modal class is configured with `scaledown_window=120`, so inactive inference workers may scale down. The app should continue treating inference as a network boundary that can fail, cold start, or return invalid audio.

---

## 🧠 Key Engineering Learnings

| # | Insight | Details |
|:---|:---|:---|
| 1️⃣ | **Owning inference changes the operating model** | Self-hosting moves generation cost, reliability, and model behavior into infrastructure the product controls. |
| 2️⃣ | **Multi-tenancy must be foundational** | Retrofitting tenant isolation is painful. Orgs must be a first-class DB, routing, and server-guard concern from day one. |
| 3️⃣ | **Type safety is a productivity multiplier** | tRPC + Prisma + TypeScript means schema changes propagate visibly through the entire stack at compile time. |
| 4️⃣ | **Billing is architecture, not UI** | Feature gates and usage metering belong in the application layer. Frontend-only gates are decoration, not policy. |
| 5️⃣ | **Observability before production** | Sentry was set up before the first deployment, with structured logs around generation and billing paths. |
| 6️⃣ | **Signed URLs are the correct default** | Public buckets are wrong for user-generated content. Time-limited signed URLs give controlled access without risk. |

---

## 🔮 Future Improvements

| Improvement | Rationale |
|:---|:---|
| 📬 Background job queue | Move inference out of the HTTP request lifecycle, remove timeout pressure |
| ⚡ Redis caching | Cut repeated org/subscription lookups on authenticated requests |
| 🔄 Webhook retry strategy | Prevent billing state drift when provider events arrive late |
| 🛡️ Granular RBAC | Separate member/admin powers without widening the auth model |
| 📊 Usage analytics | Give organizations visibility into consumption patterns |
| 🚦 Rate limiting per org | Safety valve against runaway usage and accidental abuse |
| 🔑 API key system | Let external developers access the inference pipeline directly |
| 🖥️ Distributed workers | Scale Modal/Chatterbox workers horizontally beyond a single container |
