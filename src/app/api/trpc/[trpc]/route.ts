// tRPC Fetch Adapter Route.
// Bridges standard HTTP requests to the tRPC AppRouter.
// Provides the context (including authentication state) to all downstream procedures.
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
