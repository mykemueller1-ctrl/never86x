import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { OFFER, PAID, PRODUCT, WHO, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/pricing", "Pricing", `${OFFER} ${PAID}`);

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold tracking-widest text-[var(--muted)]">{PRODUCT}</p>
      <h1 className="mt-2 text-3xl font-bold">The first owner seat is free.</h1>
      <p className="mt-3 text-[var(--muted)]">For {WHO}.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-[var(--line)] p-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Owner seat</h2>
            <Honesty kind="Verified" />
          </div>
          <p className="mt-3 text-sm">{OFFER}</p>
          <Link href="/onboarding" className="mt-4 inline-block font-semibold text-[var(--accent)]">
            Start with your papers
          </Link>
        </section>

        <section className="rounded-2xl border border-[var(--line)] p-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Manager seats</h2>
            <Honesty kind="Missing" />
          </div>
          <p className="mt-3 text-sm">{PAID}</p>
          <Link href="/status" className="mt-4 inline-block font-semibold text-[var(--accent)]">
            Paid seats are not on yet
          </Link>
        </section>
      </div>
    </div>
  );
}
