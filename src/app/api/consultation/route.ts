import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      full_name, email, phone, organization, role_title,
      project_summary, budget_range, preferred_date, preferred_time,
      source_page,
    } = body;

    if (!full_name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { error } = await supabase
      .schema("website")
      .from("consultation_bookings")
      .insert({
        full_name:       full_name.trim(),
        email:           email.toLowerCase().trim(),
        phone:           phone            || null,
        organization:    organization     || null,
        role_title:      role_title       || null,
        project_summary: project_summary  || null,
        budget_range:    budget_range     || null,
        preferred_date:  preferred_date   || null,
        preferred_time:  preferred_time   || null,
        source_page:     source_page || req.headers.get("referer") || null,
        utm_source:      body.utm_source   || null,
        utm_medium:      body.utm_medium   || null,
        utm_campaign:    body.utm_campaign || null,
      });

    if (error) {
      console.error("[consultation-route] db error:", error.message);
      return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[consultation-route] error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
