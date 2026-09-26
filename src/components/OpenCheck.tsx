import Link from "next/link";

export function OpenCheck({ sampleHref }: { sampleHref: string }) {
  return (
    <p className="mt-3 rounded-2xl bg-[var(--accent-soft)] px-3 py-3 text-sm">
      This check works signed out.{" "}
      <Link href={sampleHref} className="font-semibold text-[var(--accent)]">
        Try the example
      </Link>
      {" · "}
      <Link href="/login" className="font-semibold">
        Email sign-in
      </Link>
    </p>
  );
}
