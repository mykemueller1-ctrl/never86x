import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export default function CheckPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <Honesty kind="Missing" />
      <h1 className="mt-4 text-2xl font-bold">Private check — sign in first</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Your private /invoices check lives in your owner seat. No fake Connect. No invented dollars.
      </p>
      <Link
        href="/seat"
        className="mt-6 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
      >
        Go to Sign in
      </Link>
      <p className="mt-4 text-xs text-[var(--muted)]">
        Meanwhile try the public sample on <Link href="/try" className="underline">/try</Link>.
      </p>
    </div>
  );
}
