import { TextToSpeechView } from "@/features/text-to-speech/views/text-to-speech-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Text To Speech" };
export default async function TextToSpeechPage({
  searchParams,
}: {
  searchParams: Promise<{ text?: string; voiceId?: string; voiceid?: string }>;
}) {
  const params = await searchParams;
  const text = params.text;
  const voiceId = params.voiceId ?? params.voiceid;
  prefetch(trpc.voices.getAll.queryOptions());
  return (
    <HydrateClient>
      <TextToSpeechView initialValues={{ text, voiceId }} />
    </HydrateClient>
  );
}
