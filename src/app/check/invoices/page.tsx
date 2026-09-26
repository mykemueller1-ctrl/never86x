import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export default function CheckPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <Honesty kind="Sample" />
      <h1 className="mt-4 text-2xl font-bold">Invoice check — public sample</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        See the full invoice workflow without signing in. Sample documents, real comparison logic.
      </p>
      <Link
        href="/try/desk"
        className="mt-6 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
      >
        Run the sample invoice check
      </Link>
      <p className="mt-4 text-xs text-[var(--muted)]">
        Private restaurant records are added only after a separate owner sign-in.
      </p>
    </div>
  );
}
