// Browser tRPC + React Query provider; singleton query client avoids duplicate clients on suspense.
"use client";
// "use client" allows this provider to be imported from server components such as root layout.tsx.
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === "undefined") {
    // each RSC request gets a fresh QueryClient on the server.
    return makeQueryClient();
  }
  // reuse one browser QueryClient so React suspense during first paint does not create duplicates.
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
function getUrl() {
  // browser should always use relative URL
  if (typeof window !== "undefined") {
    return "/api/trpc";
  }

  const appUrl = process.env.APP_URL ?? process.env.VERCEL_URL;

  if (!appUrl) {
    return "http://localhost:3000/api/trpc";
  }

  const normalized = appUrl.startsWith("http://") ||
    appUrl.startsWith("https://")
    ? appUrl
    : `https://${appUrl}`;

  return `${normalized}/api/trpc`;
}
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
