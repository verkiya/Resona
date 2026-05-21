// AI explanation: tRPC bootstrap — baseProcedure adds Sentry; authProcedure and orgProcedure layer Clerk checks for user and organization scope.
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import * as Sentry from "@sentry/node";
import superjson from "superjson";
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

// AI explanation: requires a signed-in Clerk user; used when org scope is not needed.
export const authProcedure = baseProcedure.use(async ({ next }) => {
  const { userId } = await auth();
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: { userId },
  });
});

// AI explanation: requires userId and orgId — all tenant-owned data (voices, generations, billing) uses this.
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
