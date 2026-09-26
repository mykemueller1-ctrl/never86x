import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { SignInToSave } from "@/components/SignInToSave";
import {
  SampleInvoice,
  SampleLabor,
  SampleModeBanner,
  SamplePlate,
} from "@/components/SamplePanels";

export const metadata = { title: "Owner seat — Sample mode" };

export default async function SeatPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const { start } = await searchParams;
  const focus =
    start === "data" ? "What's missing" : start === "actions" ? "My actions" : "Owner desk";

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
      <SampleModeBanner />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
            ONE SEAT · {focus.toUpperCase()}
          </p>
          <h1 className="text-3xl font-bold">Your sample owner seat</h1>
        </div>
        <Honesty kind="Sample" />
      </div>
      <p className="text-sm text-[var(--muted)]">
        Signed out, this seat opens on the fictional sample. Saving your own papers
        asks on this page. It does not leave for another login.
      </p>

      {start === "actions" ? (
        <article className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <h2 className="font-semibold">Next action</h2>
          <p className="mt-2 text-sm">
            Check the sample mozzarella price with the vendor before the next order.{" "}
            <Honesty kind="Sample" />
          </p>
        </article>
      ) : null}

      {start === "data" ? (
        <article className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <h2 className="font-semibold">What&apos;s missing on the sample</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              Schedule <Honesty kind="Missing" /> for this week
            </li>
            <li>
              Time-clock report <Honesty kind="Estimated" /> · received, needs review
            </li>
            <li>
              Invoices & credits <Honesty kind="Verified" /> · reviewed sample files
            </li>
          </ul>
        </article>
      ) : null}

      <SampleInvoice />
      <SampleLabor />
      <SamplePlate />
      <SignInToSave label="Save my own papers" />
      <p className="text-sm">
        <Link href="/try/desk" className="text-[var(--accent)]">
          Keep exploring the sample desk →
        </Link>
      </p>
    </div>
  );
}
