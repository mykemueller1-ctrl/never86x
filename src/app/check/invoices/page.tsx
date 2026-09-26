import Link from "next/link";
import { Suspense } from "react";
import { InvoiceCheck } from "@/components/InvoiceCheck";
import { OpenCheck } from "@/components/OpenCheck";
import { Legend } from "@/components/Legend";
import { ScreenStatus } from "@/components/ScreenStatus";
import { INVOICE_Q, PLATE_Q, SHIFT_Q, TAGLINE, pageMeta } from "@/lib/brand";

const description = `Paste two vendor invoices. Prices are read on this phone. Nothing is uploaded. ${TAGLINE}`;

export const metadata = pageMeta("/check/invoices", INVOICE_Q, description);

export default function CheckInvoicesPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-3xl font-bold leading-tight">{INVOICE_Q}</h1>
      <p className="mt-2 text-[var(--muted)]">{description}</p>
      <OpenCheck sampleHref="/check/invoices?sample=1" />
      <Legend />
      <Suspense fallback={<ScreenStatus kind="loading">Opening the invoice check…</ScreenStatus>}>
        <InvoiceCheck />
      </Suspense>
      <nav className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/check/labor" className="text-[var(--accent)]">
          {SHIFT_Q}
        </Link>
        <Link href="/check/menu" className="text-[var(--accent)]">
          {PLATE_Q}
        </Link>
        <Link href="/try/desk" className="text-[var(--accent)]">
          Sample desk
        </Link>
      </nav>
    </div>
  );
}
