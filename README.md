Resona — AI Voice Generation SaaS Platform
Overview

Resona is a full-stack AI-powered voice generation SaaS platform designed for scalable production use.

It enables users and teams to create custom AI voices, generate natural speech from text, manage voice libraries, and operate within secure organization-based workspaces with subscription billing and usage metering.

The platform is built around a self-hosted AI voice generation pipeline, eliminating dependency on expensive third-party voice APIs while maintaining full control over inference, storage, billing, and deployment.

Core Features
AI Voice Generation Pipeline

Resona provides a fully integrated AI voice generation workflow powered by a self-hosted open-source text-to-speech model.

Capabilities include:

self-hosted Chatterbox text-to-speech inference
no dependency on third-party paid voice APIs
real-time text-to-speech generation
interactive audio playback
waveform scrubbing and seeking
downloadable generated audio
secure audio delivery via signed URLs

This architecture gives full ownership over performance, scalability, and cost.

Custom Voice Cloning

Users can create reusable custom AI voices using multiple input methods.

Supported workflows:

upload existing voice samples
record audio directly in the browser
preview recordings before upload
validate duration and file size constraints
generate unique avatars for voices
share voices across organization workspaces

Voice management includes:

create
browse
search
delete
preview

Voice identities are enhanced with automatically generated avatars using DiceBear.

Real-Time Audio Experience

Audio UX is a first-class feature.

Resona includes:

waveform visualization via WaveSurfer.js
scrubbing support
playback controls
seek controls
mobile responsive audio players
desktop responsive audio players
live audio preview support

This creates a production-quality media interaction experience instead of static audio downloads.

Multi-Tenant SaaS Architecture

Resona is designed as a true multi-tenant SaaS platform.

Features include:

organization-based workspaces
isolated tenant data
role-aware access control
secure authentication
protected route access
organization selection workflows

Authentication and tenancy are powered by Clerk.

Architecture includes:

user authentication
organization membership
session management
middleware-based route protection
organization-aware application state

This allows multiple teams to securely operate within the same platform.

Subscription Billing & Monetization

Resona includes production-grade monetization infrastructure.

Billing features:

subscription management
pay-as-you-go metered billing
usage event tracking
upgrade prompts
feature gating
subscription enforcement
checkout integration
customer billing portal

Implemented using Polar SDK.

Protected premium actions include:

AI voice generation
custom voice creation

Usage can be measured based on generation activity and enforced transparently.

Frontend Experience

Resona is built with a modern production frontend stack.

Frontend architecture includes:

Next.js App Router
Tailwind CSS v4
ShadCN UI
React Context
TanStack React Form
Nuqs query-state management

UI capabilities:

dashboards
responsive layouts
sidebars
text generation panels
voice selectors
prompt suggestions
history views
loading skeletons
mobile responsiveness
desktop responsiveness

Design emphasizes production SaaS usability rather than demo-only UI.

Backend Architecture

Backend infrastructure is built around type safety and production maintainability.

Stack:

Next.js server architecture
tRPC
Prisma ORM
PostgreSQL

Capabilities:

type-safe API contracts
server/client shared types
relational schema modeling
enums
indexes
optimized queries
scalable data modeling

Core domain models include:

users
organizations
voices
generations
subscriptions
usage events

This ensures strong developer ergonomics with low runtime error risk.

Audio Storage Infrastructure

Audio assets are stored using scalable object storage.

Implementation:

Cloudflare R2
AWS S3-compatible SDK
signed URL access
secure streaming delivery

Benefits:

low-cost scalable storage
secure temporary access
cloud-native delivery
production reliability

Used for:

uploaded voice samples
generated AI speech
voice previews
Observability & Production Monitoring

Resona includes production-grade observability.

Monitoring stack:

Sentry error tracking
session replay
structured logging
stack traces
contextual debugging metadata

Tracked context includes:

organization ID
voice ID
request metadata
generation context
text length
API errors

tRPC middleware integrates observability directly into backend workflows.

This significantly improves debugging and production stability.

Deployment & CI/CD

Resona is deployment-ready.

Infrastructure includes:

Railway deployment
environment variable management
GitHub Actions CI/CD
pull request validation
preview environments
automated builds
lint checks
production deployment workflows

This allows safe iteration with automated deployment pipelines.

Developer Experience

Developer tooling was designed for speed and maintainability.

Includes:

strict TypeScript
OpenAPI-generated TypeScript types
Prisma schema-driven modeling
shared API typing via tRPC
automated seed workflows
predictable environment configuration

Developer productivity benefits:

fewer runtime bugs
better autocomplete
safer refactors
faster AI-assisted development
Technical Stack
Frontend
Next.js 16
React 19
Tailwind CSS v4
ShadCN UI
TanStack React Form
Nuqs
WaveSurfer.js
React Dropzone
RecordRTC
DiceBear
Backend
tRPC
Prisma
PostgreSQL
OpenAPI TypeScript generation
FastAPI (AI inference layer)
Infrastructure
Cloudflare R2
Railway
GitHub Actions
Sentry
Authentication & Billing
Clerk
Polar SDK
AI
Self-hosted Chatterbox TTS model
Architecture Highlights

Key engineering decisions:

Self-hosted inference

Owning the inference pipeline removes vendor lock-in and recurring API dependency risk.

Type-safe full-stack architecture

tRPC + Prisma + TypeScript provide end-to-end type safety.

Multi-tenancy by design

Organizations are a core architectural primitive, not bolted-on functionality.

Production observability

Monitoring and debugging infrastructure exists from day one.

Monetization-first SaaS architecture

Billing, subscriptions, and usage metering are first-class platform concerns.

Validation Rules

Platform constraints include:

audio upload size limits (~20MB)
minimum audio duration validation (~10 seconds)
client-side validation
server-side validation
protected premium workflows
Project Goal

Resona demonstrates how to build a modern production-grade AI SaaS product with:

custom AI inference ownership
scalable multi-tenant architecture
secure authentication
monetization infrastructure
production observability
deployment automation
polished user experience

It is designed as a real product architecture rather than a prototype demo.
