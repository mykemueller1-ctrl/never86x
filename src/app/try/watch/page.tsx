import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export const metadata = {
  title: "Watch the walkthrough",
  description: "One invoice. One answer. Then paste your own papers. No login.",
};

export default function TryWatchPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Honesty kind="Sample" />
      <h1 className="mt-3 text-3xl font-bold">See the sample, then use your papers.</h1>
      <p className="mt-2 text-[var(--muted)]">
        The film uses fictional invoices. Your files are not in it.
      </p>
      <video
        controls
        playsInline
        preload="metadata"
        className="mt-6 aspect-video w-full rounded-2xl bg-black"
        src="https://app.never86.app/media/never86-landscape-v24.mp4"
      >
        <a href="https://app.never86.app/media/never86-landscape-v24.mp4">Watch the walkthrough film</a>
      </video>
      <p className="mt-2 text-sm">
        <a href="https://app.never86.app/media/never86-landscape-v24.mp4" className="text-[var(--accent)]">
          Open the film
        </a>
      </p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link href="/check/invoices" className="font-semibold text-[var(--accent)]">
          Check my invoices
        </Link>
        <Link href="/check/menu" className="font-semibold text-[var(--accent)]">
          Cost a plate
        </Link>
        <Link href="/check/labor" className="underline">
          Check labor
        </Link>
        <Link href="/try" className="underline">
          Sample first
        </Link>
      </div>
    </div>
  );
}
