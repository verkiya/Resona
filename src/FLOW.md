# Resona request flow (quick map)

Start here for orientation, then read the file-level and inline comments in `src/` for how each layer fits together.

**Stack:** Vercel (Next.js + API) · Modal (Chatterbox TTS) · AWS S3 · Clerk · Polar · PostgreSQL/Prisma

## Auth gate (`src/proxy.ts`)

1. Public: `/sign-in`, `/sign-up`, `/learnings`, `/test`
2. Signed in, no org → redirect `/org-selection`
3. API/tRPC routes bypass Proxy and enforce auth in handlers/procedures
4. Otherwise → dashboard routes

## TTS generation (happy path)

1. `TextToSpeechForm` → `generations.create` (tRPC)
2. `orgProcedure` checks Clerk `orgId`
3. Polar subscription check
4. Load voice `objectKey` (SYSTEM or org CUSTOM)
5. `chatterbox.POST /generate` (Modal FastAPI service)
6. Create `Generation` row → upload WAV to S3 → set `objectKey`
7. Emit Polar usage event (fire-and-forget)
8. Client navigates to `/text-to-speech/[id]` → playback via `/api/audio/:id`

## Custom voice create

1. `VoiceCreateForm` → `POST /api/voices/create?metadata…` with raw audio body
2. Subscription check → validate audio → S3 upload → update `Voice.objectKey`

## Deployment

- **App**: Vercel (Next.js frontend + API routes + tRPC)
- **Inference**: Modal (`chatterbox_tts.py`, FastAPI)
- **DB**: PostgreSQL via Prisma
- **Storage**: AWS S3
- **Auth**: Clerk · **Billing**: Polar
