import { Honesty } from "@/components/Honesty";

export const metadata = { title: "Admin — Never86 X" };

export default function AdminPage() {
  const configured = Boolean(process.env.ADMIN_EMAILS);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Admin</h1>
      <p className="mt-2 text-[var(--muted)]">
        Gated by <code>ADMIN_EMAILS</code> + <code>x-admin-email</code> on <code>/api/audit</code>.
      </p>
      <div className="mt-6 rounded-xl border border-[var(--line)] p-4 text-sm">
        <div className="flex items-center gap-2">
          <span>Admin gate configured</span>
          {configured ? <Honesty kind="Verified" /> : <Honesty kind="Missing" />}
        </div>
        <p className="mt-3 text-[var(--muted)]">
          This page is a stub. No operator PII is listed here. Wire session auth before exposing anything sensitive.
        </p>
      </div>
    </div>
  );
}
