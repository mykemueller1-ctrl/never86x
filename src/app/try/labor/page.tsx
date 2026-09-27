import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { SampleLabor } from "@/components/SamplePanels";
import { SHIFT_Q, pageMeta } from "@/lib/brand";

export const metadata = pageMeta(
  "/try/labor",
  SHIFT_Q,
  "Fictional staff. Paste your own schedule on the labor check. Nothing is uploaded.",
);

export default function TryLaborPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-10">
      <Honesty kind="Sample" />
      <h1 className="text-3xl font-bold">{SHIFT_Q}</h1>
      <p className="text-[var(--muted)]">
        Fictional staff. Paste your own schedule on the labor check. No login. Nothing is uploaded.
      </p>
      <SampleLabor />
      <div className="flex flex-wrap gap-4 text-sm">
        <a href="#labor" className="font-semibold text-[var(--accent)]">
          Read sample schedule
        </a>
        <Link href="/check/labor" className="underline">
          {SHIFT_Q}
        </Link>
        <Link href="/try/desk" className="underline">
          Back to the sample desk
        </Link>
      </div>
    </div>
  );
}
