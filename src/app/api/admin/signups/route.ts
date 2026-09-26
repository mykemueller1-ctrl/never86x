import { NextRequest, NextResponse } from "next/server";
import { adminAllowed, csvCell } from "@/lib/seatAuth";
import { allSignups } from "@/lib/signups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const bearer = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const allowed = adminAllowed(
    req.headers.get("x-admin-email") || "",
    bearer,
    process.env.ADMIN_EMAILS || "",
    process.env.ADMIN_EXPORT_TOKEN || "",
  );
  if (!allowed) {
    return NextResponse.json({ ok: false, reason: "Admin export is locked." }, { status: 401 });
  }
  const rows = await allSignups();
  const header = ["email", "name", "restaurant", "source", "created_at", "checks", "consent_at", "activated_at", "unsubscribed_at"];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.email,
        row.name || "",
        row.restaurant || "",
        row.source,
        row.createdAt,
        row.checks.join("|"),
        row.consentAt,
        row.activatedAt || "",
        row.unsubscribedAt || "",
      ].map(csvCell).join(","),
    );
  }
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=seat-signups.csv",
    },
  });
}
