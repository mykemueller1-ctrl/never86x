import Link from "next/link";
import { ScreenStatus } from "@/components/ScreenStatus";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-3xl font-bold">That page is not here.</h1>
      <ScreenStatus kind="empty">No check lives at this address. Pick one below.</ScreenStatus>
      <nav aria-label="Checks" className="mt-4 grid gap-2 text-base font-semibold">
        <Link href="/check/invoices" className="rounded-xl bg-[var(--accent)] px-4 py-3 text-center text-white">
          Invoices
        </Link>
        <Link href="/check/menu" className="rounded-xl border border-[var(--line)] px-4 py-3 text-center">
          Plate
        </Link>
        <Link href="/check/labor" className="rounded-xl border border-[var(--line)] px-4 py-3 text-center">
          Labor
        </Link>
        <Link href="/" className="text-center text-sm text-[var(--accent)]">
          Home
        </Link>
      </nav>
    </div>
  );
}
