import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { SamplePlate } from "@/components/SamplePanels";
import { PLATE_Q, pageMeta } from "@/lib/brand";

export const metadata = pageMeta(
  "/try/recipes",
  PLATE_Q,
  "Fictional plate. Your recipe stays on the plate check, on this phone.",
);

export default function TryRecipesPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-10">
      <Honesty kind="Sample" />
      <h1 className="text-3xl font-bold">{PLATE_Q}</h1>
      <SamplePlate />
      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/check/menu" className="font-semibold text-[var(--accent)]">
          Use my recipe card
        </Link>
        <Link href="/try/desk" className="underline">
          Sample desk
        </Link>
      </div>
      <p className="text-xs text-[var(--muted)]">
        These prices are the fictional sample. Your recipe stays on the plate check, on this phone.
      </p>
    </div>
  );
}
