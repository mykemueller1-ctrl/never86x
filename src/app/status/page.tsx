import { Honesty } from "@/components/Honesty";

export const metadata = { title: "Status — Never86 X" };

export default function StatusPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Status</h1>
      <p className="mt-2 text-[var(--muted)]">
        Manual status board until an external uptime provider is wired.
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        <li className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
          <span>App scaffold (this deploy)</span>
          <Honesty kind="Estimated" />
        </li>
        <li className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
          <span>Auth / private seat</span>
          <Honesty kind="Missing" />
        </li>
        <li className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
          <span>Stripe billing</span>
          <Honesty kind="Missing" />
        </li>
        <li className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
          <span>Health endpoint <code>/api/health</code></span>
          <Honesty kind="Verified" />
        </li>
      </ul>
    </div>
  );
}
