import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { SAMPLE_MOZZ } from "@/lib/sample";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <p className="text-xs font-semibold tracking-widest text-[var(--muted)]">FREE · NO LOGIN</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight">
        You run the restaurant. Watch the costs.
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        Paste the papers you already have. Two invoices, one recipe, or the schedule against the
        clock. Nothing is uploaded.
      </p>

      <div className="mt-6 grid gap-3">
        <Link href="/check/invoices" className="rounded-2xl bg-[var(--ink)] p-5 text-white no-underline">
          <p className="text-xs font-semibold tracking-wide text-white/70">INVOICES</p>
          <h2 className="mt-1 text-xl font-semibold">Same item. Did the price move?</h2>
          <p className="mt-2 text-sm text-white/80">Paste two vendor invoices.</p>
        </Link>
        <Link href="/check/menu" className="rounded-2xl border border-[var(--line)] p-5 no-underline">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">PLATE</p>
          <h2 className="mt-1 text-xl font-semibold">What does this plate cost?</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Paste the recipe. Missing prices stay blank.</p>
        </Link>
        <Link href="/check/labor" className="rounded-2xl border border-[var(--line)] p-5 no-underline">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">LABOR</p>
          <h2 className="mt-1 text-xl font-semibold">Who stayed after the schedule?</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Paste the schedule and the clock-outs. No rate, no pay figure.
          </p>
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
    </div>
  );
}
