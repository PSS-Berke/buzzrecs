import { NextResponse } from "next/server";

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
  return NextResponse.json({ status: res.status, headers });
}
