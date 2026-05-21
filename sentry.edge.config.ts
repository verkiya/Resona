// AI explanation: Sentry initialization for Next.js edge/middleware runtimes.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://794a0002840d0aff5c378c4869b62df9@o4510577748213760.ingest.us.sentry.io/4511268283809792",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
