import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    ok: true,
    service: "never86x",
    time: new Date().toISOString(),
    auth: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET ? "configured" : "missing",
    stripe: process.env.STRIPE_SECRET_KEY ? "configured" : "missing",
    sentry: process.env.SENTRY_DSN ? "configured" : "missing",
    database: process.env.DATABASE_URL ? "configured" : "missing",
  };
  return NextResponse.json(checks, { status: 200 });
}
