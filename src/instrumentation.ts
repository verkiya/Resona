// Next.js Server Instrumentation.
// Bootstraps Sentry error tracking for the Node.js and Edge runtimes during server startup.
// Exports `onRequestError` which Next.js automatically invokes for App Router failures.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
