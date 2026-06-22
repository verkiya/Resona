# Resona Project Memory

This file preserves engineering context for Resona. The implementation is the source of truth. Historical reference material from `resonance-main` is useful only when it matches the current Resona codebase.

## Source Of Truth Order

1. Resona implementation
2. Runtime behavior verified from local code
3. Existing Resona comments
4. Existing Resona documentation
5. Conversation and development history
6. `resonance-main` reference material

Do not make Resona match `resonance-main`. Extract ideas only when they explain or improve the current implementation.

## Current Architecture

Resona is a Next.js 16 App Router application for AI voice generation. The product boundary is organization scoped:

- Clerk owns users, sessions, and organizations.
- Prisma/Postgres owns product records: voices and generations.
- Polar owns subscriptions, checkout, portal sessions, and metered usage.
- AWS S3 owns audio object storage.
- Modal hosts the Chatterbox TTS FastAPI service.
- Sentry captures application errors and request context.

The app has three primary runtime surfaces:

- Dashboard UI: Next.js routes and React components under `src/app`.
- Typed API: tRPC routers under `src/trpc/routers`.
- Binary API: Next route handlers for upload and audio proxying under `src/app/api`.

## Frontend Boundary

Frontend state is intentionally split:

- Server state: tRPC plus TanStack React Query.
- URL state: Nuqs for search/filter state.
- Ephemeral UI state: local React state for modals, playback, recording, and controls.

`src/trpc/client.tsx` keeps one browser `QueryClient` singleton so Suspense and re-renders do not recreate caches. Server components get request-scoped query clients through React `cache()` in `src/trpc/server.tsx`, which avoids cross-request data leaks while allowing nested RSC prefetches to share hydration state.

WaveSurfer owns waveform rendering and playback. RecordRTC owns browser recording abstraction. TanStack Form is used for type-safe form handling in the UI where applicable.

## Backend And API Boundary

tRPC is the main product API. Route handlers are used where raw binary streams make tRPC a poor fit:

- `POST /api/voices/create` accepts custom voice metadata in query params and raw audio bytes in the request body.
- `GET /api/audio/:generationId` streams generated audio after auth and org ownership checks.
- `GET /api/voices/:voiceId` streams voice reference audio after auth and voice access checks.

API and tRPC routes enforce Clerk auth themselves. `src/proxy.ts` intentionally bypasses `/api` and `/trpc`, because the Proxy guards page navigation while handlers/procedures guard data access.

## Authentication Flow

`src/proxy.ts` uses Clerk middleware for protected page routes:

- Public routes include sign-in, sign-up, learnings, and test pages.
- API and tRPC routes bypass Proxy and enforce auth internally.
- Signed-in users without an active organization are redirected to `/org-selection`.

tRPC access levels are defined in `src/trpc/init.ts`:

- `baseProcedure`: Sentry middleware only.
- `authProcedure`: requires a Clerk user.
- `orgProcedure`: requires both Clerk user and organization.

Tenant-owned data paths use `orgProcedure`.

## Database Layer

The Prisma schema is intentionally small:

- `Voice`: global `SYSTEM` voices and organization-owned `CUSTOM` voices.
- `Generation`: generated audio records scoped to one organization.

Important storage references:

- `Voice.objectKey`: S3 key for reference audio used by previews and cloning.
- `Generation.objectKey`: S3 key for generated WAV audio.

Important relationship behavior:

- `Generation.voiceId` uses `onDelete: SetNull` so generation history survives custom voice deletion.
- `Generation.voiceName` snapshots the display name at generation time.

NOTE:
Implementation intent is unclear from local context.
`@@unique([name, variant])` makes custom voice names globally unique by variant, while nearby comments and product flow describe custom names as organization scoped. Clarify before changing this constraint.

## Storage Architecture

AWS S3 stores all audio blobs. Browsers should not receive raw S3 object keys.

Current object key shapes:

- System voices: `voices/system/:voiceId.wav`
- Custom voices: `voices/orgs/:orgId/:voiceId`
- Generations: `generations/orgs/:orgId/:generationId`

`src/lib/aws_s3.ts` centralizes upload, delete, signed URL generation, and key validation. Key validation rejects empty keys and traversal-style `..` segments.

The Next.js app owns writes to S3. Modal mounts the same bucket read-only at `/storage`, so inference can resolve `voice_key` values locally without accepting S3 credentials per request.

Deletes are best-effort after DB deletion. If strict storage hygiene becomes a requirement, add a reconciliation job that compares S3 objects with live Prisma rows.

## Voice Generation Flow

The text-to-speech flow is implemented in `src/trpc/routers/generations.ts`:

1. Validate request input and resolve `ctx.orgId`.
2. Check Polar customer state for an active subscription.
3. Load the requested voice. It must be either `SYSTEM` or a `CUSTOM` voice owned by the organization.
4. Require `voice.objectKey`.
5. Call Modal Chatterbox via `chatterbox.POST("/generate")`.
6. Create a `Generation` row without `objectKey`.
7. Upload WAV bytes to S3.
8. Update the row with `objectKey`.
9. Emit Polar usage event `tts_generation` with metadata `{ characters: input.text.length }`.
10. Return the generation ID to the client.

The DB row and S3 upload are not transactional together. The router uses a two-phase write and deletes the newly created row if S3 upload or final DB update fails.

Usage metering is fire-and-forget after durable storage. Telemetry failure should not make a successful generation appear failed to the user.

## Voice Cloning Flow

Custom voice creation is implemented in `src/app/api/voices/create/route.ts`:

1. Require Clerk user and organization.
2. Check Polar active subscription for the organization.
3. Validate metadata with Zod.
4. Read raw request bytes.
5. Enforce non-empty file and 20 MB maximum size.
6. Normalize content type.
7. Parse audio metadata with `music-metadata`.
8. Require at least 5 seconds of audio.
9. Create a `CUSTOM` voice row without `objectKey`.
10. Upload reference audio to S3 under `voices/orgs/:orgId/:voiceId`.
11. Update the voice row with the object key.
12. Emit Polar usage event `voice_creation`.

If upload or final DB update fails, the route deletes the new voice row. This avoids showing voices that cannot be previewed or used for generation.

## Billing Architecture

Polar is the subscription and usage source of truth.

Critical invariant:

- Clerk `orgId` is always Polar `externalCustomerId`.

Current Polar event contract:

- `tts_generation`: emitted after successful generation storage; meter should sum metadata property `characters`.
- `voice_creation`: emitted after successful custom voice storage; meter should count events.

`src/trpc/routers/billing.ts` creates checkout sessions, creates portal sessions, and reads customer state by external customer ID. Missing customer state is treated as unsubscribed.

`billing.getStatus` sums `meter.amount` across active subscriptions for the dashboard estimate. There is no local subscription cache and no webhook mirror in Postgres.

Operational guidance from reference material that still applies: configure Polar dashboard meters to match the event names and metadata property emitted by Resona code. Do not rename events in code without updating Polar.

## Modal And Inference Boundary

`chatterbox_tts.py` is the Modal-hosted inference service. It exposes a FastAPI app with `POST /generate`.

Important runtime requirements:

- `CHATTERBOX_API_URL` points the Next.js app at the deployed FastAPI service.
- `CHATTERBOX_API_KEY` secures calls from Next.js to Modal with `x-api-key`.
- Modal secrets include `hf-token`, `chatterbox-api-key`, and the storage secret.
- The storage secret defaults to `aws-storage` unless `AWS_MODAL_SECRET_NAME` overrides it.
- The bucket mount is read-only.
- `scaledown_window=120` means inactive workers can scale down; callers must treat inference as a network boundary that can cold start or fail.

After changing the FastAPI contract, run `npm run sync-api`. This refreshes `src/types/chatterbox-api.d.ts` from `/openapi.json` so the TypeScript client matches the Python API.

## Environment Variables

`src/lib/env.ts` uses `@t3-oss/env-nextjs` to validate required server and client variables.

Required server areas:

- Clerk secret key
- Database URL
- App URL
- AWS credentials, region, and bucket
- Chatterbox API URL and API key
- Polar access token, server, and product ID
- Sentry auth token

Required client areas:

- Clerk publishable key and redirect URLs
- Optional public app URL

`SKIP_ENV_VALIDATION` bypasses validation and should be used only when the deployment/build process genuinely requires it.

## Observability

Sentry is initialized for server, edge, and browser runtimes.

Current instrumentation includes:

- Server and edge Sentry initialization.
- Browser Sentry initialization with replay integration.
- tRPC Sentry middleware with RPC input capture.
- Structured logs around generation start, generation success, and generation failure.

Avoid logging raw audio, tokens, credentials, or billing secrets. Existing logs use opaque org, voice, and generation identifiers plus request metadata such as text length.

## Maintenance Workflows

Run or verify these workflows when relevant:

- `prisma generate`: regenerate Prisma client after schema changes.
- `npm run sync-api`: regenerate Chatterbox API types after Modal/FastAPI changes.
- `npx prisma db seed`: seed bundled system voice rows and S3 objects.
- `python -m modal deploy chatterbox_tts.py`: deploy inference service.

System voice maintenance requires three things to stay aligned:

- WAV file in `scripts/system-voices`.
- Name in `CANONICAL_SYSTEM_VOICE_NAMES`.
- Metadata entry in `scripts/seed-system-voices.ts`.

## Important Invariants

- Tenant-owned reads and writes must include `orgId`.
- API routes and tRPC procedures must enforce auth even though Proxy exists.
- S3 object keys stay server-side; clients receive app proxy URLs.
- Usage events emit only after durable work succeeds.
- Storage failures should not leave visible DB records without audio.
- Billing uses organization identity, not user identity.
- Modal reads voice audio from S3; it should not write product audio objects.
- Generated API types must match the deployed Chatterbox OpenAPI contract.
- The public learnings page is whitelisted in Proxy and should not expose private operational secrets.

## Reliability Lessons

- DB and S3 cannot be committed atomically; use two-phase writes and cleanup.
- Billing telemetry should not block the user response after successful durable work.
- Missing Polar customer state is a normal unsubscribed state, not an application crash.
- Audio proxy routes must check tenant ownership before fetching signed URLs.
- Signed URLs should be generated near playback time because they expire.
- Browser-recorded audio needs server-side validation; MIME headers alone are not trustworthy.
- Best-effort S3 deletes are acceptable for current UX, but not enough for strict storage accounting.

## Knowledge Transferred From resonance-main

These ideas were valuable and match Resona:

- Polar meter names must match emitted event names.
- `tts_generation` should meter the `characters` metadata property.
- `voice_creation` should count successful custom voice creations.
- Modal deployment requires Hugging Face, API key, and storage secrets.
- Chatterbox FastAPI changes require refreshing generated TypeScript OpenAPI types.
- System voice seeding is a maintenance workflow, not app runtime behavior.
- Modal can scale down inactive workers, so inference must be treated as a fallible remote service.
- Storage deletes may need retries or reconciliation if strict cleanup becomes important.

## Knowledge Rejected From resonance-main

These reference details should not be copied into Resona:

- Cloudflare R2-specific storage implementation. Resona uses AWS S3 through the AWS SDK.
- Railway tutorial deployment instructions. Resona documents Vercel plus Modal.
- Tutorial branding, open-source clone positioning, and educational scaffolding.
- Clerk v6 assumptions. Resona uses the currently installed Clerk package and Next.js 16 Proxy conventions.
- A 10 second voice sample minimum. Resona enforces 5 seconds in code.
- Proxy-auth behavior for API/tRPC routes. Resona bypasses API/tRPC in Proxy and guards handlers/procedures directly.
- Any instruction to make Resona match the reference repository structure.

## Remaining Knowledge Gaps

- Exact reason for the current `@@unique([name, variant])` constraint.
- Exact Polar dashboard configuration beyond event names and metadata property.
- AWS bucket policy, CORS, lifecycle, encryption, and IAM intent.
- Production deployment settings for Vercel, Modal, database, and Sentry projects.
- Expected operational response when Polar event ingestion fails repeatedly.
- Whether strict S3 reconciliation is required for cost, privacy, or compliance.
- Future RBAC model inside Clerk organizations.
- Rate limiting policy for generation and voice creation.
- Whether inference should remain synchronous over HTTP or move to a background queue.

## Maintainer Guidance

When changing generation, cloning, billing, or storage code, verify the full cross-system flow rather than only the local function:

- Does the auth boundary still use Clerk org ID?
- Does the database query filter by organization where needed?
- Does the storage key shape remain compatible with Modal and proxies?
- Does a failure leave orphaned rows or inaccessible audio?
- Does Polar usage still emit after success and with the expected event name?
- Does the Chatterbox OpenAPI type file need regeneration?

Prefer a missing comment over a misleading one. If intent is unclear after reading local code, write a short `NOTE:` and ask for human clarification rather than inventing rationale.
