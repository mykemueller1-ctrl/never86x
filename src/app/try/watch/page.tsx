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
      <div className="mt-6 flex aspect-video items-center justify-center rounded-2xl bg-[var(--ink)] text-white">
        Walkthrough placeholder · open app.never86.app/try/watch for live film
      </div>
      <div className="mt-4 flex gap-3 text-sm">
        <Link href="/try/desk" className="font-semibold text-[var(--accent)]">
          Check my invoices →
        </Link>
        <Link href="/try" className="underline">
          Try the sample first
        </Link>
      </div>
      <p className="mt-4 text-xs text-[var(--muted)]">
        Public demo stays inside Never86. No OpenAI sign-in is required to explore the sample.
      </p>
    </div>
  );
}
