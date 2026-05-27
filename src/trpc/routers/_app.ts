// Root tRPC router — voices (catalog), generations (TTS + S3), billing (Polar).
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
