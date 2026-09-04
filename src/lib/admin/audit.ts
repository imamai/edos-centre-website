import "server-only";
import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

export async function logAudit(params: {
  actorId: string | null;
  action: string;
  websiteId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createServiceClient();
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  const { error } = await supabase.from("edoscentreadmin_audit_logs").insert({
    actor_id: params.actorId,
    action: params.action,
    website_id: params.websiteId ?? null,
    metadata: (params.metadata ?? {}) as Json,
    ip_address: ip,
  });
  if (error) console.error("logAudit failed:", error.message);
}
