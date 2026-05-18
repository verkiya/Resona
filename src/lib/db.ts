import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

/*
  Prisma needs a database adapter to talk to PostgreSQL.

  PrismaPg is Prisma's PostgreSQL adapter using the native pg driver.

  We provide the DATABASE_URL connection string so Prisma knows
  which database to connect to.
*/
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

/*
  In Next.js development mode, Fast Refresh / hot reload can re-run this file
  every time you save changes.

  Example:

    save file
    module re-executes
    new PrismaClient()

    save again
    module re-executes
    new PrismaClient()

    save again
    new PrismaClient()

  Every PrismaClient can open database connections.

  Result:
    "Too many database connections"

  because connections keep piling up.
*/

/*
  Important distinction:

  Module-level variables:
    DO get recreated on hot reload

  Global process variables:
    survive as long as the Node.js dev server process stays alive

  So while this file gets re-executed,
  `global` usually persists across hot reloads.

  That lets us cache the Prisma client safely in development.
*/

/*
  TypeScript doesn't know that we're attaching a custom `prisma`
  property onto the global object.

  So we tell TS:

    "global may contain a PrismaClient instance"
*/
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

/*
  Reuse existing Prisma client if one already exists globally.

  Otherwise create a new one.

  Development flow:
    first run -> create client
    hot reload -> reuse same client

  Production flow:
    usually clean process startup -> create fresh client
*/
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

/*
  Cache Prisma globally ONLY in development.

  Why?

  Development:
    Prevent connection explosion caused by hot reload.

  Production:
    Global caching is less useful / less reliable depending on runtime.

    Example:
      serverless functions
      isolated containers
      ephemeral processes

    In those environments, process lifetime is short,
    so relying on global persistence is not meaningful.

  Therefore:
    dev = cache
    prod = normal lifecycle
*/
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/*
  Export a singleton Prisma client.

  Anywhere in the app:

    import { prisma } from "@/lib/prisma"

  and the same shared client instance gets used.
*/
export { prisma };
