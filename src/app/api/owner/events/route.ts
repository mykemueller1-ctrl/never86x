import { NextRequest, NextResponse } from "next/server";
import { listEvents } from "@/lib/analytics";
import { ownerFrom } from "@/lib/ownerRequest";
import { deviceLabel } from "@/lib/ownerStats";
import { csvCell } from "@/lib/seatAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { gate } = ownerFrom(req);
  if (!gate.ok) return NextResponse.json(gate, { status: gate.status });
  const events = await listEvents();
  const header = ["event", "visitor", "email", "source", "device", "detail", "test", "time"];
  const lines = [header.join(",")];
  for (const event of events) {
    lines.push(
      [
        event.name,
        event.visitorId,
        event.email || "",
        event.source,
        deviceLabel(event.uaClass),
        event.detail || "",
        event.test ? "test" : "",
        event.createdAt,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="seat-events.csv"',
    },
  });
}
