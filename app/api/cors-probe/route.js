import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Temporary diagnostic: replays the browser's CORS preflight against R2
// server-side so we can read the response headers. Remove after debugging.
export async function GET() {
  const url = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/probe`;
  const res = await fetch(url, {
    method: "OPTIONS",
    headers: {
      Origin: "https://buzzrecs.vercel.app",
      "Access-Control-Request-Method": "PUT",
      "Access-Control-Request-Headers": "content-type",
    },
  });
  const headers = {};
  res.headers.forEach((v, k) => (headers[k] = v));

  // Presigned PUT for a fixed, harmless test key so the browser can
  // exercise the real signed-upload path. Temporary; remove after debugging.
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  const testUploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: "cors-probe-test.txt",
      ContentType: "text/plain",
    }),
    { expiresIn: 300 }
  );

  return NextResponse.json({ status: res.status, headers, testUploadUrl });
}
