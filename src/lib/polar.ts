// Polar.sh SDK client for subscriptions, checkout, customer portal, and usage event ingestion (org-scoped via externalCustomerId).
import { Polar } from "@polar-sh/sdk";
import { env } from "./env";
export const polar = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.POLAR_SERVER,
});
