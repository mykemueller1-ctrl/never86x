"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Honesty } from "@/components/Honesty";
import { Legend } from "@/components/Legend";
import { PhoneSeat } from "@/components/PhoneSeat";
import { ScreenStatus } from "@/components/ScreenStatus";
import { SeatLogin } from "@/components/SeatLogin";
import {
  AI_RULE,
  HEADLINE,
  INVOICE_Q,
  METHOD,
  OFFER,
  ONE_SENTENCE,
  PLATE_Q,
  PRODUCT,
  SHIFT_Q,
  TAGLINE,
  WHO,
} from "@/lib/brand";
import { replaceDraft, type CheckNote, type SeatDraft } from "@/lib/draft";
import { isEmbeddedWebview } from "@/lib/embedded";
import { formatDelta, formatMoney, formatPercent } from "@/lib/money";
import { nextMove } from "@/lib/nextMove";
import { SAMPLE_MOZZ } from "@/lib/sample";

const InvoiceCheck = dynamic(() => import("@/components/InvoiceCheck").then((mod) => mod.InvoiceCheck), {
  loading: () => <ScreenStatus kind="loading">Opening the invoice check…</ScreenStatus>,
});
const LaborCheck = dynamic(() => import("@/components/LaborCheck").then((mod) => mod.LaborCheck), {
  loading: () => <ScreenStatus kind="loading">Opening the shift check…</ScreenStatus>,
});
const MenuCheck = dynamic(() => import("@/components/MenuCheck").then((mod) => mod.MenuCheck), {
  loading: () => <ScreenStatus kind="loading">Opening the plate check…</ScreenStatus>,
});

function draftHasText(draft: SeatDraft) {
  return [draft.earlier, draft.later, draft.recipe, draft.schedule, draft.clock].some((value) => value.trim());
}

export function OneSeat() {
  const params = useSearchParams();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [move, setMove] = useState("Check the new price with your rep.");
  const [embedded, setEmbedded] = useState(false);
  const source = params.get("utm_source") || params.get("ref") || "x";
  const percent = formatPercent(SAMPLE_MOZZ.delta, SAMPLE_MOZZ.previous);

  useEffect(() => {
    setEmbedded(isEmbeddedWebview(navigator.userAgent));
    const auth = params.get("auth");
    if (auth === "consent") {
      setLoginOpen(true);
      setNotice("Check the consent line, then continue.");
    }
    if (auth === "error") {
      setLoginOpen(true);
      setNotice("Google did not sign you in. Use the email link.");
    }
  }, [params]);

  useEffect(() => {
    let ignore = false;
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((body) => {
        if (ignore || !body.email) return;
        setEmail(String(body.email));
        setName(body.name || "");
        setRestaurant(body.restaurant || "");
      })
      .catch(() => undefined);
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const token = params.get("login");
    if (!token) return;
    let ignore = false;
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json().then((body) => ({ ok: response.ok, body })))
      .then(({ ok, body }) => {
        if (ignore) return;
        if (!ok) {
          setLoginOpen(true);
          setNotice(typeof body.reason === "string" ? body.reason : "That link did not sign you in.");
          return;
        }
        if (body.draft && draftHasText(body.draft)) replaceDraft(body.draft);
        router.replace("/seat");
        setEmail(String(body.email));
        setName(body.name || "");
        setRestaurant(body.restaurant || "");
      })
      .catch(() => {
        if (!ignore) setNotice("That link did not sign you in.");
      });
    return () => {
      ignore = true;
    };
  }, [params, router]);

  useEffect(() => {
    function onCheck(event: Event) {
      const note = (event as CustomEvent<CheckNote>).detail;
      if (!note) return;
      setMove(nextMove(note.tool, note.rows));
      if (!email) return;
      const checks = JSON.parse(localStorage.getItem("never86x.seat.checks") || "[]");
      fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checks }),
      }).catch(() => undefined);
    }
    window.addEventListener("never86-check", onCheck);
    return () => window.removeEventListener("never86-check", onCheck);
  }, [email]);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/auth/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, restaurant }),
    });
    if (!response.ok) setNotice("The name did not save.");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <p className="text-xs font-semibold tracking-widest text-[var(--muted)]">{PRODUCT}</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight">{HEADLINE}</h1>
      <p className="mt-3 text-lg">{TAGLINE}</p>
      <p className="mt-3 text-[var(--muted)]">{ONE_SENTENCE}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {METHOD}. For {WHO}.
      </p>

      <div className="mt-4">
        {email ? (
          <form className="rounded-2xl border border-[var(--line)] p-4" onSubmit={saveProfile}>
            <p className="text-sm font-semibold">Your free seat is on for {email}.</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{OFFER}</p>
            <label className="mt-3 block text-sm font-medium" htmlFor="seat-name">
              Your name, if you want it on the note
              <input
                id="seat-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-3 text-base"
              />
            </label>
            <label className="mt-3 block text-sm font-medium" htmlFor="seat-restaurant">
              Restaurant name, optional
              <input
                id="seat-restaurant"
                value={restaurant}
                onChange={(event) => setRestaurant(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-3 text-base"
              />
            </label>
            <button type="submit" className="mt-3 rounded-xl bg-[var(--ink)] px-4 py-3 text-base font-semibold text-white">
              Save the optional details
            </button>
            <p className="mt-3 text-sm">
              <a className="underline" href="/unsubscribe">
                Unsubscribe
              </a>
            </p>
          </form>
        ) : (
          <button
            type="button"
            className="w-full rounded-xl bg-[var(--ink)] px-4 py-3 text-base font-semibold text-white"
            onClick={() => setLoginOpen(true)}
          >
            Email me this seat
          </button>
        )}
      </div>

      <section className="mt-6 rounded-2xl border border-[var(--line)] p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">FICTIONAL SAMPLE</p>
          <Honesty kind="Sample" />
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">Latest case</p>
        <p className="text-3xl font-bold">{formatMoney(SAMPLE_MOZZ.latest)}</p>
        <p className="mt-1 text-sm font-semibold">
          {formatDelta(SAMPLE_MOZZ.delta)} per case{percent ? ` · +${percent}` : ""}
        </p>
        <div className="mt-3">
          <Legend />
        </div>
        <p className="mt-3 text-sm">
          This mozzarella sample is fictional. Matching papers you paste are read on this phone. One missing price stays Missing.
        </p>
        <p className="mt-3 rounded-xl bg-[var(--accent-soft)] px-3 py-3 text-sm font-semibold">{move}</p>
      </section>

      <section id="invoices" className="mt-8">
        <h2 className="text-2xl font-bold">{INVOICE_Q}</h2>
        <InvoiceCheck />
      </section>
      <section id="labor" className="mt-10">
        <h2 className="text-2xl font-bold">{SHIFT_Q}</h2>
        <LaborCheck />
      </section>
      <section id="plate" className="mt-10">
        <h2 className="text-2xl font-bold">{PLATE_Q}</h2>
        <MenuCheck />
      </section>

      <p className="mt-8 text-sm text-[var(--muted)]">{AI_RULE}</p>
      <PhoneSeat start="" compact />

      <SeatLogin
        open={loginOpen}
        embedded={embedded}
        source={source}
        notice={notice}
        onClose={() => setLoginOpen(false)}
        onSignedIn={(next) => {
          setEmail(next);
          setLoginOpen(false);
        }}
      />
    </div>
  );
}
