import { Honesty } from "@/components/Honesty";
import { BRAND, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/admin", "Admin", `${BRAND} operator stub. No restaurant list.`);

export default function AdminPage() {
  const configured = Boolean(process.env.ADMIN_EMAILS);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Admin</h1>
      <p className="mt-2 text-[var(--muted)]">This page does not list restaurants or prices.</p>
      <div className="mt-6 rounded-xl border border-[var(--line)] p-4 text-sm">
        <div className="flex items-center gap-2">
          <span>Admin gate configured</span>
          {configured ? <Honesty kind="Verified" /> : <Honesty kind="Missing" />}
        </div>
        <p className="mt-3 text-[var(--muted)]">
          This page is a stub. No operator records are listed here.
        </p>
      </div>
    </div>
  );
}
