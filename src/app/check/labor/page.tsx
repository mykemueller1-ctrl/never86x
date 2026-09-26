import Link from "next/link";
import { SampleLabor, SampleModeBanner } from "@/components/SamplePanels";

export const metadata = { title: "Labor check — Sample mode" };

export default function CheckLaborPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
      <SampleModeBanner />
      <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
        CHECK · LABOR
      </p>
      <SampleLabor />
      <p className="text-sm">
        <Link href="/try/labor" className="text-[var(--accent)]">
          Walk the sample labor ticket →
        </Link>
      </p>
    </div>
  );
}
