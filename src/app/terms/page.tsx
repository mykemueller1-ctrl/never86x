import { BRAND, OFFER, PAID, PRODUCT, WHO, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/terms", "Terms", `Terms of use for ${BRAND} ${PRODUCT}.`);

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose-sm">
      <h1 className="text-3xl font-bold">Terms of use</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Last updated: September 26, 2026 · Draft for operators · Not legal advice</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--ink)]">
        <p>
          {BRAND} {PRODUCT} (&quot;the Service&quot;) is for {WHO}. By using the Service you agree to these terms.
        </p>
        <p>
          <strong>Honesty labels.</strong> Numbers marked Verified come from your papers. Estimated is math on those numbers. Missing means we do not have it. A missing invoice stays Missing. We do not invent dollars.
        </p>
        <p>
          <strong>Your data.</strong> You own the invoices, schedules, and recipes you paste. On this free link they are read in your browser and are not uploaded. See Privacy.
        </p>
        <p>
          <strong>The seat.</strong> {OFFER} {PAID} No charge without a price we have explained first.
        </p>
        <p>
          <strong>No warranty for payroll or tax filings.</strong> The Service helps you see the numbers. It is not a CPA, payroll processor, or tax filer.
        </p>
        <p>
          <strong>Acceptable use.</strong> Do not scrape other operators&apos; private data.
        </p>
        <p>
          <strong>Contact.</strong> Support is the /support page, or the email listed there when one is published.
        </p>
      </div>
    </div>
  );
}
