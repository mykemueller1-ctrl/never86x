import Link from "next/link";
import { Suspense } from "react";
import { LaborCheck } from "@/components/LaborCheck";
import { OpenCheck } from "@/components/OpenCheck";
import { Legend } from "@/components/Legend";
import { ScreenStatus } from "@/components/ScreenStatus";
import { INVOICE_Q, PLATE_Q, SHIFT_Q, TAGLINE, pageMeta } from "@/lib/brand";

const description = `Paste the schedule and the clock-outs. No hourly rate means no pay figure. Nothing is uploaded. ${TAGLINE}`;

export const metadata = pageMeta("/check/labor", SHIFT_Q, description);

export default function CheckLaborPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-3xl font-bold leading-tight">{SHIFT_Q}</h1>
      <p className="mt-2 text-[var(--muted)]">{description}</p>
      <OpenCheck sampleHref="/check/labor?sample=1" />
      <Legend />
      <Suspense fallback={<ScreenStatus kind="loading">Opening the labor check…</ScreenStatus>}>
        <LaborCheck />
      </Suspense>
      <nav className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/check/invoices" className="text-[var(--accent)]">
          {INVOICE_Q}
        </Link>
        <Link href="/check/menu" className="text-[var(--accent)]">
          {PLATE_Q}
        </Link>
        <Link href="/try/labor" className="text-[var(--accent)]">
          Sample Friday
        </Link>
      </nav>
    </div>
  );
}
