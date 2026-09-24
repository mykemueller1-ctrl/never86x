import { NextRequest, NextResponse } from "next/server";
import { listAudit, writeAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminOk(req: NextRequest) {
  const emails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!emails.length) return false;
  const header = (req.headers.get("x-admin-email") || "").toLowerCase();
  return emails.includes(header);
}

export async function GET(req: NextRequest) {
  if (!adminOk(req)) {
    return NextResponse.json(
      { ok: false, honesty: "Missing", reason: "ADMIN_EMAILS + x-admin-email required" },
      { status: 401 },
    );
  }
  return NextResponse.json({ ok: true, events: listAudit(100) });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const row = writeAudit({
    actor: String(body.actor || "anonymous"),
    action: String(body.action || "unknown"),
    target: body.target ? String(body.target) : undefined,
    meta: typeof body.meta === "object" ? body.meta : undefined,
  });
  return NextResponse.json({ ok: true, event: row });
}
