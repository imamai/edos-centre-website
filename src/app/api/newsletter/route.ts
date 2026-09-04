import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const allowed = await checkRateLimit("newsletter", getClientIp(req), 10, 3600);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { email, full_name, source } = body;

    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return NextResponse.json({ error: "Invalid email." }, { status: 400 });

    const supabase = await createServiceClient();

    const { error } = await supabase
      .schema("public")
      .from("edoscentre_newsletter_subscribers")
      .upsert(
        {
          email:      email.toLowerCase().trim(),
          full_name:  full_name || null,
          source:     source    || "footer",
          status:     "active",
        },
        { onConflict: "email", ignoreDuplicates: false },
      );

    if (error) {
      console.error("[newsletter-route] db error:", error.message);
      return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[newsletter-route] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
