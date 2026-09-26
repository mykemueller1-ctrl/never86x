import { Honesty } from "@/components/Honesty";
import { SignInToSave } from "@/components/SignInToSave";
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
        <strong>Sample mode</strong>
      </div>
      <p className="mt-1 text-[var(--ink)]">
        Signed-out visitors see the same fictional documents as Try. Nothing here
        is your restaurant, and no dollar is invented.
      </p>
    </div>
  );
}

export function SampleInvoice() {
  const line = SAMPLE_INVOICE_EXTRACT.lineItems[0];
  return (
    <article id="invoices" className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Same case. An $8 price increase.</h2>
        <Honesty kind="Sample" />
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{SAMPLE_MOZZ.label}</p>
      <p className="mt-2 text-sm">
        Previous ${SAMPLE_MOZZ.previous.toFixed(2)} → Latest $
        {SAMPLE_MOZZ.latest.toFixed(2)}{" "}
        <span className="font-semibold">+${SAMPLE_MOZZ.delta.toFixed(2)} per case</span>
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {SAMPLE_INVOICE_EXTRACT.vendor.name}{" "}
        <Honesty kind={SAMPLE_INVOICE_EXTRACT.vendor.honesty} /> · invoice{" "}
        {SAMPLE_INVOICE_EXTRACT.invoiceNumber.value}{" "}
        <Honesty kind={SAMPLE_INVOICE_EXTRACT.invoiceNumber.honesty} /> ·{" "}
        {line.description} @ ${line.unitPrice.toFixed(2)}{" "}
        <Honesty kind={line.honesty} />
      </p>
      <p className="mt-2 text-sm">
        Tax <Honesty kind={SAMPLE_INVOICE_EXTRACT.taxHonesty} />. Prior case $
        {SAMPLE_INVOICE_EXTRACT.priorMatch.previousUnitPrice.toFixed(2)} → $
        {line.unitPrice.toFixed(2)} (+${SAMPLE_INVOICE_EXTRACT.priorMatch.delta.toFixed(2)}){" "}
        <Honesty kind="Sample" />
      </p>
      <SignInToSave label="Upload my own invoices" />
    </article>
  );
}

export function SampleLabor() {
  return (
    <article id="labor" className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Scheduled until 9. Who stayed until 11?</h2>
        <Honesty kind="Sample" />
      </div>
      <p className="mt-2 text-sm font-medium">
        {SAMPLE_LABOR.scheduleLabel} · {SAMPLE_LABOR.scheduleDate} · {SAMPLE_LABOR.coverage}
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        <li>
          {SAMPLE_LABOR.extraHours} extra hours and {SAMPLE_LABOR.fewerHours} fewer hours
          make a {SAMPLE_LABOR.netHours}-hour net difference. <Honesty kind="Sample" />
        </li>
        <li>
          ${SAMPLE_LABOR.straightTimeDollars.toFixed(2)} uses the published sample
          straight-time total. Itemized rates <Honesty kind={SAMPLE_LABOR.ratesHonesty} />
        </li>
      </ul>
      <SignInToSave label="Upload my own schedule" />
    </article>
  );
}

export function SamplePlate() {
  return (
    <article id="menu" className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Every ingredient. One honest plate cost.</h2>
        <Honesty kind="Sample" />
      </div>
      <p className="mt-2 font-medium">
        {SAMPLE_PLATE.name} · ${SAMPLE_PLATE.menuPrice.toFixed(2)} menu price
      </p>
      <p className="mt-1 text-sm">
        Ingredient cost / serving ${SAMPLE_PLATE.ingredientCost.toFixed(2)} ·{" "}
        {SAMPLE_PLATE.ingredientPercent}% · ${SAMPLE_PLATE.leftBeforeLabor.toFixed(2)} left
        before labor and overhead <Honesty kind="Sample" />
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        {SAMPLE_PLATE.lines.map((line) => (
          <li key={line.name}>
            {line.name} — ${line.amount.toFixed(2)}{" "}
            <span className="text-[var(--muted)]">({line.note})</span>
          </li>
        ))}
      </ul>
      <SignInToSave label="Save my own recipe card" />
    </article>
  );
}
