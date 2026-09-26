"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SeatLogin } from "@/components/SeatLogin";
import { Honesty } from "@/components/Honesty";
import { BRAND } from "@/lib/brand";
import { isEmbeddedWebview } from "@/lib/embedded";
import { EVENT_LABEL, formatWhen, type CountSet, type EventName, type FunnelStep, type StatsWindow } from "@/lib/ownerStats";

type SignupRow = {
  email: string;
  name: string | null;
  restaurant: string | null;
  source: string;
  firstSeen: string;
  checks: string[];
  lastActive: string;
  test: boolean;
};

type Board = {
  counts: Record<StatsWindow, CountSet>;
  funnels: Record<StatsWindow, FunnelStep[]>;
  signups: SignupRow[];
  testRows: number;
};

const PERIODS: { id: StatsWindow; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "Last 7 days" },
  { id: "all", label: "All time" },
];

export function OwnerStats({ googleConfigured = false }: { googleConfigured?: boolean }) {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState<string | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [embedded, setEmbedded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmbedded(isEmbeddedWebview(navigator.userAgent));
    let ignore = false;
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then(async (body) => {
        if (ignore) return;
        if (!body.email) {
          setReady(true);
          return;
        }
        setEmail(String(body.email));
        await load(ignore);
      })
      .catch(() => {
        if (!ignore) setError("The counts did not load.");
        setReady(true);
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function load(ignore = false) {
    const response = await fetch("/api/owner/stats");
    const body = await response.json().catch(() => ({}));
    if (ignore) return;
    if (!response.ok) {
      setLocked(typeof body.reason === "string" ? body.reason : "This page is only for the owner.");
      setBoard(null);
      setReady(true);
      return;
    }
    setLocked(null);
    setBoard(body);
    setReady(true);
  }

  return (
    <div data-app-shell className="min-h-screen bg-[#f3f0ea] text-[#1c1916]">
      <header className="flex items-center justify-between gap-3 border-b border-[#e4ddd4] bg-[#14171c] px-4 py-3 text-[#f4efe8]">
        <p className="text-sm font-extrabold tracking-wide">
          NEVER86<span className="text-[var(--accent)]">&apos;D</span>
        </p>
        <p className="text-sm">Owner numbers</p>
        <Link href="/seat" className="text-sm text-[#f4efe8] no-underline">
          Seat
        </Link>
      </header>
      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-5">
        <div>
          <h1 className="text-3xl font-bold">What the free seat did</h1>
          <p className="mt-2 text-sm text-[#5c564e]">
            {BRAND} counts this on its own. No other company receives these numbers. Today starts at midnight Central Time.
          </p>
          <p className="mt-2 text-sm text-[#5c564e]">
            Read a row as a step. The percent is how many of the people in the step above reached this one. A Missing
            percent means the step above has not happened yet.
          </p>
        </div>

        {!ready ? <p className="text-sm">Opening the numbers…</p> : null}
        {error ? <p className="text-sm">{error}</p> : null}

        {ready && !email ? (
          <section className="rounded-2xl border border-[#e4ddd4] bg-white p-4">
            <h2 className="text-xl font-bold">Sign in to read the owner numbers</h2>
            <div className="mt-3">
              <SeatLogin
                asPage
                open
                embedded={embedded}
                source="owner"
                notice={null}
                googleConfigured={googleConfigured}
                onClose={() => undefined}
                onSignedIn={async (next) => {
                  setEmail(next);
                  await load();
                }}
              />
            </div>
          </section>
        ) : null}

        {locked ? (
          <section className="rounded-2xl border border-[#e4ddd4] bg-white p-4">
            <p className="font-semibold">{locked}</p>
            {email ? <p className="mt-2 text-sm text-[#5c564e]">Signed in as {email}.</p> : null}
          </section>
        ) : null}

        {board ? <BoardView board={board} /> : null}
      </main>
    </div>
  );
}

function BoardView({ board }: { board: Board }) {
  return (
    <>
      {board.testRows > 0 ? (
        <p className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm font-semibold">
          Test data. Rows marked Test were planted so this page can be read. They are not live restaurants.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <a className="rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white no-underline" href="/api/owner/signups">
          Download signups
        </a>
        <a className="rounded-lg border border-[#e4ddd4] bg-white px-3 py-2 text-sm font-semibold no-underline" href="/api/owner/events">
          Download events
        </a>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#e4ddd4] bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-[#17191c] text-[#f7f3ee]">
            <tr>
              <th className="px-3 py-2 font-semibold">Step</th>
              {PERIODS.map((period) => (
                <th key={period.id} className="px-3 py-2 font-semibold">
                  {period.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Object.keys(EVENT_LABEL) as EventName[]).map((name) => (
              <tr key={name} className="border-t border-[#eee6dc]">
                <th className="px-3 py-2 font-semibold">{EVENT_LABEL[name]}</th>
                {PERIODS.map((period) => (
                  <td key={period.id} className="px-3 py-2">
                    {board.counts[period.id][name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {PERIODS.map((period) => (
          <section key={period.id} className="rounded-2xl border border-[#e4ddd4] bg-white p-4">
            <h2 className="font-bold">{period.label}</h2>
            <ul className="mt-3 grid gap-3 text-sm">
              {board.funnels[period.id].map((step) => (
                <li key={step.name}>
                  <p className="font-semibold">
                    {step.label}: {step.count}
                  </p>
                  {step.from === null ? (
                    <p className="text-[#5c564e]">This is the first step.</p>
                  ) : step.percent === null ? (
                    <p>
                      Rate <Honesty kind="Missing" />
                    </p>
                  ) : (
                    <p className="text-[#5c564e]">
                      {step.percent}% of the {step.from} in the step above.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="overflow-x-auto rounded-2xl border border-[#e4ddd4] bg-white">
        <h2 className="px-3 py-3 text-lg font-bold">Every signup</h2>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-t border-[#eee6dc] text-[#5c564e]">
            <tr>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Restaurant</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">First seen</th>
              <th className="px-3 py-2">Checks</th>
              <th className="px-3 py-2">Last active</th>
            </tr>
          </thead>
          <tbody>
            {board.signups.length === 0 ? (
              <tr>
                <td className="px-3 py-3" colSpan={7}>
                  No signups yet. <Honesty kind="Missing" />
                </td>
              </tr>
            ) : (
              board.signups.map((row) => (
                <tr key={row.email} className="border-t border-[#eee6dc]">
                  <td className="px-3 py-2">
                    {row.email}{" "}
                    {row.test ? <span className="ml-1 text-xs font-semibold text-[var(--accent)]">Test</span> : null}
                  </td>
                  <td className="px-3 py-2">{row.name || "—"}</td>
                  <td className="px-3 py-2">{row.restaurant || "—"}</td>
                  <td className="px-3 py-2">{row.source}</td>
                  <td className="px-3 py-2">{formatWhen(row.firstSeen)}</td>
                  <td className="px-3 py-2">{row.checks.length ? row.checks.join(", ") : "—"}</td>
                  <td className="px-3 py-2">{formatWhen(row.lastActive)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}
