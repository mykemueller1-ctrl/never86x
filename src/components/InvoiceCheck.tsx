"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaperField } from "@/components/PaperField";
import { ResultCard } from "@/components/ResultCard";
import { checkInvoices } from "@/lib/parseInvoice";
import { readPaper } from "@/lib/readPaper";
import { loadPlace } from "@/lib/history";
import {
  SAMPLE_INVOICE_EARLIER,
  SAMPLE_INVOICE_LATER,
  papersMatch,
} from "@/lib/sample";

export function InvoiceCheck() {
  const params = useSearchParams();
  const [earlier, setEarlier] = useState("");
  const [later, setLater] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [place, setPlace] = useState("");
  const [ran, setRan] = useState(false);

  useEffect(() => {
    setPlace(loadPlace());
    if (params.get("sample") === "1") {
      setEarlier(SAMPLE_INVOICE_EARLIER);
      setLater(SAMPLE_INVOICE_LATER);
      setRan(true);
    }
  }, [params]);

  const result = ran ? checkInvoices(earlier, later) : null;
  const sample =
    papersMatch(earlier, SAMPLE_INVOICE_EARLIER) && papersMatch(later, SAMPLE_INVOICE_LATER);

  async function onFile(which: "earlier" | "later", file: File | undefined) {
    if (!file) return;
    const read = await readPaper(file);
    setNotice(read.notice);
    if (!read.text) return;
    if (which === "earlier") setEarlier(read.text);
    else setLater(read.text);
    setRan(false);
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-[var(--muted)]">
        A photo needs typing. PDF text, CSV, and pasted lines are read here.
      </p>
      <div className="mt-4 grid gap-4">
        <PaperField
          id="earlier-invoice"
          label="Older invoice"
          value={earlier}
          placeholder={"Vendor: Sample Foods\nMozzarella cheese whole milk 20 lb case $48.00"}
          onChange={(value) => {
            setEarlier(value);
            setRan(false);
          }}
          onFile={(file) => onFile("earlier", file)}
        />
        <PaperField
          id="later-invoice"
          label="Newer invoice"
          value={later}
          placeholder={"Vendor: Sample Foods\nMozzarella cheese whole milk 20 lb case $56.00"}
          onChange={(value) => {
            setLater(value);
            setRan(false);
          }}
          onFile={(file) => onFile("later", file)}
        />
      </div>
      {notice ? <p className="mt-3 text-sm">{notice}</p> : null}
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={() => setRan(true)}
          className="rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white"
        >
          Compare the two invoices
        </button>
        <button
          type="button"
          onClick={() => {
            setEarlier(SAMPLE_INVOICE_EARLIER);
            setLater(SAMPLE_INVOICE_LATER);
            setNotice("Sample loaded. These are fictional invoices.");
            setRan(true);
          }}
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
        />
      ) : result ? (
        <p className="mt-4 text-sm font-medium">{result.headline}</p>
      ) : null}
    </div>
  );
}
