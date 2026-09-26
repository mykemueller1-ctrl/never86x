import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { InvoiceCheck } from "@/components/InvoiceCheck";
import { Legend } from "@/components/Legend";

const title = "Same cheese. Same case. Different price.";
const description = "Paste two vendor invoices. See which price moved. Free. No login.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function CheckInvoicesPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">INVOICES · FREE</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight">{title}</h1>
      <p className="mt-2 text-[var(--muted)]">
        Paste the older invoice and the newer one. Prices are read on this phone. Nothing is uploaded.
      </p>
      <Legend />
      <Suspense fallback={<p className="mt-6 text-sm">Opening the check…</p>}>
        <InvoiceCheck />
      </Suspense>
      <nav className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/check/menu" className="text-[var(--accent)]">
          Plate cost
        </Link>
        <Link href="/check/labor" className="text-[var(--accent)]">
          Labor
        </Link>
        <Link href="/try/desk" className="text-[var(--accent)]">
          Sample desk
        </Link>
      </nav>
    </div>
  );
}
