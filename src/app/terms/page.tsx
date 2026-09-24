export const metadata = {
  title: "Terms — Never86 X",
  description: "Terms of use for Never86 X operator software.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose-sm">
      <h1 className="text-3xl font-bold">Terms of use</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Last updated: September 23, 2026 · Draft for operators · Not legal advice</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--ink)]">
        <p>
          Never86 X (&quot;the Service&quot;) is operator software for independent restaurants. By using the Service you agree to these terms.
        </p>
        <p>
          <strong>Honesty labels.</strong> Numbers marked Verified come from your papers or systems we can cite. Estimated is math or public reference. Missing means we do not have it — we will not invent dollars.
        </p>
        <p>
          <strong>Your data.</strong> You own invoices, schedules, and recipes you upload. We process them to run the rail. See Privacy.
        </p>
        <p>
          <strong>Free seat.</strong> Seat 1 is free. Paid seats require a separate checkout when offered. No charge without your action.
        </p>
        <p>
          <strong>No warranty for payroll/tax filings.</strong> The Service helps you see drift; it is not a CPA, payroll processor, or tax filer.
        </p>
        <p>
          <strong>Acceptable use.</strong> No abuse, scraping other operators&apos; private data, or attempting to bypass rate limits or auth.
        </p>
        <p>
          <strong>Contact.</strong> Support: the /support page or the email listed there when configured.
        </p>
      </div>
    </div>
  );
}
