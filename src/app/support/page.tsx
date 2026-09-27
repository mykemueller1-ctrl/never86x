import Link from "next/link";
import { Honesty } from "@/components/Honesty";
import { BRAND, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/support", "Support", `Help for ${BRAND}.`);

export default function SupportPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Support</h1>
      <p className="mt-2 text-[var(--muted)]">A short note back. No ticket maze.</p>
      <div className="mt-6 space-y-4 text-sm">
        <div className="rounded-xl border border-[var(--line)] p-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Email</h2>
            {supportEmail ? <Honesty kind="Verified" /> : <Honesty kind="Missing" />}
          </div>
          <p className="mt-2">
            {supportEmail ? (
              <a className="text-[var(--accent)]" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </a>
            ) : (
              "A support address is not published yet."
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] p-4">
          <h2 className="font-semibold">On this site</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--muted)]">
            <li>
              <Link href="/onboarding">Start</Link>
            </li>
            <li>
              <Link href="/status">Status</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
