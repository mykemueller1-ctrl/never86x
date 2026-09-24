import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { SAMPLE_MOZZ } from "@/lib/sample";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs font-semibold tracking-widest text-[var(--muted)]">
        YOU&apos;RE ON THE PASS · ONE SEAT · FREE
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight">
        Small crew. Too many hats.{" "}
        <span className="text-[var(--accent)]">Fire one ticket. Feel it&apos;s yours in ten.</span>
      </h1>
      <p className="mt-3 max-w-xl text-[var(--muted)]">
        Not a dashboard. A ticket rail for the owner who&apos;s also expo, receiver, and
        bookkeeper. Deeper than a free website glance — built to beat Restaurant365 and
        MarginEdge on the free seat for a 1–3 person shop. No setup ceremony.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Honesty kind="Sample" />
        <span className="badge badge-verified">First seat free</span>
        <span className="badge badge-estimated">≤10 min to “this is mine”</span>
        <span className="badge badge-missing">No fake Connect</span>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl bg-[var(--ink)] p-6 text-white">
          <p className="text-xs font-semibold tracking-wide text-white/70">
            FIRE IT · INVOICE TICKET
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Same order. Did they raise the plate cost on you?</h2>
          <p className="mt-2 text-sm text-white/80">
            No typing. Snap the paper with your phone — crumpled, dark walk-in, whatever. We read the
            ticket — we don&apos;t invent dollars.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/check/invoices"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
            >
              Snap the ticket →
            </Link>
            <Link href="/try" className="px-2 py-2 text-sm text-white/90 underline">
              Pick up the sample ticket
            </Link>
          </div>
          <div className="mt-6 rounded-xl bg-white p-4 text-[var(--ink)]">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
                SAMPLE TICKET · NOT YOUR WALK-IN
              </p>
              <Honesty kind="Sample" />
            </div>
            <p className="mt-2 font-medium">{SAMPLE_MOZZ.label}</p>
            <p className="mt-1 text-sm">
              Previous ${SAMPLE_MOZZ.previous.toFixed(2)} → Latest $
              {SAMPLE_MOZZ.latest.toFixed(2)}{" "}
              <span className="font-semibold text-[var(--accent)]">
                +${SAMPLE_MOZZ.delta.toFixed(2)} per case
              </span>
            </p>
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-2xl border border-[var(--line)] p-5">
            <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
              IN THE WEEDS · LABOR
            </p>
            <h2 className="mt-1 text-lg font-semibold">Who stayed after cut?</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Schedule on the rail + time clock. Catch the drift before payroll fires.
            </p>
            <div className="mt-3 flex gap-3 text-sm">
              <Link href="/check/labor" className="font-semibold text-[var(--accent)]">
                Check the rail →
              </Link>
              <Link href="/try/labor" className="text-[var(--muted)] underline">
                Sample ticket
              </Link>
            </div>
          </section>
          <section className="rounded-2xl border border-[var(--line)] p-5">
            <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
              PLATE · RECIPE
            </p>
            <h2 className="mt-1 text-lg font-semibold">What does this plate really cost?</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              One recipe + ingredient tickets. No comps hiding in the math.
            </p>
            <div className="mt-3 flex gap-3 text-sm">
              <Link href="/check/menu" className="font-semibold text-[var(--accent)]">
                Cost the plate →
              </Link>
              <Link href="/try/recipes" className="text-[var(--muted)] underline">
                Sample plate
              </Link>
            </div>
          </section>
        </div>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--line)] p-4">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">86 LIST</p>
          <h3 className="mt-1 font-semibold">What&apos;s eighty-sixed?</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Walk-in + invoice coverage. Missing papers stay Missing — never faked.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] p-4">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">PRIME COST</p>
          <h3 className="mt-1 font-semibold">P&amp;L without the fog</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Sales, labor, food — Verified only when the ticket is in hand.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] p-4">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">FRONT OF HOUSE</p>
          <h3 className="mt-1 font-semibold">Site + Google reviews</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            owners.com-style glance, cooked deeper. Labeled Estimated until you Verified.
          </p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
        <span>✓ No card · first seat free</span>
        <span>✓ No POS to start</span>
        <span>✓ Originals stay with the check</span>
        <Link href="/try/desk" className="text-[var(--accent)]">
          Walk the ticket rail →
        </Link>
        <Link href="/try/watch" className="text-[var(--accent)]">
          Watch the pick-up →
        </Link>
      </div>
    </div>
  );
}
