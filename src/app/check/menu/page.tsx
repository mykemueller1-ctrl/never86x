import Link from "next/link";
import { SampleModeBanner, SamplePlate } from "@/components/SamplePanels";

export const metadata = { title: "Plate cost — Sample mode" };

export default function CheckMenuPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
      <SampleModeBanner />
      <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
        CHECK · MENU
      </p>
      <SamplePlate />
      <p className="text-sm">
        <Link href="/try/recipes" className="text-[var(--accent)]">
          Walk the sample recipe card →
        </Link>
      </p>
    </div>
  );
}
