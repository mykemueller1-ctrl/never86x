import Link from "next/link";
import { SampleInvoice, SampleModeBanner } from "@/components/SamplePanels";

export const metadata = { title: "Invoice check — Sample mode" };

export default function CheckInvoicesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
      <SampleModeBanner />
      <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
        CHECK · INVOICES
      </p>
      <SampleInvoice />
      <p className="text-sm">
        <Link href="/try/desk" className="text-[var(--accent)]">
          See this on the sample owner desk →
        </Link>
      </p>
    </div>
  );
}
