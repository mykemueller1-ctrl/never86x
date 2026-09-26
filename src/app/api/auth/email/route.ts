import { NextRequest, NextResponse } from "next/server";
import { startEmailLogin } from "@/lib/loginFlow";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "");
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const limited = rateLimit(`seat-email:${email.toLowerCase()}:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, reason: "Wait a few minutes, then ask for another link." }, { status: 429 });
  }
  const started = await startEmailLogin({
    email,
    consent: body.consent === true,
    name: body.name ? String(body.name) : null,
    restaurant: body.restaurant ? String(body.restaurant) : null,
    utm: body.utm ? String(body.utm) : null,
    ref: body.ref ? String(body.ref) : null,
    checks: Array.isArray(body.checks) ? body.checks.map(String) : [],
    draft: body.draft && typeof body.draft === "object" ? body.draft : null,
    origin: req.nextUrl.origin,
  });
  if (!started.ok) return NextResponse.json(started, { status: 400 });
  return NextResponse.json({
    ok: true,
    sent: started.sent,
    email: started.email,
    ...(started.devCode ? { devCode: started.devCode } : {}),
    reason: started.sent ? null : "The sign-in email is not connected on this preview. Your address was saved.",
  });
}
