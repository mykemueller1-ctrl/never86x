"use client";

import Link from "next/link";
import { useState } from "react";
import { Honesty } from "@/components/Honesty";
import { shareUrl } from "@/lib/brand";
import { presentRows, rowsToCopy, type CheckRow } from "@/lib/honesty";
import { saveCard, type SavedCard } from "@/lib/history";

export function ResultCard({
  headline,
  rows,
  sample,
  tool,
  place,
  photoNote = null,
  lowConfidence = false,
}: {
  headline: string;
  rows: CheckRow[];
  sample: boolean;
  tool: SavedCard["tool"];
  place: string;
  photoNote?: string | null;
  lowConfidence?: boolean;
}) {
  const shown = presentRows(rows, sample);
  const title = place ? `${place} — ${headline}` : headline;
  const copyText = rowsToCopy(title, shown, sample, shareUrl("/seat"));
  const [copied, setCopied] = useState<"yes" | "show" | null>(null);
  const [kept, setKept] = useState(false);
  const [keepError, setKeepError] = useState<string | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied("yes");
    } catch {
      setCopied("show");
    }
  }

  return (
    <article id="result-card" className="mt-6 rounded-2xl border border-[var(--line)] bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        {sample ? <Honesty kind="Sample" /> : null}
        {lowConfidence ? (
          <p role="status" className="badge badge-missing">
            Low confidence
          </p>
        ) : null}
        <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">RESULT · ON THIS PHONE</p>
      </div>
      <h2 className="mt-2 text-2xl font-bold leading-tight">{title}</h2>
      {photoNote ? <p className="mt-2 text-sm">{photoNote}</p> : null}
      <ul className="mt-4 space-y-3">
        {shown.map((row, index) => (
          <li key={`${row.label}-${index}`} className="border-t border-[var(--line)] pt-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{row.label}</p>
              <Honesty kind={row.honesty} />
            </div>
            <p className="mt-1 text-lg font-semibold">{row.value}</p>
            {row.detail ? <p className="mt-1 text-sm text-[var(--muted)]">{row.detail}</p> : null}
          </li>
        ))}
      </ul>
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={copy}
          className="rounded-xl bg-[var(--ink)] px-4 py-3 text-base font-semibold text-white"
        >
          {copied === "yes" ? "Copied" : "Copy this card"}
        </button>
        <button
          type="button"
          onClick={() => {
            const error = saveCard({ tool, title, text: copyText });
            if (error) {
              setKeepError(error);
              setKept(false);
              return;
            }
            setKeepError(null);
            setKept(true);
          }}
          className="rounded-xl border border-[var(--line)] px-4 py-3 text-base font-semibold"
        >
          {kept ? "Kept on this phone" : "Keep on this phone"}
        </button>
        {keepError ? (
          <p role="alert" className="text-sm font-medium text-[var(--miss)]">
            {keepError}
          </p>
        ) : null}
        {kept ? (
          <Link href="/seat" className="text-center text-sm text-[var(--accent)]">
            See history on this phone
          </Link>
        ) : null}
      </div>
      {copied === "show" ? (
        <textarea readOnly value={copyText} rows={8} className="mt-3 w-full rounded-lg border border-[var(--line)] p-3 text-sm" />
      ) : null}
      <p className="mt-3 text-xs text-[var(--muted)]">
        Screenshot the card or copy the text. Nothing was uploaded.
      </p>
    </article>
  );
}
