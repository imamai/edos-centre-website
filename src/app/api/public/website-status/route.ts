import { NextRequest, NextResponse } from "next/server";
import { getPublicWebsiteStatus } from "@/lib/website-status";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * Public status endpoint the other managed client sites (jemvoyage, kida,
 * margaret, mejasan, ...) poll from their own layout/middleware so a
 * suspend/maintenance toggle in edoscentreadmin_websites actually takes their
 * site down instead of only updating a row nobody reads. Deliberately open
 * (CORS *, no auth) — it exposes nothing beyond status/message/return time,
 * and every client site must be able to fail open if this is unreachable.
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400, headers: CORS_HEADERS });
  }

  const allowed = await checkRateLimit("website-status", getClientIp(req), 240, 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: CORS_HEADERS });
  }

  const site = await getPublicWebsiteStatus(slug);

  return NextResponse.json(
    {
      status: site?.status ?? "active",
      status_message: site?.status_message ?? null,
      maintenance_return_at: site?.maintenance_return_at ?? null,
    },
    { headers: { ...CORS_HEADERS, "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } },
  );
}
