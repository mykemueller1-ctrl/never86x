import { BRAND, HONESTY_RULE, OFFER, PRODUCT, pageMeta } from "@/lib/brand";

export const metadata = pageMeta(
  "/privacy",
  "Privacy",
  `${BRAND} ${PRODUCT} reads papers in the browser. Nothing is uploaded.`,
);

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Privacy and your restaurant records</h1>
      <p className="mt-3 text-[var(--muted)]">{OFFER}</p>
      <p className="mt-3 text-[var(--muted)]">
        The checks read invoices, recipes, and schedules in your browser. Those files are not
        uploaded. A photo is read on this phone. The first photo downloads the reader. The picture
        is not sent off the phone. A low-confidence read is flagged and is not treated as a price.
        A name and a kept card stay in this browser until you clear them. Copying or screenshotting
        a result is your choice. {HONESTY_RULE} Mailbox connection is not on.
      </p>
    </div>
  );
}
