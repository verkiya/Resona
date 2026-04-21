import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

type UploadAudioOptions = {
  buffer: Buffer;
  key: string;
  contentType?: string;
};

function validateKey(key: string) {
  if (!key || key.includes("..")) {
    throw new Error("Invalid key");
  }
}

export async function uploadAudio({
  buffer,
  key,
  contentType = "audio/wav",
}: UploadAudioOptions): Promise<void> {
  validateKey(key);

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ContentDisposition: "inline",
        CacheControl: "public, max-age=3600",
      }),
    );
  } catch (error) {
    console.error("S3 upload failed", error);
    throw new Error("Failed to upload audio");
  }
}

export async function deleteAudio(key: string): Promise<void> {
  validateKey(key);

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
      }),
    );
  } catch (error) {
    console.error("S3 delete failed", error);
    throw new Error("Failed to delete audio");
  }
}

export async function getSignedAudioUrl(key: string): Promise<string> {
  validateKey(key);

  try {
    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: "inline",
      ResponseCacheControl: "public, max-age=3600",
    });

    return getSignedUrl(s3, command, { expiresIn: 3600 });
  } catch (error) {
    console.error("S3 signed URL failed", error);
    throw new Error("Failed to generate signed URL");
  }
}
