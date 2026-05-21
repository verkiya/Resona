import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    // Clerk
    CLERK_SECRET_KEY: z.string().min(1),

    // Database
    DATABASE_URL: z.string().refine((v) =>
      v.startsWith("postgres://") || v.startsWith("postgresql://"),
      { message: "DATABASE_URL must start with 'postgres://' or 'postgresql://'" },
    ),

    // App
    APP_URL: z.string().url(),

    // Storage
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_BUCKET_NAME: z.string().min(1),
    AWS_MODAL_SECRET_NAME: z.string().min(1).optional(),

    // AI
    CHATTERBOX_API_KEY: z.string().min(1),
    CHATTERBOX_API_URL: z.url(),

    // Billing
    POLAR_ACCESS_TOKEN: z.string().min(1),
    POLAR_SERVER: z.enum(["sandbox", "production"]),
    POLAR_PRODUCT_ID: z.string().min(1),

    // Monitoring
    SENTRY_AUTH_TOKEN: z.string().min(1),
  },

  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().min(1).optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,

    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,

    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,

    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
