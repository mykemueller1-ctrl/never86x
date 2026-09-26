import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export default function TryWatchPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Honesty kind="Sample" />
      <h1 className="mt-3 text-3xl font-bold">See One Seat in action</h1>
      <p className="mt-2 text-[var(--muted)]">
        One invoice. One useful answer. Actual product screens · Fictional sample documents.
      </p>
      <div className="mt-6 flex aspect-video items-center justify-center rounded-2xl bg-[var(--ink)] px-6 text-center text-white">
        Walkthrough film plays on the live site. The checks below stay in Sample mode.
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link href="/check/invoices" className="font-semibold text-[var(--accent)]">
          Check my invoices →
        </Link>
        <Link href="/check/menu" className="font-semibold text-[var(--accent)]">
          Use my recipe card →
        </Link>
        <Link href="/try/labor" className="underline">
          Try the labor example →
        </Link>
        <Link href="/try/recipes" className="underline">
          Try the recipe example →
        </Link>
        <Link href="/try" className="underline">
          Try the sample first
        </Link>
      </div>
      <p className="mt-4 text-xs text-[var(--muted)]">
        Signed-out checks open the fictional sample on this site. No outside login.
      </p>
    </div>
  );
}
