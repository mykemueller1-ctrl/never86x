import Link from "next/link";
import { INVOICE_Q, OFFER, PLATE_Q, PRODUCT, SHIFT_Q, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/onboarding", "Start", `${OFFER}`);

const steps = [
  { n: 1, title: INVOICE_Q, href: "/check/invoices", note: "Paste two invoices. No account." },
  { n: 2, title: SHIFT_Q, href: "/check/labor", note: "Paste the schedule and the clock. No rate, no pay figure." },
  { n: 3, title: PLATE_Q, href: "/check/menu", note: "Paste one recipe. A missing price stays blank." },
  { n: 4, title: PRODUCT, href: "/seat", note: "Optional. A kept card stays in this browser." },
];

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold tracking-widest text-[var(--muted)]">{PRODUCT}</p>
      <h1 className="mt-2 text-3xl font-bold">Start with last week&apos;s papers.</h1>
      <p className="mt-3 text-[var(--muted)]">{OFFER}</p>
      <ol className="mt-8 space-y-4">
        {steps.map((s) => (
          <li key={s.n} className="rounded-2xl border border-[var(--line)] p-5">
            <p className="text-xs font-semibold text-[var(--muted)]">STEP {s.n}</p>
            <h2 className="mt-1 text-lg font-semibold">
              <Link href={s.href} className="text-[var(--accent)]">
                {s.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{s.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
