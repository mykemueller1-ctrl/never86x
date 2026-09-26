import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export default function CheckPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <Honesty kind="Sample" />
      <h1 className="mt-4 text-2xl font-bold">Labor check — public sample</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Compare a sample schedule and clock report without signing in.
      </p>
      <Link
        href="/try/labor"
        className="mt-6 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
      >
        Run the sample labor check
      </Link>
    </div>
  );
}
