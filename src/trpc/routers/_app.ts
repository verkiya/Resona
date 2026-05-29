// Root tRPC Router.
// Combines all domain-specific routers into a single API surface.
// The exported `AppRouter` type acts as the single source of truth for all client-side API typings.
import { createTRPCRouter } from "../init";
import { voicesRouter } from "./voices";
import { generationsRouter } from "./generations";
import { billingRouter } from "./billing";
export const appRouter = createTRPCRouter({
  voices: voicesRouter,
  generations: generationsRouter,
  billing: billingRouter,
});
// AppRouter type powers useTRPC() and inferRouterOutputs across the frontend.
export type AppRouter = typeof appRouter;
