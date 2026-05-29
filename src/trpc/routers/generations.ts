// TTS Generation tRPC Router.
// Orchestrates the multi-step voice synthesis pipeline:
// 1. Validates org subscription status.
// 2. Invokes the FastAPI/Modal Chatterbox TTS inference.
// 3. Implements a two-phase write pattern (create DB row -> upload to S3 -> update DB).
// 4. Handles rollback if S3 upload fails.
// 5. Emits fire-and-forget billing telemetry to Polar.
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { chatterbox } from "@/lib/chatterbox-client";
import * as Sentry from "@sentry/node";
import { prisma } from "@/lib/db";
import { polar } from "@/lib/polar";
import { uploadAudio } from "@/lib/aws_s3";
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { createTRPCRouter, orgProcedure } from "../init";

export const generationsRouter = createTRPCRouter({
  getById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const generation = await prisma.generation.findUnique({
        where: { id: input.id, orgId: ctx.orgId },
        omit: {
          orgId: true,
          objectKey: true,
        },
      });

      if (!generation) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        ...generation,
        // Route audio playback through the proxy to enforce auth checks,
        // preventing unauthorized access to the underlying S3 object key.
        audioUrl: `/api/audio/${generation.id}`,
      };
    }),

  getAll: orgProcedure.query(async ({ ctx }) => {
    const generations = await prisma.generation.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "desc" },
      omit: {
        orgId: true,
        objectKey: true,
      },
    });

    return generations;
  }),

  create: orgProcedure
    .input(
      z.object({
        text: z.string().min(1).max(TEXT_MAX_LENGTH),
        voiceId: z.string().min(1),
        temperature: z.number().min(0).max(2).default(0.8),
        topP: z.number().min(0).max(1).default(0.95),
        topK: z.number().min(1).max(10000).default(1000),
        repetitionPenalty: z.number().min(1).max(2).default(1.2),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Gate text-to-speech generation behind an active organization subscription.
      try {
        const customerState = await polar.customers.getStateExternal({
          externalId: ctx.orgId,
        });
        const hasActiveSubscription =
          (customerState.activeSubscriptions ?? []).length > 0;
        if (!hasActiveSubscription) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "SUBSCRIPTION_REQUIRED",
          });
        }
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        // A missing Polar customer record means the org has never checked out.
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "SUBSCRIPTION_REQUIRED",
        });
      }
      const voice = await prisma.voice.findUnique({
        where: {
          id: input.voiceId,
          OR: [{ variant: "SYSTEM" }, { variant: "CUSTOM", orgId: ctx.orgId }],
        },
        select: {
          id: true,
          name: true,
          objectKey: true,
        },
      });

      if (!voice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voice not found",
        });
      }

      if (!voice.objectKey) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Voice audio not available",
        });
      }

      const { data, error } = await chatterbox.POST("/generate", {
        body: {
          prompt: input.text,
          voice_key: voice.objectKey,
          temperature: input.temperature,
          top_p: input.topP,
          top_k: input.topK,
          repetition_penalty: input.repetitionPenalty,
          norm_loudness: true,
        },
        parseAs: "arrayBuffer",
      });
      Sentry.logger.info("Generation started", {
        orgId: ctx.orgId,
        voiceId: input.voiceId,
        textLength: input.text.length,
      });

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate audio",
        });
      }

      if (!(data instanceof ArrayBuffer)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid audio response",
        });
      }

      const buffer = Buffer.from(data);
      let generationId: string | null = null;
      let objectKey: string | null = null;

      try {
        const generation = await prisma.generation.create({
          data: {
            orgId: ctx.orgId,
            text: input.text,
            voiceName: voice.name,
            voiceId: voice.id,
            temperature: input.temperature,
            topP: input.topP,
            topK: input.topK,
            repetitionPenalty: input.repetitionPenalty,
          },
          select: {
            id: true,
          },
        });

        generationId = generation.id;
        objectKey = `generations/orgs/${ctx.orgId}/${generation.id}`;

        await uploadAudio({ buffer, key: objectKey });

        await prisma.generation.update({
          where: {
            id: generation.id,
          },
          data: {
            objectKey,
          },
        });
        Sentry.logger.info("Audio generated", {
          orgId: ctx.orgId,
          generationId: generation.id,
        });
      } catch {
        if (generationId) {
          // Rollback: If the S3 upload fails after the DB record is created, 
          // delete the orphaned row so the UI never displays a broken generation.
          await prisma.generation
            .delete({
              where: {
                id: generationId,
              },
            })
            .catch(() => {});
        }
        Sentry.logger.error("Generation failed", {
          orgId: ctx.orgId,
          voiceId: input.voiceId,
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to store generated audio",
        });
      }

      if (!generationId || !objectKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to store generated audio",
        });
      }

      // Fire-and-forget telemetry:
      // Ingesting usage events into Polar must never block or fail the client's generation request.
      polar.events
        .ingest({
          events: [
            {
              name: "tts_generation",
              externalCustomerId: ctx.orgId,
              metadata: { characters: input.text.length },
              timestamp: new Date(),
            },
          ],
        })
        .catch(() => {
          // Intentionally swallow telemetry errors. 
          // Billing accuracy is secondary to user experience in the critical generation path.
        });
      return {
        id: generationId,
      };
    }),
});
