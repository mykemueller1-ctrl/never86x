"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Honesty } from "@/components/Honesty";
import { clearCards, loadCards, loadPlace, removeCard, savePlace, type SavedCard } from "@/lib/history";

const TOOL_HREF = {
  invoices: "/check/invoices",
  plate: "/check/menu",
  labor: "/check/labor",
} as const;

export function PhoneSeat({ start }: { start: string }) {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [place, setPlace] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCards(loadCards());
    setPlace(loadPlace());
    setReady(true);
  }, []);

  const focus =
    start === "data" ? "What's missing" : start === "actions" ? "Kept cards" : "This phone";

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">NO LOGIN · {focus.toUpperCase()}</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight">History stays on this phone.</h1>
      <p className="mt-2 text-[var(--muted)]">
        The checks work with no account. Keeping a card stores it in this browser only. Nothing is
        uploaded. A login to sync phones is not on — this page does not send you to ChatGPT.
      </p>

      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          savePlace(place);
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
      </form>

      <div className="mt-6 grid gap-2 text-base font-semibold">
        <Link href="/check/invoices" className="rounded-xl bg-[var(--accent)] px-4 py-3 text-center text-white">
          Check invoices
        </Link>
        <Link href="/check/menu" className="rounded-xl border border-[var(--line)] px-4 py-3 text-center">
          Cost a plate
        </Link>
        <Link href="/check/labor" className="rounded-xl border border-[var(--line)] px-4 py-3 text-center">
          Check labor
        </Link>
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{start === "data" ? "What's missing" : "Kept on this phone"}</h2>
          {ready && cards.length === 0 ? <Honesty kind="Missing" /> : null}
        </div>
        {ready && cards.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            No cards yet. Run a check, then tap Keep on this phone. The sample desk is separate.
          </p>
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
                  onClick={() => setCards(removeAnd(card.id))}
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
              clearCards();
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

function removeAnd(id: string): SavedCard[] {
  removeCard(id);
  return loadCards();
}
