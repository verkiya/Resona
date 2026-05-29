// tRPC Initialization & Middleware.
// Configures the base tRPC instance and defines access-control procedures.
// Layers progressively stricter auth guards: Sentry (base) -> Clerk User (auth) -> Clerk User + Org (org).
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import * as Sentry from "@sentry/node";
import superjson from "superjson";

// We use React's `cache` to ensure context isn't repeatedly re-evaluated in RSCs.
// Note: We intentionally keep this context empty and resolve Clerk auth inside the procedures 
// themselves. This avoids blocking public procedures on auth resolution.
export const createTRPCContext = cache(async () => {}); 

const t = initTRPC.create({
  transformer: superjson,
});

const sentryMiddleware = t.middleware(
  Sentry.trpcMiddleware({
    attachRpcInput: true,
  }),
);
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(sentryMiddleware);

// requires a signed-in Clerk user; used when org scope is not needed.
export const authProcedure = baseProcedure.use(async ({ next }) => {
  const { userId } = await auth();
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: { userId },
  });
});

// requires userId and orgId — all tenant-owned data (voices, generations, billing) uses this.
export const orgProcedure = baseProcedure.use(async ({ next }) => {
  const { userId, orgId } = await auth();
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (!orgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Organization required",
    });
  }
  return next({ ctx: { userId, orgId } });
});
