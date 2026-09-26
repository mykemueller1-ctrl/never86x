import { NextRequest, NextResponse } from "next/server";
import { ownerDashboard } from "@/lib/analytics";
import { ownerFrom } from "@/lib/ownerRequest";
import { csvCell } from "@/lib/seatAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { gate } = ownerFrom(req);
  if (!gate.ok) return NextResponse.json(gate, { status: gate.status });
  const board = await ownerDashboard();
  const header = ["email", "name", "restaurant", "source", "first_seen", "checks", "last_active", "test"];
  const lines = [header.join(",")];
  for (const row of board.signups) {
    lines.push(
      [
        row.email,
        row.name || "",
        row.restaurant || "",
        row.source,
        row.firstSeen,
        row.checks.join("|"),
        row.lastActive,
        row.test ? "test" : "",
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="seat-signups.csv"',
    },
  });
}
