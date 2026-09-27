import { NextRequest, NextResponse } from "next/server";
import { authSecret } from "@/lib/loginFlow";
import { optOut } from "@/lib/signups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = authSecret();
  if (!secret) return NextResponse.json({ ok: false, reason: "Unsubscribe is not configured." }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  const token = String(body.token || "");
  if (!token) return NextResponse.json({ ok: false, reason: "Missing unsubscribe link." }, { status: 400 });
  const ok = await optOut(token, secret);
  if (!ok) return NextResponse.json({ ok: false, reason: "That unsubscribe link is not valid." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
