import Link from "next/link";
import { INVOICE_Q, pageMeta } from "@/lib/brand";

export const metadata = pageMeta(
  "/contact",
  "Talk to Myke",
  "This page does not send email. Use the checks with no login.",
);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-3xl font-bold">Want a hand?</h1>
      <p className="mt-2 text-[var(--muted)]">
        This page does not send a message. No inbox is connected. A support address is not published
        yet.
      </p>
      <div className="mt-6 grid gap-2 text-base font-semibold">
        <Link href="/support" className="rounded-xl border border-[var(--line)] px-4 py-3 text-center">
          See support
        </Link>
        <Link href="/check/invoices" className="rounded-xl bg-[var(--accent)] px-4 py-3 text-center text-white">
          {INVOICE_Q}
        </Link>
      </div>
    </div>
  );
}
