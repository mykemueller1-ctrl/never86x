"use client";

import Link from "next/link";
import { ScreenStatus } from "@/components/ScreenStatus";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = error.message?.trim() || "This screen broke before it could show a number.";
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-3xl font-bold">This screen hit an error.</h1>
      <ScreenStatus kind="error">{message}</ScreenStatus>
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white"
        >
          Try this screen again
        </button>
        <Link href="/" className="rounded-xl border border-[var(--line)] px-4 py-3 text-center text-base font-semibold">
          Back to the checks
        </Link>
      </div>
    </div>
  );
}
