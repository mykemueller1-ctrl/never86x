import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookie } from "@/lib/sessionCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookie(), maxAge: 0 });
  return res;
}
