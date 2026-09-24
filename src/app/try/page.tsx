import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export default function TryPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="flex gap-2">
        <Honesty kind="Sample" />
        <span className="badge badge-estimated">DEMO · SAMPLE DATA</span>
      </div>
      <h1 className="mt-4 text-3xl font-bold">Let&apos;s start with your place</h1>
      <p className="mt-2 text-[var(--muted)]">
        You&apos;ve got enough on your plate. Check what vendor prices are doing —
        or jump straight into the sample.
      </p>
      <form className="mt-6 space-y-3" action="/try/desk">
        <label className="block text-sm font-medium">
          What&apos;s your restaurant called?
          <input
            name="name"
            placeholder="e.g. Corner Table"
            className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Check my invoices
        </button>
      </form>
      <Link
        href="/try/desk"
        className="mt-4 block text-center text-sm text-[var(--muted)] underline"
      >
        Just show me with a sample restaurant
      </Link>
      <p className="mt-6 text-xs text-[var(--muted)]">
        Fictional documents. Real calculations. Your private seat keeps originals.
      </p>
    </div>
  );
}
