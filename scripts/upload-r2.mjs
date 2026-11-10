/**
 * Sube un archivo grande a R2 usando multipart upload.
 *
 * Uso:
 *   infisical run -- node scripts/upload-r2.mjs <archivo> <key> [content-type]
 *
 * Ejemplo:
 *   infisical run -- node scripts/upload-r2.mjs ./Minijusticia.mp4 media/minijusticia.mp4 video/mp4
 *
 * Variables requeridas: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 */
import { createReadStream, statSync } from "node:fs";
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";

const PART_SIZE = 16 * 1024 * 1024; // 16 MiB
const MAX_RETRIES = 3;

const [filePath, key, contentType = "application/octet-stream"] =
  process.argv.slice(2);

if (!filePath || !key) {
  console.error(
    "Uso: node scripts/upload-r2.mjs <archivo> <key> [content-type]"
  );
  process.exit(1);
}

const accountId = process.env.R2_ACCOUNT_ID;
const bucket = process.env.R2_BUCKET;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!accountId || !bucket || !accessKeyId || !secretAccessKey) {
  console.error(
    "Faltan variables: R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY"
  );
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
  // Evita checksums automáticos que algunos proveedores S3-compatibles rechazan.
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const { size } = statSync(filePath);
const totalParts = Math.ceil(size / PART_SIZE);

console.log(
  `Subiendo ${filePath} (${(size / 1024 / 1024).toFixed(1)} MB) como "${key}" en ${bucket} — ${totalParts} partes`
);

const { UploadId } = await client.send(
  new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  })
);

if (!UploadId) throw new Error("R2 no devolvió UploadId");

const started = Date.now();
const parts = [];

try {
  for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
    const start = (partNumber - 1) * PART_SIZE;
    const end = Math.min(start + PART_SIZE, size);

    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await client.send(
          new UploadPartCommand({
            Bucket: bucket,
            Key: key,
            UploadId,
            PartNumber: partNumber,
            ContentLength: end - start,
            Body: createReadStream(filePath, { start, end: end - 1 }),
          })
        );
        parts.push({ PartNumber: partNumber, ETag: result.ETag });
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error;
        console.warn(
          `  parte ${partNumber} falló (intento ${attempt}/${MAX_RETRIES}): ${error.message}`
        );
      }
    }
    if (lastError) throw lastError;

    const done = end / 1024 / 1024;
    const elapsed = (Date.now() - started) / 1000;
    const rate = done / elapsed;
    console.log(
      `  ${partNumber}/${totalParts} · ${done.toFixed(0)} MB · ${rate.toFixed(1)} MB/s`
    );
  }

  await client.send(
    new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId,
      MultipartUpload: { Parts: parts },
    })
  );
} catch (error) {
  await client
    .send(
      new AbortMultipartUploadCommand({ Bucket: bucket, Key: key, UploadId })
    )
    .catch(() => {});
  throw error;
}

console.log(`Listo en ${((Date.now() - started) / 1000).toFixed(0)}s: ${key}`);
