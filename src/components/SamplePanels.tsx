import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { INVOICE_Q, PLATE_Q, SHIFT_Q } from "@/lib/brand";
import {
  SAMPLE_INVOICE_EXTRACT,
  SAMPLE_LABOR,
  SAMPLE_MOZZ,
  SAMPLE_PLATE,
} from "@/lib/sample";

export function SampleModeBanner() {
  return (
    <div className="rounded-2xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Honesty kind="Sample" />
        <strong>Sample</strong>
      </div>
      <p className="mt-1">
        Fictional papers. The math is real. Your own invoices, recipe, and schedule run with no
        account.
      </p>
    </div>
  );
}

export function SampleInvoice() {
  const line = SAMPLE_INVOICE_EXTRACT.lineItems[0];
  return (
    <article id="invoices" className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">{INVOICE_Q}</h2>
        <Honesty kind="Sample" />
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{SAMPLE_MOZZ.label}</p>
      <p className="mt-2 text-sm">
        Previous ${SAMPLE_MOZZ.previous.toFixed(2)} → Latest ${SAMPLE_MOZZ.latest.toFixed(2)}{" "}
        <span className="font-semibold">+${SAMPLE_MOZZ.delta.toFixed(2)} per case</span>
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {SAMPLE_INVOICE_EXTRACT.vendor.name} <Honesty kind="Sample" /> · {line.description} @ $
        {line.unitPrice.toFixed(2)} <Honesty kind="Sample" />
      </p>
      <p className="mt-2 text-sm">
        Tax <Honesty kind={SAMPLE_INVOICE_EXTRACT.taxHonesty} />
      </p>
      <Link href="/check/invoices?sample=1" className="mt-4 inline-block font-semibold text-[var(--accent)]">
        Run this sample, or paste your own →
      </Link>
    </article>
  );
}

export function SampleLabor() {
  return (
    <article id="labor" className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">{SHIFT_Q}</h2>
        <Honesty kind="Sample" />
      </div>
      <p className="mt-2 text-sm font-medium">
        {SAMPLE_LABOR.scheduleLabel} · {SAMPLE_LABOR.scheduleDate} · {SAMPLE_LABOR.coverage}
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        <li>
          {SAMPLE_LABOR.extraHours} extra hours and {SAMPLE_LABOR.fewerHours} fewer hours. Net{" "}
          {SAMPLE_LABOR.netHours} hours. <Honesty kind="Sample" />
        </li>
        <li>
          Straight-time difference ${SAMPLE_LABOR.straightTimeDollars.toFixed(2)} is{" "}
          {SAMPLE_LABOR.extraHours} h × ${SAMPLE_LABOR.alexRate} plus −{SAMPLE_LABOR.fewerHours} h × $
          {SAMPLE_LABOR.jordanRate}. <Honesty kind="Sample" />
        </li>
      </ul>
      <Link href="/check/labor?sample=1" className="mt-4 inline-block font-semibold text-[var(--accent)]">
        Run this Friday, or paste your own →
      </Link>
    </article>
  );
}

export function SamplePlate() {
  return (
    <article id="menu" className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">{PLATE_Q}</h2>
        <Honesty kind="Sample" />
      </div>
      <p className="mt-2 font-medium">
        {SAMPLE_PLATE.name} · ${SAMPLE_PLATE.menuPrice.toFixed(2)} menu price
      </p>
      <p className="mt-1 text-sm">
        Ingredient cost ${SAMPLE_PLATE.ingredientCost.toFixed(2)} · {SAMPLE_PLATE.ingredientPercent}% · $
        {SAMPLE_PLATE.leftBeforeLabor.toFixed(2)} left before labor <Honesty kind="Sample" />
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        {SAMPLE_PLATE.lines.map((line) => (
          <li key={line.name}>
            {line.name} — ${line.amount.toFixed(2)}{" "}
            <span className="text-[var(--muted)]">({line.note})</span>
          </li>
        ))}
      </ul>
      <Link href="/check/menu?sample=1" className="mt-4 inline-block font-semibold text-[var(--accent)]">
        Run this plate, or paste your recipe →
      </Link>
    </article>
  );
}
