// AI explanation: Maintenance script — prepends file-level AI explanation headers to TS/TSX files that lack them (npm/node one-shot).
/**
 * One-shot: prepend defensible file-level AI explanation comments where missing.
 * Skips files that already contain "AI explanation".
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIRS = new Set(["node_modules", ".next", "generated", ".git"]);
const SKIP_FILES = new Set(["next-env.d.ts"]);

const SHADCN =
  "// AI explanation: shadcn/ui presentational primitive; Resona product behavior lives in src/features and src/app.\n";

function hasAiExplanation(content) {
  return content.includes("AI explanation");
}

function commentFor(rel) {
  if (rel === "next.config.ts")
    return "// AI explanation: Next.js config — Sentry wrapper and build settings for the Resona app.\n";
  if (rel === "prisma.config.ts")
    return "// AI explanation: Prisma CLI config pointing at schema and DATABASE_URL for migrations/generate.\n";
  if (rel === "sentry.server.config.ts")
    return "// AI explanation: Sentry initialization for Node/server runtimes.\n";
  if (rel === "sentry.edge.config.ts")
    return "// AI explanation: Sentry initialization for Next.js edge/middleware runtimes.\n";
  if (rel === "scripts/sync-api.ts")
    return "// AI explanation: Dev script — fetches Chatterbox OpenAPI and regenerates src/types/chatterbox-api.d.ts.\n";
  if (rel.startsWith("src/components/ui/")) {
    if (rel.endsWith("wavy-background.tsx"))
      return "// AI explanation: Animated simplex-noise canvas background for marketing/auth visuals; custom, not a stock shadcn export.\n";
    if (rel.endsWith("sidebar.tsx"))
      return "// AI explanation: shadcn sidebar primitives (provider, rail, menu); app navigation is composed in dashboard-sidebar.tsx.\n";
    if (rel.endsWith("chart.tsx"))
      return "// AI explanation: shadcn chart helpers around Recharts theming; used where charts are rendered in the app.\n";
    return SHADCN;
  }
  if (rel === "src/components/page-header.tsx")
    return "// AI explanation: Shared page title/subtitle header used by dashboard feature views.\n";
  if (rel === "src/components/voice-avatar/voice-avatar.tsx")
    return "// AI explanation: Deterministic avatar image for a voice id via useVoiceAvatar (Dicebear/multiavatar).\n";
  if (rel === "src/components/voice-avatar/use-voice-avatar.ts")
    return "// AI explanation: Picks a stable avatar style/seed from the voice id for list and preview UI.\n";
  if (rel === "src/lib/utils.ts")
    return "// AI explanation: Shared className merge (cn) and small formatting helpers used across UI.\n";
  if (rel === "src/types/chatterbox-api.d.ts")
    return "// AI explanation: Generated OpenAPI types for Chatterbox; regenerate with npm run sync-api.\n";
  if (rel === "src/instrumentation.ts")
    return "// AI explanation: Next.js instrumentation hook — loads Sentry server config when the Node runtime starts.\n";
  if (rel === "src/instrumentation-client.ts")
    return "// AI explanation: Client-side Sentry bootstrap loaded by Next for browser error reporting.\n";
  if (rel === "src/trpc/routers/_app.ts")
    return "// AI explanation: Root tRPC router merging voices, generations, and billing sub-routers.\n";
  if (rel === "src/trpc/query-client.ts")
    return "// AI explanation: TanStack Query defaults (superjson dehydrate/hydrate) shared by server and browser clients.\n";
  if (rel === "src/trpc/client.tsx")
    return "// AI explanation: Browser tRPC + React Query provider; singleton query client avoids duplicate clients on suspense.\n";
  if (rel === "src/hooks/use-audio-playback.ts")
    return "// AI explanation: Lightweight HTMLAudioElement play/pause for file previews (voice upload form, cards).\n";
  if (rel === "src/hooks/use-app-form.tsx")
    return "// AI explanation: TanStack Form hook factory shared by TTS and other forms using field/form context.\n";
  if (rel === "src/hooks/use-mobile.ts")
    return "// AI explanation: matchMedia hook (1024px) for responsive TTS layout and WaveSurfer sizing.\n";
  if (rel === "src/app/layout.tsx")
    return "// AI explanation: Root HTML shell — Clerk, tRPC, nuqs, fonts, toaster, and Vercel analytics.\n";
  if (rel === "src/app/global-error.tsx")
    return "// AI explanation: Next.js global error boundary UI when the root layout throws.\n";
  if (rel === "src/app/not-found.tsx")
    return "// AI explanation: App-wide 404 page.\n";
  if (rel === "src/app/(dashboard)/layout.tsx")
    return "// AI explanation: Authenticated app chrome — sidebar provider, dashboard sidebar, and main content inset.\n";
  if (rel === "src/app/(dashboard)/page.tsx")
    return "// AI explanation: Home route — redirects unauthenticated users and renders DashboardView.\n";
  if (rel === "src/app/(dashboard)/text-to-speech/page.tsx")
    return "// AI explanation: RSC entry for new TTS — prefetches voices/history, passes searchParams into TextToSpeechView.\n";
  if (rel === "src/app/(dashboard)/text-to-speech/[generationId]/page.tsx")
    return "// AI explanation: RSC entry for an existing generation — prefetches generation + voices for TextToSpeechDetailView.\n";
  if (rel === "src/app/(dashboard)/text-to-speech/layout.tsx")
    return "// AI explanation: Pass-through layout slot for the text-to-speech route segment.\n";
  if (rel === "src/app/(dashboard)/text-to-speech/loading.tsx")
    return "// AI explanation: Streaming skeleton shown while the text-to-speech RSC tree is loading.\n";
  if (rel === "src/app/(dashboard)/voices/page.tsx")
    return "// AI explanation: RSC entry for voices library — parses nuqs search, prefetches voices.getAll.\n";
  if (rel === "src/app/(dashboard)/voices/layout.tsx")
    return "// AI explanation: Pass-through layout for the voices route segment.\n";
  if (rel === "src/app/(auth)/layout.tsx")
    return "// AI explanation: Split auth layout — Clerk sign-in/up forms plus AuthMarketing panel.\n";
  if (rel === "src/app/(auth)/auth-marketing.tsx")
    return "// AI explanation: Marketing copy and visuals beside Clerk auth forms.\n";
  if (rel === "src/app/(auth)/sign-in/[[...sign-in]]/page.tsx")
    return "// AI explanation: Clerk-hosted sign-in route.\n";
  if (rel === "src/app/(auth)/sign-up/[[...sign-up]]/page.tsx")
    return "// AI explanation: Clerk-hosted sign-up route.\n";
  if (rel === "src/app/(auth)/org-selection/page.tsx")
    return "// AI explanation: Clerk organization picker — required before org-scoped dashboard routes (see proxy.ts).\n";
  if (rel === "src/app/api/sentry-example-api/route.ts")
    return "// AI explanation: Sentry demo route that throws intentionally for integration testing.\n";
  if (rel === "src/app/sentry-example-page/page.tsx")
    return "// AI explanation: Sentry demo page for manual error reporting tests.\n";
  if (rel === "src/app/test/page.tsx")
    return "// AI explanation: Internal/dev test page (not part of production user flows).\n";
  if (rel === "src/app/learnings/page.tsx")
    return "// AI explanation: Public learning/docs page (whitelisted in proxy.ts).\n";
  if (rel === "src/features/dashboard/views/dashboard-view.tsx")
    return "// AI explanation: Dashboard home — quick actions and entry points into TTS and voices.\n";
  if (rel === "src/features/dashboard/components/dashboard-sidebar.tsx")
    return "// AI explanation: Primary app nav, org switcher, voice create entry, and billing usage footer.\n";
  if (rel === "src/features/dashboard/components/dashboard-header.tsx")
    return "// AI explanation: Top bar for dashboard sub-pages (title area / actions).\n";
  if (rel === "src/features/dashboard/components/hero-pattern.tsx")
    return "// AI explanation: Decorative background pattern on the dashboard marketing hero.\n";
  if (rel === "src/features/dashboard/components/quick-actions-panel.tsx")
    return "// AI explanation: Grid of QuickActionCard links on the dashboard home.\n";
  if (rel === "src/features/dashboard/components/quick-action-card.tsx")
    return "// AI explanation: Single dashboard shortcut card linking into a feature route.\n";
  if (rel === "src/features/dashboard/components/text-input-panel.tsx")
    return "// AI explanation: Dashboard variant of the shared text prompt panel (routes into TTS with query params).\n";
  if (rel === "src/features/dashboard/data/quick-actions.ts")
    return "// AI explanation: Static config for dashboard quick-action cards (labels, hrefs, icons).\n";
  if (rel === "src/features/billing/hooks/use-checkout.ts")
    return "// AI explanation: Starts Polar checkout via billing.createCheckout and redirects the browser.\n";
  if (rel === "src/features/billing/components/usage-container.tsx")
    return "// AI explanation: Sidebar billing widget — subscription status, estimated usage cost, upgrade/portal actions.\n";
  if (rel === "src/features/voices/views/voices-view.tsx")
    return "// AI explanation: Voices page shell — toolbar, list, and empty states for custom/system voices.\n";
  if (rel === "src/features/voices/views/voices-layout.tsx")
    return "// AI explanation: Layout wrapper for voices feature pages.\n";
  if (rel === "src/features/voices/lib/params.ts")
    return "// AI explanation: nuqs parsers/cache for voices list search query (?query=).\n";
  if (rel === "src/features/voices/data/voice-scoping.ts")
    return "// AI explanation: Canonical SYSTEM voice names used by the seed script and uniqueness constraints.\n";
  if (rel === "src/features/voices/data/voice-categories.ts")
    return "// AI explanation: Voice category enum labels for forms and cards.\n";
  if (rel === "src/features/voices/components/voices-list.tsx")
    return "// AI explanation: Renders custom and system voice grids from voices.getAll.\n";
  if (rel === "src/features/voices/components/voices-toolbar.tsx")
    return "// AI explanation: Search and filters for the voices page (synced to URL via nuqs).\n";
  if (rel === "src/features/voices/components/voice-recorder.tsx")
    return "// AI explanation: In-browser recording UI using RecordRTC + WaveSurfer mic waveform.\n";
  if (rel === "src/features/voices/components/voice-create-dialog.tsx")
    return "// AI explanation: Modal entry point that hosts VoiceCreateForm for new custom voices.\n";
  if (rel === "src/features/voices/hooks/use-audio-recorder.ts")
    return "// AI explanation: Record/stop/cleanup hook backing VoiceRecorder (stream, timer, blob output).\n";
  if (rel === "src/features/text-to-speech/views/text-to-speech-layout.tsx")
    return "// AI explanation: Full-height layout wrapper for TTS routes.\n";
  if (rel === "src/features/text-to-speech/components/text-input-panel.tsx")
    return "// AI explanation: Main prompt textarea and character limit UI inside the TTS form.\n";
  if (rel === "src/features/text-to-speech/components/voice-selector.tsx")
    return "// AI explanation: Voice picker combobox grouped into custom vs system voices.\n";
  if (rel === "src/features/text-to-speech/components/voice-selector-button.tsx")
    return "// AI explanation: Compact trigger that opens the voice selector on smaller layouts.\n";
  if (rel === "src/features/text-to-speech/components/voice-preview-mobile.tsx")
    return "// AI explanation: Mobile-only playback strip for a generation (WaveSurfer + metadata).\n";
  if (rel === "src/features/text-to-speech/components/voice-preview-placeholder.tsx")
    return "// AI explanation: Empty state shown before the first generation exists on the new-TTS page.\n";
  if (rel === "src/features/text-to-speech/components/generate-button.tsx")
    return "// AI explanation: Submit control with rotating loading copy while generations.create runs.\n";
  if (rel === "src/features/text-to-speech/components/settings-panel.tsx")
    return "// AI explanation: Right rail combining generation settings and history on desktop.\n";
  if (rel === "src/features/text-to-speech/components/settings-panel-settings.tsx")
    return "// AI explanation: Sliders for temperature, topP, topK, and repetition penalty bound to the TTS form.\n";
  if (rel === "src/features/text-to-speech/components/settings-panel-history.tsx")
    return "// AI explanation: Lists past generations for the org with links to detail routes.\n";
  if (rel === "src/features/text-to-speech/components/settings-drawer.tsx")
    return "// AI explanation: Mobile drawer exposing settings when the desktop right rail is hidden.\n";
  if (rel === "src/features/text-to-speech/components/history-drawer.tsx")
    return "// AI explanation: Mobile drawer for generation history.\n";
  if (rel === "src/features/text-to-speech/components/prompt-suggestions.tsx")
    return "// AI explanation: Clickable sample prompts that prefill the TTS text field.\n";
  if (rel === "src/features/text-to-speech/data/constants.ts")
    return "// AI explanation: Shared TTS limits (e.g. max text length) used by UI and generations router.\n";
  if (rel === "src/features/text-to-speech/data/sliders.ts")
    return "// AI explanation: Slider metadata (min/max/step/labels) for TTS inference parameters.\n";
  return null;
}

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(ent.name)) files.push(full);
  }
  return files;
}

const targets = [
  ...walk(path.join(root, "src")),
  ...walk(path.join(root, "scripts")).filter((f) => !f.endsWith("add-ai-comments.mjs")),
  path.join(root, "next.config.ts"),
  path.join(root, "prisma.config.ts"),
  path.join(root, "sentry.server.config.ts"),
  path.join(root, "sentry.edge.config.ts"),
].filter((f) => fs.existsSync(f));

let added = 0;
let skipped = 0;
let noRule = 0;

for (const full of targets) {
  const rel = path.relative(root, full).replace(/\\/g, "/");
  if (SKIP_FILES.has(rel)) {
    skipped++;
    continue;
  }
  const content = fs.readFileSync(full, "utf8");
  if (hasAiExplanation(content)) {
    skipped++;
    continue;
  }
  const header = commentFor(rel);
  if (!header) {
    noRule++;
    console.warn("no rule:", rel);
    continue;
  }
  fs.writeFileSync(full, header + content, "utf8");
  added++;
}

console.log(JSON.stringify({ added, skipped, noRule }, null, 2));
