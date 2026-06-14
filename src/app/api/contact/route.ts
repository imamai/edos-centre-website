import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { full_name, email, phone, organization, subject, message, inquiry_type, source_page } = body;

    if (!full_name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { error } = await supabase
      .schema("website")
      .from("contact_inquiries")
      .insert({
        full_name:    full_name.trim(),
        email:        email.toLowerCase().trim(),
        phone:        phone   || null,
        organization: organization || null,
        subject:      subject || null,
        message:      message.trim(),
        inquiry_type: inquiry_type || "general",
        source_page:  source_page  || req.headers.get("referer") || null,
        ip_address:   req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
        utm_source:   body.utm_source   || null,
        utm_medium:   body.utm_medium   || null,
        utm_campaign: body.utm_campaign || null,
      });

    if (error) {
      console.error("[contact-route] db error:", error.message);
      return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact-route] error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
