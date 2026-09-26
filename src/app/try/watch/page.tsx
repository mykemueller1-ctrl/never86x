import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { INVOICE_Q, PLATE_Q, SHIFT_Q, pageMeta } from "@/lib/brand";

export const metadata = pageMeta(
  "/try/watch",
  "Watch the walkthrough",
  "One invoice. One answer. Then paste your own papers. No login.",
);

export default function TryWatchPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Honesty kind="Sample" />
      <h1 className="mt-3 text-3xl font-bold">See the sample, then use your papers.</h1>
      <p className="mt-2 text-[var(--muted)]">
        The film uses fictional invoices. Your files are not in it.
      </p>
      <video
        controls
        playsInline
        preload="metadata"
        aria-label="Walkthrough film with fictional invoices. This film has no captions."
        className="mt-6 aspect-video w-full rounded-2xl bg-black"
        src="https://app.never86.app/media/never86-landscape-v24.mp4"
      />
      <p className="mt-2 text-sm text-[var(--muted)]">This film has no captions. The checks are text.</p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link href="/check/invoices" className="font-semibold text-[var(--accent)]">
          {INVOICE_Q}
        </Link>
        <Link href="/check/labor" className="underline">
          {SHIFT_Q}
        </Link>
        <Link href="/check/menu" className="font-semibold text-[var(--accent)]">
          {PLATE_Q}
        </Link>
        <Link href="/try" className="underline">
          Sample first
        </Link>
      </div>
    </div>
  );
}
