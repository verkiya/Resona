// AI explanation: Root tRPC router merging voices, generations, and billing sub-routers.
import {  createTRPCRouter } from "../init";
import { voicesRouter } from "./voices";
import { generationsRouter } from "./generations";
import { billingRouter } from "./billing";
export const appRouter = createTRPCRouter({
  voices: voicesRouter,
  generations: generationsRouter,
  billing: billingRouter,
});
// AI explanation: AppRouter type is inferred from the merged router for client hooks and inferRouterOutputs.
export type AppRouter = typeof appRouter;
