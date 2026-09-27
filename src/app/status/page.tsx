import { Honesty } from "@/components/Honesty";
import { BRAND, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/status", "Status", `What is on in this ${BRAND} preview.`);

export default function StatusPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Status</h1>
      <p className="mt-2 text-[var(--muted)]">What is on in this preview, and what is still missing.</p>
      <ul className="mt-6 space-y-3 text-sm">
        <li className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
          <span>Invoice, shift, and plate checks on this phone</span>
          <Honesty kind="Verified" />
        </li>
        <li className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
          <span>Photo reader on this phone</span>
          <Honesty kind="Verified" />
        </li>
        <li className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
          <span>Account to sync phones</span>
          <Honesty kind="Missing" />
        </li>
        <li className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
          <span>Paid manager seats</span>
          <Honesty kind="Missing" />
        </li>
        <li className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
          <span>Health check</span>
          <Honesty kind="Verified" />
        </li>
      </ul>
    </div>
  );
}
