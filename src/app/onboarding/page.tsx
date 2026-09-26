import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export const metadata = { title: "Onboarding — Never86 X" };

const steps = [
  { n: 1, title: "Paste two invoices", href: "/check/invoices", note: "See which price moved. No account." },
  { n: 2, title: "Paste one recipe", href: "/check/menu", note: "Plate cost only from prices on the card." },
  { n: 3, title: "Paste the schedule and the clock", href: "/check/labor", note: "No rate on the paper, no pay figure." },
  { n: 4, title: "Keep a card on this phone", href: "/seat", note: "Optional. History stays in this browser." },
];

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold tracking-widest text-[var(--muted)]">FIRST TEN MINUTES</p>
      <h1 className="mt-2 text-3xl font-bold">Onboarding without ceremony</h1>
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
      <p className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        Auth provider: <Honesty kind="Missing" /> · Stripe: <Honesty kind="Missing" /> · Sample desk:{" "}
        <Honesty kind="Verified" />
      </p>
    </div>
  );
}
