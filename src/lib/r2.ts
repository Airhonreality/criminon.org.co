import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const bucket = process.env.R2_BUCKET;
const publicBase = process.env.R2_PUBLIC_URL?.trim().replace(/\/+$/, "");

let client: S3Client | null = null;

function getClient(): S3Client {
  if (
    !accountId ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY
  ) {
    throw new Error(
      "Faltan credenciales S3 de R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)"
    );
  }
  if (!bucket) {
    throw new Error("Falta R2_BUCKET");
  }
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  return client;
}

/** Convierte una key de R2 en su URL pública. */
export function r2PublicUrl(key: string): string {
  const encoded = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${publicBase ?? ""}/${encoded}`;
}

/** Recupera la key a partir de una URL pública (o null si no pertenece al bucket). */
export function keyFromPublicUrl(url: string): string | null {
  if (!publicBase || !url.startsWith(`${publicBase}/`)) return null;
  return decodeURIComponent(url.slice(publicBase.length + 1));
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^\w.\-]+/g, "_").replace(/^_+/, "").slice(-120) || "adjunto";
}

export interface UploadTarget {
  key: string;
  uploadUrl: string;
  publicUrl: string;
  filename: string;
  contentType?: string;
}

/**
 * Genera una URL prefirmada (PUT) para que el navegador suba el archivo
 * directamente a R2, sin pasar por el límite de tamaño de Vercel.
 */
export async function createUploadTarget({
  filename,
  contentType,
}: {
  filename: string;
  contentType?: string;
}): Promise<UploadTarget> {
  const date = new Date().toISOString().slice(0, 10);
  const key = `outbound/${date}/${crypto.randomUUID()}-${sanitizeFilename(
    filename
  )}`;

  const uploadUrl = await getSignedUrl(
    getClient(),
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 900 }
  );

  return { key, uploadUrl, publicUrl: r2PublicUrl(key), filename, contentType };
}

export async function deleteR2Object(key: string): Promise<void> {
  await getClient().send(
    new DeleteObjectCommand({ Bucket: bucket, Key: key })
  );
}
