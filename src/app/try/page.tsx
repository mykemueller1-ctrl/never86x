import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { PlaceNameForm } from "@/components/PlaceNameForm";
import { ONE_SENTENCE, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/try", "Start with your papers", ONE_SENTENCE);

export default function TryPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Honesty kind="Sample" />
      <h1 className="mt-4 text-3xl font-bold">Start with your place, or the sample.</h1>
      <p className="mt-2 text-[var(--muted)]">
        Your invoices stay on this phone. The sample is a fictional restaurant. Nothing is uploaded.
      </p>
      <PlaceNameForm />
      <Link href="/try/desk" className="mt-4 block text-center text-sm text-[var(--muted)] underline">
        Just show me the sample restaurant
      </Link>
    </div>
  );
}
