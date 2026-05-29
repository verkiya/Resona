// Authenticated Audio Proxy Route.
// Enforces organization-level ownership before serving generated TTS audio.
// Streams the binary payload directly from S3 via a short-lived presigned URL 
// to prevent public exposure of the underlying object key.
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getSignedAudioUrl } from "@/lib/aws_s3";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ generationId: string }> },
) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { generationId } = await params;

  const generation = await prisma.generation.findUnique({
    where: { id: generationId, orgId },
  });

  if (!generation) {
    return new Response("Not found", { status: 404 });
  }

  if (!generation.objectKey) {
    return new Response("Audio is not available yet", { status: 409 });
  }

  const signedUrl = await getSignedAudioUrl(generation.objectKey);
  const audioResponse = await fetch(signedUrl);

  if (!audioResponse.ok) {
    return new Response("Failed to fetch audio", { status: 502 });
  }

  return new Response(audioResponse.body, {
    headers: {
      "Content-Type": "audio/wav",
      // Use private caching because generated audio is strictly scoped to the requesting organization.
      // Shared caches (like CDNs) must never cache this response.
      "Cache-Control": "private, max-age=3600",
    },
  });
}
