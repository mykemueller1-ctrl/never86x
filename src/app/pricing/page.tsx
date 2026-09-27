import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export const metadata = {
  title: "Pricing — Never86 X",
  description: "First owner seat free. Seats 2–3 paid when Stripe is live.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold tracking-widest text-[var(--muted)]">PRICING</p>
      <h1 className="mt-2 text-3xl font-bold">One free seat. Paid seats later.</h1>
      <p className="mt-3 text-[var(--muted)]">
        Built for 1–3 person shops that refuse R365 / MarginEdge ceremony. We never invent dollars.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-[var(--line)] p-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Owner seat</h2>
            <Honesty kind="Verified" />
          </div>
          <p className="mt-2 text-3xl font-bold">Free</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Ticket rail, sample desk, honesty labels, camera ingest path (docs). Forever free for seat 1.
          </p>
          <Link href="/onboarding" className="mt-4 inline-block font-semibold text-[var(--accent)]">
            Start onboarding →
          </Link>
        </section>

        <section className="rounded-2xl border border-[var(--line)] p-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Seats 2–3</h2>
            <Honesty kind="Missing" />
          </div>
          <p className="mt-2 text-3xl font-bold">TBD</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Checkout is fail-closed until Stripe keys land. No fake price. No fake &quot;buy&quot; button that charges.
          </p>
          <form action="/api/billing/checkout" method="post" className="mt-4">
            <button
              type="submit"
              className="rounded-lg bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white"
            >
              Attempt checkout (will 503 without Stripe)
            </button>
          </form>
        </section>
      </div>

      <p className="mt-8 text-sm text-[var(--muted)]">
        Positioning: free seat beats Restaurant365 and MarginEdge for tiny crews. Owner.com-depth site/review
        tooling is <Honesty kind="Missing" /> in this build.
      </p>
    </div>
  );
}
