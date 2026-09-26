import { NextRequest, NextResponse } from "next/server";
import { ownerDashboard } from "@/lib/analytics";
import { ownerFrom } from "@/lib/ownerRequest";
import { STATS_ZONE } from "@/lib/ownerStats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { gate } = ownerFrom(req);
  if (!gate.ok) return NextResponse.json(gate, { status: gate.status });
  const board = await ownerDashboard();
  return NextResponse.json({ ok: true, zone: STATS_ZONE, ...board });
}
