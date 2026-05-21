import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// AI explanation: Prisma talks to PostgreSQL through the PrismaPg adapter using DATABASE_URL from validated env.
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// AI explanation: In dev, Next.js hot reload re-runs this module; reusing one client on global avoids exhausting the DB connection pool.
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
