"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaperField } from "@/components/PaperField";
import { ResultCard } from "@/components/ResultCard";
import { ScreenStatus } from "@/components/ScreenStatus";
import { usePaperSlot } from "@/components/usePaperSlot";
import { INVOICE_Q } from "@/lib/brand";
import { readDraft, rememberCheck, writeDraft } from "@/lib/draft";
import { checkInvoices } from "@/lib/parseInvoice";
import { loadPlace } from "@/lib/history";
import { trackSeat } from "@/lib/track";
import { applyPhotoTrust, tighterTrust } from "@/lib/photoHonesty";
import {
  SAMPLE_INVOICE_EARLIER,
  SAMPLE_INVOICE_LATER,
  papersMatch,
} from "@/lib/sample";

const STATUS = "invoice-status";

export function InvoiceCheck() {
  const params = useSearchParams();
  const older = usePaperSlot();
  const newer = usePaperSlot();
  const [earlier, setEarlier] = useState("");
  const [later, setLater] = useState("");
  const [place, setPlace] = useState("");
  const [ran, setRan] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setPlace(loadPlace());
    if (params.get("sample") === "1") {
      trackSeat("check_start", "sample");
      setEarlier(SAMPLE_INVOICE_EARLIER);
      setLater(SAMPLE_INVOICE_LATER);
      setRan(true);
      return;
    }
    const draft = readDraft();
    if (draft.earlier) setEarlier(draft.earlier);
    if (draft.later) setLater(draft.later);
  }, [params]);

  useEffect(() => {
    writeDraft({ earlier, later });
  }, [earlier, later]);

  const reading = older.reading || newer.reading;
  const sample =
    papersMatch(earlier, SAMPLE_INVOICE_EARLIER) && papersMatch(later, SAMPLE_INVOICE_LATER);
  const raw = ran ? checkInvoices(earlier, later) : null;
  const result = raw
    ? applyPhotoTrust(raw, tighterTrust(older.trustFor(earlier), newer.trustFor(later)))
    : null;
  const readError = older.error || newer.error;

  const invoiceNote = result?.rows.map((row) => `${row.label}:${row.honesty}`).join("|") ?? "";
  useEffect(() => {
    if (!ran || !result?.rows.length) return;
    rememberCheck({
      tool: "invoices",
      headline: result.headline,
      rows: result.rows.map((row) => ({ label: row.label, value: row.value, honesty: row.honesty })),
    });
    trackSeat("check_complete", sample ? "sample" : "own");
    // invoiceNote is the stable signature. result is read from this render when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceNote, ran, sample]);

  function compare() {
    if (reading) return;
    if (older.blocked(earlier) || newer.blocked(later)) {
      setFormError("A photo is too uncertain to price. Type the lines. No dollar was filled in.");
      setRan(false);
      return;
    }
    if (!earlier.trim() || !later.trim()) {
      setFormError("Paste both invoices.");
      setRan(false);
      return;
    }
    setFormError(null);
    trackSeat("check_start", "own");
    setRan(true);
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-[var(--muted)]">
        A photo is read on this phone. A blurry read is flagged and is not a price. PDF text, CSV,
        and pasted lines are read here. Nothing is uploaded.
      </p>
      <div className="mt-4 grid gap-4">
        <PaperField
          id="earlier-invoice"
          label="Older invoice"
          value={earlier}
          statusId={STATUS}
          busy={older.reading}
          placeholder={"Vendor: Sample Foods\nMozzarella cheese whole milk 20 lb case $48.00"}
          onChange={(value) => {
            setEarlier(value);
            setRan(false);
            setFormError(null);
            older.reset();
          }}
          onFile={async (file) => {
            const text = await older.read(file);
            if (text) {
              setEarlier(text);
              setRan(false);
            }
          }}
        />
        <PaperField
          id="later-invoice"
          label="Newer invoice"
          value={later}
          statusId={STATUS}
          busy={newer.reading}
          placeholder={"Vendor: Sample Foods\nMozzarella cheese whole milk 20 lb case $56.00"}
          onChange={(value) => {
            setLater(value);
            setRan(false);
            setFormError(null);
            newer.reset();
          }}
          onFile={async (file) => {
            const text = await newer.read(file);
            if (text) {
              setLater(text);
              setRan(false);
            }
          }}
        />
      </div>
      <div id={STATUS}>
        {reading ? (
          <ScreenStatus kind="loading">
            {older.notice ?? newer.notice ?? "Reading on this phone. Nothing is uploaded."}
          </ScreenStatus>
        ) : null}
        {!reading && (formError || readError) ? (
          <ScreenStatus kind="error">{formError || readError || ""}</ScreenStatus>
        ) : null}
        {!reading && !formError && !readError && (older.notice || newer.notice) ? (
          <p role="status" className="mt-3 text-sm">
            {[older.notice, newer.notice].filter(Boolean).join(" ")}
          </p>
        ) : null}
        {!reading && !formError && !readError && !ran ? (
          <ScreenStatus kind="empty">{`${INVOICE_Q} Nothing compared yet. Paste both invoices, then compare.`}</ScreenStatus>
        ) : null}
      </div>
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={compare}
          disabled={reading}
          className="rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white"
        >
          Compare the two invoices
        </button>
        <button
          type="button"
          onClick={() => {
            older.reset();
            newer.reset();
            setEarlier(SAMPLE_INVOICE_EARLIER);
            setLater(SAMPLE_INVOICE_LATER);
            setFormError(null);
            trackSeat("check_start", "sample");
            setRan(true);
          }}
          disabled={reading}
          className="rounded-xl border border-[var(--line)] px-4 py-3 text-base font-semibold"
        >
          Use the sample invoices
        </button>
      </div>
      {result && result.rows.length > 0 ? (
        <ResultCard
          headline={result.headline}
          rows={result.rows}
          sample={sample}
          tool="invoices"
          place={place}
          photoNote={result.photoNote}
          lowConfidence={result.lowConfidence}
        />
      ) : result ? (
        <ScreenStatus kind="empty">{result.headline}</ScreenStatus>
      ) : null}
    </div>
  );
}
