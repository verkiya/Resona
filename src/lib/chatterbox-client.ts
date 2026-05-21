// AI explanation: Typed HTTP client for the external Chatterbox TTS service (Modal); generation requests go through POST /generate.
import createClient from "openapi-fetch";
import type { paths } from "@/types/chatterbox-api";
import { env } from "./env";

export const chatterbox = createClient<paths>({
  baseUrl: env.CHATTERBOX_API_URL,
  headers: {
    "x-api-key": env.CHATTERBOX_API_KEY,
  },
});
