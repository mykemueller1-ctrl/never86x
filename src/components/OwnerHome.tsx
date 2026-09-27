import Link from "next/link";
import { BRAND, METHOD } from "@/lib/brand";
import { formatDelta, formatMoney } from "@/lib/money";
import { SAMPLE_MOZZ } from "@/lib/sample";

const rust = "font-semibold text-[var(--accent)]";

export function OwnerHome() {
  return (
    <div className="mx-auto max-w-lg bg-[#f6f5f3] px-4 py-6 text-[var(--ink)]">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--muted)]">
        A SECOND SET OF EYES FOR YOUR RESTAURANT
      </p>
      <h1 className="mt-3 text-4xl font-bold leading-tight">
        You run the restaurant.
        <br />
        <span className="text-[var(--accent)]">Let&apos;s watch the costs.</span>
      </h1>
      <p className="mt-3 text-[var(--muted)]">Pick one thing to check. Bring the paperwork you already have.</p>
      <Link href="/try/watch" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold no-underline">
        <span aria-hidden className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)]">
          ▶
        </span>
        Explore the owner desk
      </Link>
      <p className="mt-4 text-sm">
        <Link href="/seat" className="font-semibold no-underline">
          ✓ Your first owner seat is free
        </Link>
      </p>

      <section className="mt-6 rounded-3xl bg-[#17191c] p-4 text-[#f7f3ee]">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#d4cdc4]">START WITH AN INVOICE</p>
        <h2 className="mt-3 text-3xl font-bold leading-tight">Same order. Higher prices?</h2>
        <p className="mt-2 text-sm text-[#d4cdc4]">
          Add two invoices from the same vendor. Only have one? Start there.
        </p>
        <Link
          href="/check/invoices"
          className="mt-4 block rounded-xl bg-[var(--accent)] px-4 py-3 text-center text-base font-semibold text-white no-underline"
        >
          Check my invoices →
        </Link>
        <Link href="/check/invoices?sample=1" className="mt-3 block text-center text-sm text-[#f7f3ee]">
          Try the example
        </Link>
        <p className="mt-4 text-xs text-[#d4cdc4]">Built by Myke Mueller, Restaurant operator. Founder.</p>
        <div className="mt-4 rounded-2xl bg-white p-4 text-[var(--ink)]">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--muted)]">EXAMPLE · SAMPLE INVOICES</p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <p className="font-semibold">Mozzarella</p>
            <p className="text-xs text-[var(--muted)]">Same 20 lb case</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <p>
              <span className="block text-xs text-[var(--muted)]">Previous invoice</span>
              <span className="text-2xl font-bold">{formatMoney(SAMPLE_MOZZ.previous)}</span>
            </p>
            <p>
              <span className="block text-xs text-[var(--muted)]">Latest</span>
              <span className="text-2xl font-bold">{formatMoney(SAMPLE_MOZZ.latest)}</span>
            </p>
          </div>
          <p className={`mt-3 inline-block rounded-lg bg-[var(--accent-soft)] px-2 py-1 text-sm ${rust}`}>
            {formatDelta(SAMPLE_MOZZ.delta)} per case
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-[var(--line)] bg-white p-4">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--muted)]">LABOR HOURS</p>
        <h2 className="mt-2 text-2xl font-bold">Did the hours go over the plan?</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Your schedule + time clock report.</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link href="/check/labor" className={`${rust} no-underline`}>
            Check my labor →
          </Link>
          <Link href="/check/labor?sample=1" className="text-sm text-[var(--muted)]">
            See example
          </Link>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-[var(--line)] bg-white p-4">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--muted)]">ONE MENU ITEM</p>
        <h2 className="mt-2 text-2xl font-bold">What does this plate really cost?</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">One recipe + its ingredient prices.</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link href="/check/menu" className={`${rust} no-underline`}>
            Check my plate cost →
          </Link>
          <Link href="/check/menu?sample=1" className="text-sm text-[var(--muted)]">
            See example
          </Link>
        </div>
      </section>

      <ul className="mt-6 grid gap-2 text-sm">
        <li>✓ No card required</li>
        <li>✓ No POS connection to start</li>
        <li>✓ Originals kept with your check</li>
      </ul>

      <blockquote className="mt-6 border-t border-[var(--line)] pt-4 text-lg font-semibold">
        For those of us without a CFO or someone watching every number.
      </blockquote>
      <p className="mt-2 text-sm text-[var(--muted)]">Myke Mueller · Restaurant operator &amp; founder</p>
      <p className="mt-6 text-sm">
        Want help getting started? <Link href="/contact">Talk to Myke</Link>
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        <Link href="/privacy">Privacy</Link>
        {" · "}
        <Link href="/email-data">Email data</Link>
      </p>
      <p className="sr-only">{BRAND} {METHOD}</p>
    </div>
  );
}
