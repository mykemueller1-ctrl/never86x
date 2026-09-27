import { NextRequest, NextResponse } from "next/server";
import { readOrCreateVisitor, recordEvent, setVisitorCookie } from "@/lib/analytics";
import { userAgentClass } from "@/lib/embedded";
import { rateLimit } from "@/lib/rateLimit";
import { readSession } from "@/lib/seatAuth";
import { authSecret } from "@/lib/loginFlow";
import { SESSION_COOKIE } from "@/lib/sessionCookie";
import type { EventName } from "@/lib/ownerStats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CLIENT_EVENTS = new Set<EventName>(["link_open", "check_start", "check_complete"]);

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const limited = rateLimit(`seat-event:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, reason: "Slow down a moment." }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "") as EventName;
  if (!CLIENT_EVENTS.has(name)) {
    return NextResponse.json({ ok: false, reason: "That count is recorded by the seat itself." }, { status: 400 });
  }
  const detail = body.detail === "sample" || body.detail === "own" ? body.detail : null;
  if ((name === "check_start" || name === "check_complete") && !detail) {
    return NextResponse.json({ ok: false, reason: "Say whether the check is the sample or your own papers." }, { status: 400 });
  }
  const visitor = readOrCreateVisitor(req);
  const secret = authSecret();
  const session = req.cookies.get(SESSION_COOKIE)?.value || "";
  const email = secret && session ? readSession(session, secret) : null;
  const recorded = await recordEvent({
    name,
    visitorId: visitor.id,
    email,
    source: body.source ? String(body.source) : "x",
    uaClass: userAgentClass(req.headers.get("user-agent") || ""),
    detail,
    ip,
  });
  const res = NextResponse.json({ ok: true, recorded: recorded.recorded });
  if (visitor.fresh) setVisitorCookie(res, visitor.id);
  return res;
}
