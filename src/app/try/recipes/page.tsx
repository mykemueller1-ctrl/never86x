import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { SamplePlate } from "@/components/SamplePanels";

export default function TryRecipesPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-10">
      <Honesty kind="Sample" />
      <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
        THE RECIPE BEHIND THE MENU
      </p>
      <SamplePlate />
      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/check/menu" className="font-semibold text-[var(--accent)]">
          Use my recipe card →
        </Link>
        <Link href="/try/desk" className="underline">
          Explore the sample workspace →
        </Link>
      </div>
      <p className="text-xs text-[var(--muted)]">
        These prices are the fictional sample. Your recipe stays on the plate check, on this phone.
      </p>
    </div>
  );
}
