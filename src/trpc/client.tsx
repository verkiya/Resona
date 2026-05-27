// Client-side tRPC + React Query provider with a singleton browser query client.
"use client";
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
    // Each RSC request gets a fresh QueryClient on the server.
    return makeQueryClient();
  }
  // Reuse one browser QueryClient so suspense does not create duplicates.
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
function getUrl() {
  // Browser should always use the relative URL.
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
