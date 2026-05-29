// Voice Creation API Route.
// Handles the multipart file upload for custom voice cloning.
// 1. Verifies the organization has an active paid subscription.
// 2. Validates audio metadata (format and duration) via music-metadata.
// 3. Streams the audio buffer to S3.
// 4. Emits a billing telemetry event for the successful creation.
import { auth } from "@clerk/nextjs/server";
import { parseBuffer } from "music-metadata";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { uploadAudio } from "@/lib/aws_s3";
import { VOICE_CATEGORIES } from "@/features/voices/data/voice-categories";
import type { VoiceCategory } from "@/generated/prisma/client";
import { polar } from "@/lib/polar";
const createVoiceSchema = z.object({
  name: z.string().min(1, "Voice name is required"),
  category: z.enum(VOICE_CATEGORIES as [VoiceCategory, ...VoiceCategory[]]),
  language: z.string().min(1, "Language is required"),
  description: z.string().nullish(),
});

const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const MIN_AUDIO_DURATION_SECONDS = 5;

export async function POST(request: Request) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Premium Feature Guard: Voice cloning requires an active subscription.
  try {
    const customerState = await polar.customers.getStateExternal({
      externalId: orgId,
    });
    const hasActiveSubscription =
      (customerState.activeSubscriptions ?? []).length > 0;
    if (!hasActiveSubscription) {
      return Response.json({ error: "SUBSCRIPTION_REQUIRED" }, { status: 403 });
    }
  } catch {
    // If the org hasn't created a checkout session yet, the Polar customer API will throw an error.
    // We treat this missing customer state gracefully as an unsubscribed org.
    return Response.json({ error: "SUBSCRIPTION_REQUIRED" }, { status: 403 });
  }
  const url = new URL(request.url);

  const validation = createVoiceSchema.safeParse({
    name: url.searchParams.get("name"),
    category: url.searchParams.get("category"),
    language: url.searchParams.get("language"),
    description: url.searchParams.get("description"),
  });

  if (!validation.success) {
    return Response.json(
      {
        error: "Invalid input",
        issues: validation.error.issues,
      },
      { status: 400 },
    );
  }

  const { name, category, language, description } = validation.data;

  const fileBuffer = await request.arrayBuffer();

  if (!fileBuffer.byteLength) {
    return Response.json(
      { error: "Please upload an audio file" },
      { status: 400 },
    );
  }

  if (fileBuffer.byteLength > MAX_UPLOAD_SIZE_BYTES) {
    return Response.json(
      { error: "Audio file exceeds the 20 MB size limit" },
      { status: 413 },
    );
  }

  const contentType = request.headers.get("content-type");

  if (!contentType) {
    return Response.json(
      { error: "Missing Content-Type header" },
      { status: 400 },
    );
  }

  const normalizedContentType =
    contentType.split(";")[0]?.trim() || "audio/wav";

  // We parse the audio buffer locally before S3 upload to ensure:
  // 1. It's actually a valid audio file (rejects renamed binaries).
  // 2. The sample is long enough for the cloning model to extract a viable speaker embedding.
  let duration: number;
  try {
    const metadata = await parseBuffer(
      new Uint8Array(fileBuffer),
      { mimeType: normalizedContentType },
      { duration: true },
    );
    duration = metadata.format.duration ?? 0;
  } catch {
    return Response.json(
      { error: "File is not a valid audio file" },
      { status: 422 },
    );
  }

  if (duration < MIN_AUDIO_DURATION_SECONDS) {
    return Response.json(
      {
        error: `Audio too short (${duration.toFixed(1)}s). Minimum duration is ${MIN_AUDIO_DURATION_SECONDS} seconds.`,
      },
      { status: 422 },
    );
  }

  let createdVoiceId: string | null = null;

  try {
    const voice = await prisma.voice.create({
      data: {
        name,
        variant: "CUSTOM",
        orgId,
        description,
        category,
        language,
      },
      select: {
        id: true,
      },
    });

    createdVoiceId = voice.id;
    const objectKey = `voices/orgs/${orgId}/${voice.id}`;

    await uploadAudio({
      buffer: Buffer.from(fileBuffer),
      key: objectKey,
      contentType: normalizedContentType,
    });

    await prisma.voice.update({
      where: {
        id: voice.id,
      },
      data: {
        objectKey,
      },
    });
  } catch {
    if (createdVoiceId) {
      // S3 upload or final DB update failed.
      // Roll back the initial DB insert to prevent dangling records where the UI shows a voice that cannot be previewed or used.
      await prisma.voice
        .delete({
          where: {
            id: createdVoiceId,
          },
        })
        .catch(() => {});
    }

    return Response.json(
      { error: "Failed to create voice. Please retry." },
      { status: 500 },
    );
  }
  // Billing Telemetry:
  // We emit the `voice_creation` event asynchronously. 
  // Network failures reaching Polar must not fail the entire API request.
  polar.events
    .ingest({
      events: [
        {
          name: "voice_creation",
          externalCustomerId: orgId,
          metadata: {},
          timestamp: new Date(),
        },
      ],
    })
    .catch(() => {
      // Metering failures are intentionally ignored to avoid blocking the user flow.
    });
  return Response.json(
    { name, message: "Voice created successfully" },
    { status: 201 },
  );
}
