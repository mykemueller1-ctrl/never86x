import { NextRequest, NextResponse } from "next/server";
import { seedTestStats } from "@/lib/analytics";
import { ownerFrom } from "@/lib/ownerRequest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (process.env.SEAT_DEV_SHOW_CODE !== "1") {
    return NextResponse.json({ ok: false, reason: "Missing" }, { status: 404 });
  }
  const { gate } = ownerFrom(req);
  if (!gate.ok) return NextResponse.json(gate, { status: gate.status });
  await seedTestStats();
  return NextResponse.json({ ok: true, planted: true });
}
