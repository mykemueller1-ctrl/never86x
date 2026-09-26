import { NextRequest, NextResponse } from "next/server";
import { authSecret } from "@/lib/loginFlow";
import { signSession } from "@/lib/seatAuth";
import { activateSignup, persistSignup } from "@/lib/signups";
import { emptyDraft } from "@/lib/draft";
import { signupSource } from "@/lib/seatAuth";
import { SESSION_COOKIE, sessionCookie } from "@/lib/sessionCookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const back = new URL("/seat", req.nextUrl.origin);
  const secret = authSecret();
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const code = req.nextUrl.searchParams.get("code") || "";
  const state = req.nextUrl.searchParams.get("state") || "";
  const expected = req.cookies.get("seat_google_state")?.value || "";
  if (!secret || !clientId || !clientSecret || !code || !state || state !== expected) {
    back.searchParams.set("auth", "error");
    return NextResponse.redirect(back);
  }
  const redirectUri = new URL("/api/auth/google/callback", req.nextUrl.origin).toString();
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const token = await tokenRes.json().catch(() => ({}));
  const access = typeof token.access_token === "string" ? token.access_token : "";
  if (!access) {
    back.searchParams.set("auth", "error");
    return NextResponse.redirect(back);
  }
  const profileRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${access}` },
  });
  const profile = await profileRes.json().catch(() => ({}));
  const email = typeof profile.email === "string" ? profile.email.trim().toLowerCase() : "";
  if (!email) {
    back.searchParams.set("auth", "error");
    return NextResponse.redirect(back);
  }
  const name = typeof profile.name === "string" ? profile.name : null;
  await persistSignup({
    email,
    name,
    restaurant: null,
    source: signupSource(req.nextUrl.searchParams.get("utm_source"), null),
    checks: [],
    secret,
    draft: emptyDraft(),
  });
  await activateSignup(email);
  const res = NextResponse.redirect(back);
  res.cookies.set(SESSION_COOKIE, signSession(email, secret), sessionCookie());
  res.cookies.set("seat_google_state", "", { path: "/", maxAge: 0 });
  return res;
}
