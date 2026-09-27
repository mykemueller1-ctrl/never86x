"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Honesty } from "@/components/Honesty";
import { ScreenStatus } from "@/components/ScreenStatus";
import { INVOICE_Q, OFFER, PLATE_Q, PRODUCT, SHIFT_Q } from "@/lib/brand";
import { clearCards, readHistory, removeCard, savePlace, type SavedCard } from "@/lib/history";

const TOOL_HREF = {
  invoices: "/check/invoices",
  plate: "/check/menu",
  labor: "/check/labor",
} as const;

export function PhoneSeat({ start, compact = false }: { start: string; compact?: boolean }) {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [place, setPlace] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedName, setSavedName] = useState(false);

  useEffect(() => {
    const history = readHistory();
    setCards(history.cards);
    setPlace(history.place);
    setError(history.error);
    setReady(true);
  }, []);

  const focus =
    start === "data" ? "What's missing" : start === "actions" ? "Kept cards" : PRODUCT;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {compact ? null : (
        <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">NO LOGIN · {focus.toUpperCase()}</p>
      )}
      {compact ? (
        <h2 className="mt-8 text-2xl font-bold">History stays on this phone.</h2>
      ) : (
        <h1 className="mt-2 text-3xl font-bold leading-tight">History stays on this phone.</h1>
      )}
      <p className="mt-2 text-[var(--muted)]">
        {OFFER} Keeping a card stores it in this browser only. Nothing is uploaded.
      </p>

      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          const saveError = savePlace(place);
          setError(saveError);
          setSavedName(!saveError);
        }}
      >
        <label className="block text-sm font-medium" htmlFor="place-name">
          Restaurant name on the card
          <input
            id="place-name"
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder="Optional. Stays on this phone."
            className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-3 text-base"
          />
        </label>
        <button type="submit" className="mt-2 rounded-xl bg-[var(--ink)] px-4 py-3 text-base font-semibold text-white">
          Save the name here
        </button>
        {savedName ? (
          <p role="status" className="mt-2 text-sm">
            Name saved on this phone.
          </p>
        ) : null}
      </form>

      <div className="mt-6 grid gap-2 text-base font-semibold">
        <Link href="/check/invoices" className="rounded-xl bg-[var(--accent)] px-4 py-3 text-center text-white">
          {INVOICE_Q}
        </Link>
        <Link href="/check/labor" className="rounded-xl border border-[var(--line)] px-4 py-3 text-center">
          {SHIFT_Q}
        </Link>
        <Link href="/check/menu" className="rounded-xl border border-[var(--line)] px-4 py-3 text-center">
          {PLATE_Q}
        </Link>
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{start === "data" ? "What's missing" : "Kept on this phone"}</h2>
          {ready && !error && cards.length === 0 ? <Honesty kind="Missing" /> : null}
        </div>
        {!ready ? <ScreenStatus kind="loading">Opening cards saved on this phone…</ScreenStatus> : null}
        {ready && error ? <ScreenStatus kind="error">{error}</ScreenStatus> : null}
        {ready && !error && cards.length === 0 ? (
          <ScreenStatus kind="empty">
            No cards yet. Run a check, then tap Keep on this phone. The sample desk is separate.
          </ScreenStatus>
        ) : null}
        <ul className="mt-3 space-y-3">
          {cards.map((card) => (
            <li key={card.id} className="rounded-2xl border border-[var(--line)] p-4">
              <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">{card.tool}</p>
              <p className="mt-1 font-semibold">{card.title}</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm">{card.text}</pre>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Link href={TOOL_HREF[card.tool]} className="font-semibold text-[var(--accent)]">
                  Open the check
                </Link>
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    const removeError = removeCard(card.id);
                    if (removeError) {
                      setError(removeError);
                      return;
                    }
                    setCards(readHistory().cards);
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        {cards.length > 0 ? (
          <button
            type="button"
            className="mt-4 text-sm underline"
            onClick={() => {
              const clearError = clearCards();
              if (clearError) {
                setError(clearError);
                return;
              }
              setCards([]);
            }}
          >
            Clear history on this phone
          </button>
        ) : null}
      </section>

      <p className="mt-8 text-sm">
        <Link href="/try/desk" className="text-[var(--accent)]">
          Look at the fictional sample desk
        </Link>
      </p>
    </div>
  );
}
