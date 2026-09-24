import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export default function TryLaborPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Honesty kind="Sample" />
      <h1 className="mt-3 text-3xl font-bold">Scheduled until 9. Who stayed until 11?</h1>
      <p className="mt-2 text-[var(--muted)]">
        Start with the schedule you already use. Fictional staff. Real uploads stay in your
        private seat.
      </p>
      <div className="mt-6 space-y-3">
        <button className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white">
          Read sample schedule
        </button>
        <Link href="/try/desk" className="block text-center text-sm underline">
          Back to owner desk
        </Link>
      </div>
    </div>
  );
}
