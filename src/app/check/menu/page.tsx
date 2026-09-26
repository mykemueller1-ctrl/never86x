import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export default function CheckPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <Honesty kind="Sample" />
      <h1 className="mt-4 text-2xl font-bold">Plate-cost check — public sample</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Walk through a sample recipe and ingredient-cost calculation without signing in.
      </p>
      <Link
        href="/try/recipes"
        className="mt-6 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
      >
        Run the sample plate-cost check
      </Link>
    </div>
  );
}
