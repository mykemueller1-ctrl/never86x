import { NextRequest, NextResponse } from "next/server";
import { newToken } from "@/lib/seatAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ ok: false, reason: "Google sign-in is not configured." }, { status: 404 });
  }
  if (req.nextUrl.searchParams.get("consent") !== "1") {
    return NextResponse.redirect(new URL("/seat?auth=consent", req.nextUrl.origin));
  }
  const state = newToken();
  const redirectUri = new URL("/api/auth/google/callback", req.nextUrl.origin).toString();
  const google = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  google.searchParams.set("client_id", clientId);
  google.searchParams.set("redirect_uri", redirectUri);
  google.searchParams.set("response_type", "code");
  google.searchParams.set("scope", "openid email profile");
  google.searchParams.set("state", state);
  google.searchParams.set("prompt", "select_account");
  const res = NextResponse.redirect(google);
  res.cookies.set("seat_google_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return res;
}
