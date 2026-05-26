# Resona

> AI voice generation SaaS with self-hosted inference, organization-aware auth, metered billing, and private audio delivery.

## Overview

Resona is a production-minded AI voice platform for creating custom voices, generating speech from text, and managing those assets inside secure organization workspaces.

The project was built to study the parts of a real SaaS product that prototypes usually skip: tenancy, billing, storage, observability, deployment, and the edges around media handling.

## Why It Exists

- 🧠 To own the full text-to-speech pipeline instead of depending on a paid third-party API.
- 🔐 To model authentication, organization boundaries, and protected routes as first-class product concerns.
- 💳 To treat billing and usage metering as architecture, not UI decoration.
- 📦 To keep audio private while still making playback fast and reliable.

## System Architecture

Resona is split into two main flows:

### 1. Web Application Flow

1. Browser app built with Next.js and React
2. Clerk middleware handles auth and organization selection
3. tRPC exposes type-safe API procedures
4. Business logic enforces validation, quotas, and feature gates
5. Prisma queries PostgreSQL

### 2. Voice Generation Pipeline

1. User submits text-to-speech generation
2. Billing and usage checks run server-side
3. A FastAPI inference layer runs self-hosted Chatterbox TTS
4. Generated audio is stored in AWS S3
5. Short-lived signed URLs are returned for secure playback
6. WaveSurfer.js powers waveform preview and scrubbing in the UI

## Core Features

- 🎙️ Self-hosted AI voice generation
- 👤 Custom voice creation and voice cloning
- 🌊 Waveform playback, scrubbing, and seeking
- 🏢 Organization-based workspaces and tenant isolation
- 💰 Subscription billing and usage metering with Polar
- 🔒 Private audio storage with signed URL delivery
- 📈 Sentry-backed production observability

## Database Model

The schema is intentionally small and opinionated:

- `User` belongs to an organization through Clerk
- `Organization` owns voices, generations, usage events, and subscriptions
- `Voice` stores reusable custom voices and uploaded samples
- `Generation` stores text input, audio output, and tenant scope
- `UsageEvent` tracks metered billing activity
- `Subscription` stores the active billing state

The important part is the shape of the relationships: organization scope is always explicit, and generation history hangs off the voice and org that created it.

## Technical Decisions

### 🧩 Self-hosted inference

Owning the model pipeline removes vendor lock-in and recurring per-request costs. The tradeoff is operational work, but that work stays inside the product boundary instead of living in someone else’s API.

### 🔐 Clerk for auth and tenancy

Clerk handles sessions, org membership, and route protection without custom security plumbing. That keeps organization switching and protected access consistent across the app.

### 🧪 tRPC + Prisma + TypeScript

The backend and frontend share types end to end, so schema changes surface as compiler errors instead of runtime surprises. Prisma keeps the relational model clear and maintainable.

### 📦 AWS S3 for private audio

Audio is kept private and delivered with short-lived signed URLs. That gives secure access without exposing buckets publicly or adding unnecessary proxy complexity.

### 💳 Polar for billing

Polar handles subscriptions and usage-based billing while the application layer enforces feature access. Billing remains a server-side policy, not just a UI state.

## Security Considerations

- 🛡️ All queries are scoped to organization ID.
- 🛡️ Protected routes are enforced before page logic runs.
- 🛡️ Audio assets are never public by default.
- 🛡️ Uploads are validated on both the client and server.
- 🛡️ Premium actions are enforced in server procedures, not only in the UI.
- 🛡️ Webhooks are verified before subscription state changes.

## Performance Notes

- ⚡ Server-rendered components reduce client-side JavaScript where possible.
- ⚡ Search and filter state is kept in the URL with Nuqs.
- ⚡ Voice search is debounced to avoid unnecessary API calls.
- ⚡ Audio previews use waveform-based playback instead of static downloads.
- ⚡ Loading skeletons reduce layout shift and make async states feel intentional.

## Deployment & Ops

- 🚀 Next.js App Router for the web application and server routes
- 🚀 Railway for inference and application hosting
- 🚀 GitHub Actions for CI/CD and validation
- 🚀 Sentry for error tracking and debugging context
- 🚀 Environment-scoped secrets and production-safe configuration

## Validation Rules

- File upload size is capped at roughly 20MB
- Minimum audio duration is validated at roughly 10 seconds
- Validation runs both client-side and server-side
- Premium actions are blocked when billing state is inactive

## Tech Stack

### Frontend

- Next.js 16
- React 19
- Tailwind CSS v4
- ShadCN UI
- TanStack React Form
- Nuqs
- WaveSurfer.js
- React Dropzone
- RecordRTC
- DiceBear

### Backend

- tRPC
- Prisma
- PostgreSQL
- FastAPI for the AI inference layer

### Infrastructure

- AWS S3
- Railway
- GitHub Actions
- Sentry

### Auth & Billing

- Clerk
- Polar SDK

### AI

- Self-hosted Chatterbox TTS model

## Project Goal

Resona is meant to demonstrate how a modern AI SaaS can be built as a real product architecture rather than a demo:

- custom inference ownership
- secure multi-tenant access
- private media delivery
- metered monetization
- production observability
- polished user experience

## Closing Thought

The hardest parts of the project are not the model call itself. They are the systems around it: tenancy, billing, storage, and making failures visible early enough to fix.
