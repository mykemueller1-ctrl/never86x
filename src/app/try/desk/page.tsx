import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { SignInToSave } from "@/components/SignInToSave";
import { SAMPLE_MOZZ, SAMPLE_INVOICE_EXTRACT } from "@/lib/sample";

const nav = [
  { href: "/try/desk", label: "Owner desk" },
  { href: "/try/desk#invoices", label: "Invoice prices" },
  { href: "/try/labor", label: "Labor & schedules" },
  { href: "/try/recipes", label: "Menu & plate cost" },
  { href: "/seat?start=data", label: "What's missing" },
  { href: "/seat?start=actions", label: "My actions" },
];

export default function DeskPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-[220px_1fr_260px]">
      <aside className="bg-[var(--ink)] px-3 py-6 text-white">
        <p className="px-2 text-xs font-semibold tracking-wide text-white/60">ONE SEAT</p>
        <nav className="mt-3 space-y-1 text-sm">
          {nav.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="block rounded-lg px-2 py-2 hover:bg-white/10"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 px-2 text-xs text-white/60">
          Example restaurant · Fictional records
        </p>
        <Link href="/seat" className="mt-2 block px-2 text-xs text-[var(--accent)]">
          Open the sample seat →
        </Link>
      </aside>

      <section className="bg-[var(--paper)] px-6 py-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[var(--accent)]">
              ONE OWNER · ONE RESTAURANT
            </p>
            <h1 className="text-2xl font-bold">What&apos;s dying on the pass?</h1>
          </div>
          <div className="flex items-center gap-2">
            <Honesty kind="Sample" />
            <SignInToSave label="Add my records" />
          </div>
        </div>

        <article id="invoices" className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-5">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
            INVOICE · LABOR · MENU
          </p>
          <h2 className="mt-1 text-xl font-semibold">Same case. An $8 price increase.</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            The sample mozzarella case rose from ${SAMPLE_MOZZ.previous} to $
            {SAMPLE_MOZZ.latest}. That is a 16.7% increase for the same 20 lb case.{" "}
            <Honesty kind="Sample" />
          </p>
          <div className="mt-4 rounded-lg border-l-4 border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2 text-sm">
            <span className="font-semibold text-[var(--accent)]">FIRE NEXT</span> — Check
            the price with your vendor before the next order.
          </div>
          <Link href="/try" className="mt-3 inline-block text-sm text-[var(--accent)]">
            See the math and source →
          </Link>
        </article>

        <article className="mt-4 rounded-2xl border-2 border-dashed border-[var(--accent)] bg-white p-5">
          <p className="text-xs font-semibold tracking-wide text-[var(--accent)]">
            SNAP THE TICKET · NO TYPING
          </p>
          <h2 className="mt-1 text-lg font-semibold">Camera → extract → one tap</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {SAMPLE_INVOICE_EXTRACT.vendor.name} · {SAMPLE_INVOICE_EXTRACT.invoiceDate.value} ·{" "}
            {SAMPLE_INVOICE_EXTRACT.lineItems[0].description} @ $
            {SAMPLE_INVOICE_EXTRACT.lineItems[0].unitPrice.toFixed(2)}. Tax{" "}
            <Honesty kind="Missing" />. Prior case ${SAMPLE_INVOICE_EXTRACT.priorMatch.previousUnitPrice}{" "}
            → ${SAMPLE_INVOICE_EXTRACT.lineItems[0].unitPrice} (+${SAMPLE_INVOICE_EXTRACT.priorMatch.delta}).{" "}
            <Honesty kind="Sample" />
          </p>
          <div className="mt-4 flex flex-wrap items-start gap-2">
            <SignInToSave label="Looks right — save this" />
            <a
              href="#invoices"
              className="mt-4 inline-block rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-semibold"
            >
              See the sample ticket again
            </a>
            <SignInToSave label="Upload my own papers" />
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">{SAMPLE_INVOICE_EXTRACT.railPrompt}</p>
        </article>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border border-[var(--accent)] px-3 py-1 text-[var(--accent)]">
            What changed on my invoices?
          </span>
          <Link href="/try/labor" className="rounded-full border border-[var(--line)] px-3 py-1">
            Did hours go over the plan?
          </Link>
          <Link href="/try/recipes" className="rounded-full border border-[var(--line)] px-3 py-1">
            What does this plate really cost?
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-4">
          <p className="font-medium">Call it down — ask the rail</p>
          <textarea
            className="mt-2 w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
            rows={3}
            placeholder="What should I check before the next order?"
          />
          <p className="mt-2 text-xs text-[var(--muted)]">
            Sample walkthrough. Private workspace keeps originals, reviewed facts, follow-ups.
          </p>
        </div>
      </section>

      <aside className="border-l border-[var(--line)] bg-[#f0f1f4] px-4 py-6 text-sm">
        <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
          EXAMPLE RESTAURANT FOLDERS
        </p>
        <h2 className="mt-1 font-semibold">What&apos;s on the 86 list?</h2>
        <ul className="mt-4 space-y-3">
          <li className="rounded-xl bg-white p-3">
            <div className="flex justify-between gap-2">
              <strong>Schedule</strong>
              <Honesty kind="Missing" />
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">Missing for this week</p>
          </li>
          <li className="rounded-xl bg-white p-3">
            <div className="flex justify-between gap-2">
              <strong>Time-clock report</strong>
              <Honesty kind="Estimated" />
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">Received · needs review</p>
          </li>
          <li className="rounded-xl bg-white p-3">
            <div className="flex justify-between gap-2">
              <strong>Invoices & credits</strong>
              <Honesty kind="Verified" />
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">Reviewed files · check coverage</p>
          </li>
        </ul>
        <Link href="/try/watch" className="mt-6 block text-[var(--accent)]">
          Watch the walkthrough →
        </Link>
      </aside>
    </div>
  );
}
