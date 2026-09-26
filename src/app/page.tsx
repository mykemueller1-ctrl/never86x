import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import {
  AI_RULE,
  HEADLINE,
  INVOICE_Q,
  METHOD,
  ONE_SENTENCE,
  PLATE_Q,
  PRODUCT,
  SHIFT_Q,
  TAGLINE,
  WHO,
} from "@/lib/brand";
import { SAMPLE_MOZZ } from "@/lib/sample";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <p className="text-xs font-semibold tracking-widest text-[var(--muted)]">{PRODUCT}</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight">{HEADLINE}</h1>
      <p className="mt-3 text-lg">{TAGLINE}</p>
      <p className="mt-3 text-[var(--muted)]">{ONE_SENTENCE}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {METHOD}. For {WHO}.
      </p>

      <div className="mt-6 grid gap-3">
        <Link href="/check/invoices" className="rounded-2xl bg-[var(--ink)] p-5 text-white no-underline">
          <h2 className="text-xl font-semibold">{INVOICE_Q}</h2>
          <p className="mt-2 text-sm text-white/80">Paste two vendor invoices. Nothing is uploaded.</p>
        </Link>
        <Link href="/check/labor" className="rounded-2xl border border-[var(--line)] p-5 no-underline">
          <h2 className="text-xl font-semibold">{SHIFT_Q}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Paste the schedule and the clock-outs. No rate, no pay figure.
          </p>
        </Link>
        <Link href="/check/menu" className="rounded-2xl border border-[var(--line)] p-5 no-underline">
          <h2 className="text-xl font-semibold">{PLATE_Q}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Paste the recipe. Missing prices stay blank.</p>
        </Link>
      </div>

      <section className="mt-6 rounded-2xl border border-[var(--line)] p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">FICTIONAL SAMPLE</p>
          <Honesty kind="Sample" />
        </div>
        <p className="mt-2 font-medium">{SAMPLE_MOZZ.label}</p>
        <p className="mt-1 text-sm">
          ${SAMPLE_MOZZ.previous.toFixed(2)} → ${SAMPLE_MOZZ.latest.toFixed(2)}{" "}
          <span className="font-semibold">+${SAMPLE_MOZZ.delta.toFixed(2)} per case</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <Link href="/check/invoices?sample=1" className="font-semibold text-[var(--accent)]">
            Run the sample
          </Link>
          <Link href="/try/desk" className="text-[var(--muted)] underline">
            Sample desk
          </Link>
          <Link href="/try/watch" className="text-[var(--muted)] underline">
            Watch
          </Link>
        </div>
      </section>

      <p className="mt-6 text-sm text-[var(--muted)]">{AI_RULE}</p>
    </div>
  );
}
