import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";

const MAX_BYTES = 1024 * 1024 * 1024; // 1 GB sanity cap

function r2Config() {
  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET,
    R2_PUBLIC_BASE_URL,
  } = process.env;
  if (
    !R2_ACCOUNT_ID ||
    !R2_ACCESS_KEY_ID ||
    !R2_SECRET_ACCESS_KEY ||
    !R2_BUCKET ||
    !R2_PUBLIC_BASE_URL
  )
    return null;
  return {
    accountId: R2_ACCOUNT_ID,
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    bucket: R2_BUCKET,
    publicBase: R2_PUBLIC_BASE_URL.replace(/\/$/, ""),
  };
}

export async function POST(req) {
  const cfg = r2Config();
  if (!cfg) {
    const missing = [
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET",
      "R2_PUBLIC_BASE_URL",
    ].filter((k) => !process.env[k]);
    return NextResponse.json(
      { error: "R2 not configured", missing },
      { status: 501 }
    );
  }

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token)
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  // Validate the Supabase session token
  const userRes = await fetch(`${supaUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!userRes.ok)
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  const user = await userRes.json();

  // Videos are for admins (Gabby's flow)
  const profRes = await fetch(
    `${supaUrl}/rest/v1/profiles?id=eq.${user.id}&select=is_admin`,
    {
      headers: { apikey: anonKey, authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  const prof = (await profRes.json())?.[0];
  if (!prof?.is_admin)
    return NextResponse.json({ error: "Admins only" }, { status: 403 });

  const { filename = "video.mp4", contentType = "video/mp4", size = 0 } =
    await req.json().catch(() => ({}));
  if (size > MAX_BYTES)
    return NextResponse.json(
      { error: "That's over 1 GB — trim it down a touch." },
      { status: 413 }
    );
  if (!/^(video|image)\//.test(contentType))
    return NextResponse.json({ error: "Videos/images only" }, { status: 400 });

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
    // R2 + SDK v3: default integrity checksums bake an empty-body CRC32
    // into presigned URLs, which rejects real browser uploads.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  const safe = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const key = `${Date.now()}-${safe}`;
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 600 }
  );

  return NextResponse.json({
    uploadUrl,
    publicUrl: `${cfg.publicBase}/${key}`,
  });
}
