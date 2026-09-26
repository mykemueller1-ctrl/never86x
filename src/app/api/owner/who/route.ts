import { NextRequest, NextResponse } from "next/server";
import { ownerFrom } from "@/lib/ownerRequest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { gate } = ownerFrom(req);
  return NextResponse.json({ ok: true, owner: gate.ok });
}
