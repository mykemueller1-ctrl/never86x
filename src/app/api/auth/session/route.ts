import { NextRequest, NextResponse } from "next/server";
import { authSecret } from "@/lib/loginFlow";
import { readSession } from "@/lib/seatAuth";
import { allSignups } from "@/lib/signups";
import { SESSION_COOKIE } from "@/lib/sessionCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = authSecret();
  const token = req.cookies.get(SESSION_COOKIE)?.value || "";
  const email = secret && token ? readSession(token, secret) : null;
  if (!email) return NextResponse.json({ ok: true, email: null });
  const rows = await allSignups();
  const row = rows.find((item) => item.email === email) || null;
  return NextResponse.json({
    ok: true,
    email,
    name: row?.name ?? null,
    restaurant: row?.restaurant ?? null,
    checks: row?.checks ?? [],
  });
}
