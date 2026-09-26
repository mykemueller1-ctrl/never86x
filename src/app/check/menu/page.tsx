import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Legend } from "@/components/Legend";
import { MenuCheck } from "@/components/MenuCheck";
import { ScreenStatus } from "@/components/ScreenStatus";

const title = "Every ingredient. One honest plate cost.";
const description = "Paste a recipe. See the plate cost. Free. No login.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function CheckMenuPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">PLATE · FREE</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight">{title}</h1>
      <p className="mt-2 text-[var(--muted)]">
        Paste the recipe card. A missing price stays blank. Nothing is uploaded.
      </p>
      <Legend />
      <Suspense fallback={<ScreenStatus kind="loading">Opening the plate check…</ScreenStatus>}>
        <MenuCheck />
      </Suspense>
      <nav className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/check/invoices" className="text-[var(--accent)]">
          Invoices
        </Link>
        <Link href="/check/labor" className="text-[var(--accent)]">
          Labor
        </Link>
        <Link href="/try/recipes" className="text-[var(--accent)]">
          Sample plate
        </Link>
      </nav>
    </div>
  );
}
