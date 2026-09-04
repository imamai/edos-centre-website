import { NextRequest, NextResponse } from "next/server";
import { runAutomationSweep } from "@/lib/admin/automation";

/**
 * Cron-triggered entry point for the automation sweep. Not wired to any scheduler
 * by this codebase — point an external cron (Vercel Cron, GitHub Actions schedule,
 * cron-job.org, etc.) at this URL with `Authorization: Bearer $CRON_SECRET` to run
 * it on a schedule. Until CRON_SECRET is set in the environment, this route refuses
 * every request rather than running unauthenticated.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await runAutomationSweep();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[cron-sweep] error:", err);
    return NextResponse.json({ error: "Sweep failed." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
