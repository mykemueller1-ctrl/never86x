import { NextRequest, NextResponse } from "next/server";
import { finishLogin } from "@/lib/loginFlow";
import { signSession } from "@/lib/seatAuth";
import { authSecret } from "@/lib/loginFlow";
import { SESSION_COOKIE, sessionCookie } from "@/lib/sessionCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const finished = await finishLogin({
    token: body.token ? String(body.token) : undefined,
    email: body.email ? String(body.email) : undefined,
    code: body.code ? String(body.code) : undefined,
  });
  if (!finished.ok) return NextResponse.json(finished, { status: 400 });
  const secret = authSecret();
  if (!secret) return NextResponse.json({ ok: false, reason: "Sign-in is not configured on this preview." }, { status: 400 });
  const res = NextResponse.json({
    ok: true,
    email: finished.signup.email,
    name: finished.signup.name,
    restaurant: finished.signup.restaurant,
    checks: finished.signup.checks,
    draft: finished.draft,
  });
  res.cookies.set(SESSION_COOKIE, signSession(finished.signup.email, secret), sessionCookie());
  return res;
}
