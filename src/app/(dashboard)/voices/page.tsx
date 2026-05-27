// Voices RSC entry: parses URL search params, prefetches voices into the tRPC cache, and hydrates the client view.
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import { prefetch, trpc, HydrateClient } from "@/trpc/server";

import { VoicesView } from "@/features/voices/views/voices-view";
import { voicesSearchParamsCache } from "@/features/voices/lib/params";

export const metadata: Metadata = { title: "Voices" };

export default async function VoicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { query } = await voicesSearchParamsCache.parse(searchParams);

  prefetch(trpc.voices.getAll.queryOptions({ query }));

  return (
    <HydrateClient>
      <VoicesView />
    </HydrateClient>
  );
}
