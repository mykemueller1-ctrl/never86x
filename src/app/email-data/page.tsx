import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { INVOICE_Q, pageMeta } from "@/lib/brand";

export const metadata = pageMeta(
  "/email-data",
  "Email data",
  "Mailbox connection is not on. Paste a file on the check pages instead.",
);

export default function EmailDataPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-3xl font-bold">Email is not connected.</h1>
      <p className="mt-3 flex items-center gap-2 text-sm">
        Mailbox access <Honesty kind="Missing" />
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        This free link does not read a mailbox. Paste the invoice, or add a PDF or CSV, on the
        check. The file stays on the phone.
      </p>
      <Link href="/check/invoices" className="mt-6 inline-block font-semibold text-[var(--accent)]">
        {INVOICE_Q}
      </Link>
    </div>
  );
}
