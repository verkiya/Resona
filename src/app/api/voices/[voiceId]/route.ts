// Authenticated Voice Preview Proxy Route.
// Streams voice sample audio from S3.
// Enforces dual-mode access control:
// - `SYSTEM` voices are globally accessible.
// - `CUSTOM` voices enforce strict org-level ownership matching.
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getSignedAudioUrl } from "@/lib/aws_s3";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ voiceId: string }> },
) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { voiceId } = await params;

  const voice = await prisma.voice.findUnique({
    where: { id: voiceId },
    select: {
      variant: true,
      orgId: true,
      objectKey: true,
    },
  });

  if (!voice) {
    return new Response("Not found", { status: 404 });
  }

  if (voice.variant === "CUSTOM" && voice.orgId !== orgId) {
    return new Response("Not found", { status: 404 });
  }

  if (!voice.objectKey) {
    return new Response("Voice audio is not available yet", { status: 409 });
  }

  const signedUrl = await getSignedAudioUrl(voice.objectKey);
  const audioResponse = await fetch(signedUrl);

  if (!audioResponse.ok) {
    return new Response("Failed to fetch voice audio", { status: 502 });
  }

  const contentType = audioResponse.headers.get("content-type") || "audio/wav";

  return new Response(audioResponse.body, {
    headers: {
      "Content-Type": contentType,
      // Differential Caching Strategy:
      // System voices are immutable and public, so they can be aggressively cached by the CDN.
      // Custom voices are private to the org, so they must use a `private` cache control.
      "Cache-Control":
        voice.variant === "SYSTEM"
          ? "public, max-age=86400"
          : "private, max-age=3600",
    },
  });
}
