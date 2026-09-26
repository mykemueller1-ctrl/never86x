import { NextRequest, NextResponse } from "next/server";
import { readOrCreateVisitor, recordEvent, setVisitorCookie } from "@/lib/analytics";
import { userAgentClass } from "@/lib/embedded";
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
  const visitor = readOrCreateVisitor(req);
  const uaClass = userAgentClass(req.headers.get("user-agent") || "");
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  await recordEvent({
    name: "login_success",
    visitorId: visitor.id,
    email: finished.signup.email,
    source: finished.signup.source,
    uaClass,
    ip,
  });
  if (finished.firstSeat) {
    await recordEvent({
      name: "seat_claimed",
      visitorId: visitor.id,
      email: finished.signup.email,
      source: finished.signup.source,
      uaClass,
      ip,
    });
  }
  const res = NextResponse.json({
    ok: true,
    email: finished.signup.email,
    name: finished.signup.name,
    restaurant: finished.signup.restaurant,
    checks: finished.signup.checks,
    draft: finished.draft,
  });
  res.cookies.set(SESSION_COOKIE, signSession(finished.signup.email, secret), sessionCookie());
  if (visitor.fresh) setVisitorCookie(res, visitor.id);
  return res;
}
