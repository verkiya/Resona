// Database Connection Singleton.
// Initializes the Prisma ORM client with the Neon Serverless PostgreSQL adapter.
// Caches the client instance in development to prevent connection pool exhaustion during hot-reloads.
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// Use the PrismaPg adapter to route queries through the pg driver instead of the Rust engine.
// This is required for environments like Vercel Edge/Serverless where native binaries are problematic.
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// In development, Next.js clears the module cache frequently on file changes.
// We attach the PrismaClient to `global` so we reuse a single connection pool, 
// avoiding "too many connections" errors.
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
