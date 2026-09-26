import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { SampleLabor } from "@/components/SamplePanels";

export default function TryLaborPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-10">
      <Honesty kind="Sample" />
      <h1 className="text-3xl font-bold">Scheduled until 9. Who stayed until 11?</h1>
      <p className="text-[var(--muted)]">
        Fictional staff. Paste your own schedule on the labor check. No login. Nothing is uploaded.
      </p>
      <SampleLabor />
      <div className="flex flex-wrap gap-4 text-sm">
        <a href="#labor" className="font-semibold text-[var(--accent)]">
          Read sample schedule
        </a>
        <Link href="/check/labor" className="underline">
          Open the labor check
        </Link>
        <Link href="/try/desk" className="underline">
          Back to owner desk
        </Link>
      </div>
    </div>
  );
}
