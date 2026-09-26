import Link from "next/link";
import { Suspense } from "react";
import { Legend } from "@/components/Legend";
import { MenuCheck } from "@/components/MenuCheck";
import { ScreenStatus } from "@/components/ScreenStatus";
import { INVOICE_Q, PLATE_Q, SHIFT_Q, TAGLINE, pageMeta } from "@/lib/brand";

const description = `Paste the recipe card. A missing price stays blank. Nothing is uploaded. ${TAGLINE}`;

export const metadata = pageMeta("/check/menu", PLATE_Q, description);

export default function CheckMenuPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-3xl font-bold leading-tight">{PLATE_Q}</h1>
      <p className="mt-2 text-[var(--muted)]">{description}</p>
      <Legend />
      <Suspense fallback={<ScreenStatus kind="loading">Opening the plate check…</ScreenStatus>}>
        <MenuCheck />
      </Suspense>
      <nav className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/check/invoices" className="text-[var(--accent)]">
          {INVOICE_Q}
        </Link>
        <Link href="/check/labor" className="text-[var(--accent)]">
          {SHIFT_Q}
        </Link>
        <Link href="/try/recipes" className="text-[var(--accent)]">
          Sample plate
        </Link>
      </nav>
    </div>
  );
}
