// tRPC Fetch Adapter Route.
// Bridges standard HTTP requests to the tRPC AppRouter.
// Uses a lightweight request context; Clerk auth is resolved inside protected procedures.
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

 
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
 
export { handler as GET, handler as POST };
