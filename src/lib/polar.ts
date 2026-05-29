// Billing & Telemetry SDK Client.
// Initializes the Polar.sh SDK for managing subscriptions, checkout sessions, and tracking metered usage.
// Note: Resona maps Polar's `externalCustomerId` directly to the Clerk `orgId` for multi-tenant billing.
import { Polar } from "@polar-sh/sdk";
import { env } from "./env";
export const polar = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.POLAR_SERVER,
});
