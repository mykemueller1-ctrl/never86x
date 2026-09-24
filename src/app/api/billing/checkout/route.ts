import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { writeAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const rl = rateLimit(`checkout:${ip}`, 10, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ ok: false, honesty: "Missing", reason: "rate_limited" }, { status: 429 });
  }
  writeAudit({ actor: ip, action: "billing.checkout_attempt" });
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_SEAT2) {
    return NextResponse.json(
      {
        ok: false,
        honesty: "Missing",
        reason: "Stripe not configured. Seat 1 stays free. Seats 2–3 need STRIPE_SECRET_KEY + STRIPE_PRICE_SEAT2.",
      },
      { status: 503 },
    );
  }
  return NextResponse.json(
    {
      ok: false,
      honesty: "Estimated",
      reason: "Stripe keys present but Checkout session wiring is not live in this commit.",
    },
    { status: 501 },
  );
}
