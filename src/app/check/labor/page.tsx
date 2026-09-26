import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { LaborCheck } from "@/components/LaborCheck";
import { Legend } from "@/components/Legend";

const title = "Scheduled until 9. Who stayed until 11?";
const description = "Paste the schedule and the clock-outs. See the drift. Free. No login.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function CheckLaborPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">LABOR · FREE</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight">{title}</h1>
      <p className="mt-2 text-[var(--muted)]">
        Paste who was scheduled and who clocked out. No hourly rate means no pay figure. Nothing is uploaded.
      </p>
      <Legend />
      <Suspense fallback={<p className="mt-6 text-sm">Opening the check…</p>}>
        <LaborCheck />
      </Suspense>
      <nav className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/check/invoices" className="text-[var(--accent)]">
          Invoices
        </Link>
        <Link href="/check/menu" className="text-[var(--accent)]">
          Plate cost
        </Link>
        <Link href="/try/labor" className="text-[var(--accent)]">
          Sample Friday
        </Link>
      </nav>
    </div>
  );
}
