import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { SAMPLE_MOZZ } from "@/lib/sample";

const nav = [
  { href: "/try/desk", label: "Owner desk" },
  { href: "/try/desk#invoices", label: "Invoice prices" },
  { href: "/try/labor", label: "Labor & schedules" },
  { href: "/try/recipes", label: "Menu & plate cost" },
  { href: "/seat?start=data", label: "What's missing" },
  { href: "/seat?start=actions", label: "Kept cards" },
];

export const metadata = {
  title: "Sample desk",
  description: "Fictional restaurant. Real math. Your papers are a different page, no login.",
};

export default function DeskPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-[220px_1fr_260px]">
      <aside className="bg-[var(--ink)] px-3 py-6 text-white">
        <p className="px-2 text-xs font-semibold tracking-wide text-white/60">SAMPLE</p>
        <nav className="mt-3 space-y-1 text-sm">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="block rounded-lg px-2 py-2 hover:bg-white/10">
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 px-2 text-xs text-white/60">Example restaurant. Fictional records.</p>
        <Link href="/check/invoices" className="mt-2 block px-2 text-xs text-[var(--accent)]">
          Paste my invoices →
        </Link>
      </aside>

      <section className="bg-[var(--paper)] px-4 py-6 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[var(--accent)]">SAMPLE RESTAURANT</p>
            <h1 className="text-2xl font-bold">Same case. An $8 price increase.</h1>
          </div>
          <Honesty kind="Sample" />
        </div>

        <article id="invoices" className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
          <h2 className="text-xl font-semibold">{SAMPLE_MOZZ.label}</h2>
          <p className="mt-2 text-sm">
            ${SAMPLE_MOZZ.previous.toFixed(2)} → ${SAMPLE_MOZZ.latest.toFixed(2)}. That is $
            {SAMPLE_MOZZ.delta.toFixed(2)} on the same 20 lb case. <Honesty kind="Sample" />
          </p>
          <p className="mt-3 text-sm">Ask the vendor before the next order.</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/check/invoices?sample=1" className="font-semibold text-[var(--accent)]">
              Run the sample invoices
            </Link>
            <Link href="/check/invoices" className="underline">
              Paste my own
            </Link>
          </div>
        </article>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href="/check/invoices" className="rounded-full border border-[var(--accent)] px-3 py-2 text-[var(--accent)]">
            What changed on my invoices?
          </Link>
          <Link href="/try/labor" className="rounded-full border border-[var(--line)] px-3 py-2">
            Did hours go over the plan?
          </Link>
          <Link href="/try/recipes" className="rounded-full border border-[var(--line)] px-3 py-2">
            What does this plate cost?
          </Link>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          A photo is read on this phone. A blurry read is flagged and is not a price. PDF text and
          pasted lines are read here. The file is not uploaded.
        </p>
      </section>

      <aside className="border-l border-[var(--line)] bg-[#f0f1f4] px-4 py-6 text-sm">
        <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">EXAMPLE FOLDERS</p>
        <h2 className="mt-1 font-semibold">What the sample is missing</h2>
        <ul className="mt-4 space-y-3">
          <li className="rounded-xl bg-white p-3">
            <div className="flex justify-between gap-2">
              <strong>Your schedule</strong>
              <Honesty kind="Missing" />
            </div>
            <Link href="/check/labor" className="mt-1 inline-block text-xs text-[var(--accent)]">
              Paste it
            </Link>
          </li>
          <li className="rounded-xl bg-white p-3">
            <div className="flex justify-between gap-2">
              <strong>Sample clock</strong>
              <Honesty kind="Sample" />
            </div>
            <Link href="/try/labor" className="mt-1 inline-block text-xs text-[var(--accent)]">
              See Friday
            </Link>
          </li>
          <li className="rounded-xl bg-white p-3">
            <div className="flex justify-between gap-2">
              <strong>Sample invoices</strong>
              <Honesty kind="Sample" />
            </div>
            <Link href="/check/invoices?sample=1" className="mt-1 inline-block text-xs text-[var(--accent)]">
              See the $8
            </Link>
          </li>
        </ul>
        <Link href="/try/watch" className="mt-6 block text-[var(--accent)]">
          Watch the walkthrough →
        </Link>
      </aside>
    </div>
  );
}
