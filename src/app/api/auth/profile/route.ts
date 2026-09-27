import { NextRequest, NextResponse } from "next/server";
import { authSecret } from "@/lib/loginFlow";
import { readSession } from "@/lib/seatAuth";
import { saveProfile } from "@/lib/signups";
import { SESSION_COOKIE } from "@/lib/sessionCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = authSecret();
  const token = req.cookies.get(SESSION_COOKIE)?.value || "";
  const email = secret && token ? readSession(token, secret) : null;
  if (!email) return NextResponse.json({ ok: false, reason: "Sign in first." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const row = await saveProfile(email, {
    name: body.name === undefined ? undefined : String(body.name || "").trim() || null,
    restaurant: body.restaurant === undefined ? undefined : String(body.restaurant || "").trim() || null,
    checks: Array.isArray(body.checks) ? body.checks.map(String) : undefined,
  });
  if (!row) return NextResponse.json({ ok: false, reason: "That seat was not found." }, { status: 404 });
  return NextResponse.json({ ok: true, email: row.email, name: row.name, restaurant: row.restaurant, checks: row.checks });
}
