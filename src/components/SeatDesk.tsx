"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Honesty } from "@/components/Honesty";
import { SeatLogin } from "@/components/SeatLogin";
import { AI_RULE, BRAND, METHOD, OFFER, SHARE_LINE } from "@/lib/brand";
import { isEmbeddedWebview } from "@/lib/embedded";
import { trackSeat } from "@/lib/track";
import { formatDelta, formatMoney } from "@/lib/money";
import {
  PRAIRIE_EARLIER,
  PRAIRIE_LABOR,
  PRAIRIE_LATER,
  comparePrairie,
  matchSentence,
  productSubtotal,
  type PrairieInvoice,
} from "@/lib/prairie";

const COMPARE = comparePrairie(PRAIRIE_EARLIER, PRAIRIE_LATER);
const VIEWS = ["desk", "ask", "sales", "labor", "invoices", "menu", "recipes", "guides"] as const;
type View = (typeof VIEWS)[number];

const FOOD: View[] = ["invoices", "menu", "recipes", "guides"];

function isView(value: string | null): value is View {
  return VIEWS.includes(value as View);
}

export function SeatDesk({ googleConfigured = false }: { googleConfigured?: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const requested = params.get("view");
  const view: View = isView(requested) ? requested : "desk";
  const [navOpen, setNavOpen] = useState(false);
  const [original, setOriginal] = useState<"earlier" | "later" | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [asked, setAsked] = useState(false);
  const [question, setQuestion] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [embedded, setEmbedded] = useState(false);
  const [ownerLink, setOwnerLink] = useState(false);
  const source = params.get("utm_source") || params.get("ref") || "x";

  useEffect(() => {
    trackSeat("link_open");
  }, []);

  useEffect(() => {
    if (view !== "invoices") return;
    trackSeat("check_start", "sample");
    trackSeat("check_complete", "sample");
  }, [view]);

  useEffect(() => {
    setEmbedded(isEmbeddedWebview(navigator.userAgent));
    let ignore = false;
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((body) => {
        if (!ignore && body.email) setEmail(String(body.email));
      })
      .catch(() => undefined);
    fetch("/api/owner/who")
      .then((response) => response.json())
      .then((body) => {
        if (!ignore && body.owner) setOwnerLink(true);
      })
      .catch(() => undefined);
    return () => {
      ignore = true;
    };
  }, []);

  function openView(next: View) {
    const query = new URLSearchParams(params.toString());
    query.set("view", next);
    router.replace(`/seat?${query.toString()}`);
    setNavOpen(false);
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setEmail(null);
  }

  const lead = COMPARE.lead;
  const title =
    view === "invoices"
      ? "Invoices"
      : view === "labor"
        ? "Labor"
        : view === "ask"
          ? "Ask Never86'd"
          : view === "sales"
            ? "Sales"
            : view === "menu"
              ? "Menu"
              : view === "recipes"
                ? "Recipe cards"
                : view === "guides"
                  ? "Order guides"
                  : "Your owner desk.";

  return (
    <div data-app-shell className="min-h-screen bg-[#f3f0ea] text-[#1c1916] lg:grid lg:grid-cols-[232px_1fr]">
      {navOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
        />
      ) : null}
      <aside
        className={`${navOpen ? "fixed inset-y-0 left-0 z-30 flex" : "hidden"} w-[232px] flex-col bg-[#14171c] text-[#f4efe8] lg:sticky lg:top-0 lg:flex lg:h-screen`}
      >
        <div className="px-4 py-4">
          <p className="text-sm font-extrabold tracking-wide">
            NEVER86<span className="text-[var(--accent)]">&apos;D</span>
          </p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-[#b7aea4]">
            {METHOD.toUpperCase()} · OWNER SEAT
          </p>
        </div>
        <label className="mx-3 block rounded-lg border border-white/10 px-3 py-2 text-sm">
          <span className="sr-only">Restaurant</span>
          <select className="w-full bg-transparent text-sm" defaultValue="demo" aria-label="Restaurant">
            <option value="demo">Demo Restaurant</option>
          </select>
        </label>
        <nav className="mt-4 flex-1 overflow-y-auto px-2 text-sm" aria-label="Owner seat">
          <NavButton current={view} id="desk" onOpen={openView}>
            Owner desk
          </NavButton>
          <NavButton current={view} id="ask" onOpen={openView}>
            Ask Never86&apos;d
          </NavButton>
          <p className="mt-4 px-3 text-[10px] font-semibold tracking-[0.16em] text-[#8d867e]">YOUR RESTAURANT</p>
          <NavButton current={view} id="sales" onOpen={openView}>
            Sales
          </NavButton>
          <NavButton current={view} id="labor" onOpen={openView}>
            Labor
          </NavButton>
          <p className="mt-3 px-3 text-[10px] font-semibold tracking-[0.14em] text-[#8d867e]">FOOD &amp; PURCHASING</p>
          {FOOD.map((id) => (
            <NavButton key={id} current={view} id={id} onOpen={openView} nested>
              {id === "invoices" ? "Invoices" : id === "menu" ? "Menu" : id === "recipes" ? "Recipe cards" : "Order guides"}
            </NavButton>
          ))}
        </nav>
        <div className="border-t border-white/10 px-3 py-3 text-xs text-[#cfc6bc]">
          <button type="button" className="block py-1 text-left" onClick={() => setHistoryOpen((open) => !open)}>
            Private restaurant history
          </button>
          <Link href="/contact" className="block py-1 text-[#cfc6bc] no-underline">
            Talk to Myke
          </Link>
          {ownerLink ? (
            <Link href="/owner/stats" className="block py-1 text-[#cfc6bc] no-underline">
              Owner numbers
            </Link>
          ) : null}
          {email ? (
            <button type="button" className="block py-1 text-left" onClick={signOut}>
              Sign out
            </button>
          ) : (
            <a href="#save-seat" className="block py-1 text-[#cfc6bc] no-underline" onClick={() => setNavOpen(false)}>
              Email sign-in
            </a>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex flex-wrap items-center gap-3 border-b border-[#e4ddd4] bg-[#f7f4ef] px-4 py-3">
          <button
            type="button"
            className="rounded-lg border border-[#ddd4c8] px-3 py-2 text-sm font-semibold lg:hidden"
            onClick={() => setNavOpen(true)}
          >
            Menu
          </button>
          <p className="text-sm text-[#5c564e]">
            {BRAND} <span className="text-[#b7aea4]">|</span> Demo Restaurant
          </p>
          <p className="ml-auto text-xs text-[#6b645c]">
            {view === "invoices" ? "Invoices through 09/23/2026" : "Week containing 09/23/2026"}
          </p>
          <Link
            href="/check/invoices"
            className="rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white no-underline"
          >
            Add a file
          </Link>
        </header>

        <div className="grid gap-4 px-4 py-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)]">
              FICTIONAL TEST DATA · NOT A REAL BUSINESS RECORD
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold">{title}</h1>
              <Honesty kind="Sample" />
            </div>
            <p className="mt-2 text-sm text-[#5c564e]">
              Sample mode is on. These are the Prairie Route papers. {SHARE_LINE}
            </p>

            {view === "desk" || view === "ask" ? (
              <Desk
                asked={asked}
                question={question}
                onQuestion={setQuestion}
                onAsk={(event) => {
                  event.preventDefault();
                  setAsked(true);
                }}
                onInvoices={() => openView("invoices")}
                onLabor={() => openView("labor")}
              />
            ) : null}
            {view === "invoices" && lead ? (
              <InvoiceView original={original} onOriginal={setOriginal} />
            ) : null}
            {view === "labor" ? <LaborView /> : null}
            {view === "sales" ? (
              <EmptyPanel title="No sales report in this sample." />
            ) : null}
            {view === "menu" ? (
              <EmptyPanel title="No plate recipe is in this sample." href="/check/menu" label="Check a plate" />
            ) : null}
            {view === "recipes" ? <EmptyPanel title="No recipe card is in this sample." /> : null}
            {view === "guides" ? <EmptyPanel title="No order guide is in this sample." /> : null}

            {historyOpen ? <History /> : null}

            <section id="save-seat" className="mt-6 rounded-2xl border border-[#e4ddd4] bg-white p-4">
              <h2 className="text-xl font-bold">Save this seat</h2>
              <p className="mt-1 text-sm text-[#5c564e]">{OFFER}</p>
              {email ? (
                <p className="mt-3 text-sm font-semibold">Your free seat is on for {email}.</p>
              ) : (
                <div className="mt-3">
                  <SeatLogin
                    asPage
                    open
                    embedded={embedded}
                    source={source}
                    notice={null}
                    googleConfigured={googleConfigured}
                    onClose={() => undefined}
                    onSignedIn={setEmail}
                  />
                </div>
              )}
            </section>
          </div>
          <Rail />
        </div>
      </div>
    </div>
  );
}

function NavButton({
  id,
  current,
  nested,
  onOpen,
  children,
}: {
  id: View;
  current: View;
  nested?: boolean;
  onOpen: (view: View) => void;
  children: React.ReactNode;
}) {
  const active = current === id;
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={() => onOpen(id)}
      className={`mt-1 block w-full rounded-lg px-3 py-2 text-left ${nested ? "pl-6" : ""} ${
        active ? "bg-white/10 text-white" : "text-[#d9d0c6]"
      }`}
    >
      {active ? <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--accent)]" /> : null}
      {children}
    </button>
  );
}

function Desk({
  asked,
  question,
  onQuestion,
  onAsk,
  onInvoices,
  onLabor,
}: {
  asked: boolean;
  question: string;
  onQuestion: (value: string) => void;
  onAsk: (event: React.FormEvent) => void;
  onInvoices: () => void;
  onLabor: () => void;
}) {
  const lead = COMPARE.lead;
  return (
    <>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Tile title="Latest sales">
          <p className="text-sm text-[#5c564e]">No sales file in this sample.</p>
          <Honesty kind="Missing" />
        </Tile>
        <Tile title="Invoice prices">
          {lead ? (
            <>
              <p className="text-2xl font-bold">
                {formatMoney(lead.atLaterQty)} more <Honesty kind="Estimated" />
              </p>
              <p className="text-sm text-[#5c564e]">
                {formatMoney(lead.earlierPrice)} <Honesty kind="Verified" /> → {formatMoney(lead.laterPrice)}{" "}
                <Honesty kind="Verified" /> per case
              </p>
              <button type="button" className="text-sm font-semibold text-[var(--accent)]" onClick={onInvoices}>
                Open the price check
              </button>
            </>
          ) : null}
        </Tile>
        <Tile title="Scheduled vs worked">
          <p className="text-sm">
            {PRAIRIE_LABOR.person}: {PRAIRIE_LABOR.scheduledHours} h scheduled, {PRAIRIE_LABOR.workedHours} h worked
          </p>
          <Honesty kind="Sample" />
          <p className="text-sm text-[#5c564e]">Wage total</p>
          <Honesty kind="Missing" />
          <button type="button" className="text-sm font-semibold text-[var(--accent)]" onClick={onLabor}>
            Open labor
          </button>
        </Tile>
      </div>

      <form onSubmit={onAsk} className="mt-4 rounded-2xl border border-[#e4ddd4] bg-white p-4">
        <h2 className="text-lg font-bold">Ask about your restaurant</h2>
        <label className="mt-3 block text-sm" htmlFor="seat-ask">
          What should I check today?
          <textarea
            id="seat-ask"
            value={question}
            onChange={(event) => onQuestion(event.target.value)}
            placeholder="What should I check today?"
            className="mt-2 min-h-24 w-full rounded-xl border border-[#e4ddd4] px-3 py-3 text-base"
          />
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white">
            Ask Never86&apos;d
          </button>
          <p className="text-sm text-[#5c564e]">Using this week&apos;s reports</p>
        </div>
        <p className="mt-3 text-sm text-[#5c564e]">{AI_RULE}</p>
        {asked && !question.trim() ? (
          <p className="mt-3 text-sm" role="status">
            Type a question first. No number was added.
          </p>
        ) : null}
        {asked && question.trim() && lead ? (
          <p className="mt-3 rounded-xl bg-[#f7f4ef] px-3 py-3 text-sm" role="status">
            {lead.description} is {formatMoney(lead.unitDelta)} a case higher. At {lead.laterQty} cases, that is{" "}
            {formatMoney(lead.atLaterQty)} more on the later delivery.{" "}
            <Honesty kind="Estimated" />
          </p>
        ) : null}
      </form>
    </>
  );
}

function InvoiceView({
  original,
  onOriginal,
}: {
  original: "earlier" | "later" | null;
  onOriginal: (next: "earlier" | "later" | null) => void;
}) {
  const lead = COMPARE.lead;
  if (!lead) return null;
  return (
    <section className="mt-4 rounded-2xl bg-[#17191c] p-4 text-[#f7f3ee] sm:p-6">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-[#e7b2a4]">YOUR VENDOR PRICE CHECK</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight">
        {formatMoney(COMPARE.productDelta)} more on this delivery.
      </h2>
      <div className="mt-2 flex flex-wrap gap-2">
        <Honesty kind="Estimated" />
        <Honesty kind="Sample" />
      </div>
      <p className="mt-3 text-sm text-[#e6ddd4]">
        {lead.description}: <span className="font-semibold text-white">{formatMoney(lead.earlierPrice)}</span>
        <Honesty kind="Verified" /> → <span className="font-semibold text-white">{formatMoney(lead.laterPrice)}</span>
        <Honesty kind="Verified" /> per case. Difference at the latest invoice&apos;s quantity.
      </p>
      <p className="mt-2 text-sm text-[#cfc6bc]">
        {PRAIRIE_EARLIER.date} → {PRAIRIE_LATER.date}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#1c1916]"
          onClick={() => onOriginal(original === "later" ? null : "later")}
        >
          Check latest original
        </button>
        <button
          type="button"
          className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#1c1916]"
          onClick={() => onOriginal(original === "earlier" ? null : "earlier")}
        >
          Check earlier original
        </button>
      </div>
      <p className="mt-4 text-sm text-[#e6ddd4]">{matchSentence(COMPARE)}</p>
      <Link
        href="/check/invoices"
        className="mt-4 inline-flex rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white no-underline"
      >
        Add the next delivery invoice
      </Link>
      <details className="mt-4 text-sm text-[#e6ddd4]">
        <summary>How does this work?</summary>
        <p className="mt-2">
          The case prices are read off the two fictional invoices. {formatMoney(lead.unitDelta)} times {lead.laterQty}{" "}
          cases is {formatMoney(lead.atLaterQty)}. Delivery is not a product. Sales tax is printed as{" "}
          {formatMoney(PRAIRIE_LATER.tax)} on both papers.
        </p>
      </details>
      {original ? <Original invoice={original === "later" ? PRAIRIE_LATER : PRAIRIE_EARLIER} /> : null}
      <details className="mt-4 rounded-xl bg-white p-4 text-[#1c1916]">
        <summary className="font-semibold">Comparison details and follow-up</summary>
        <ul className="mt-3 grid gap-3 text-sm">
          {COMPARE.rows.map((row) => (
            <li key={row.code} className="border-b border-[#eee6dc] pb-3">
              <p className="font-semibold">
                {row.description} <span className="font-normal text-[#6b645c]">{row.code}</span>
              </p>
              <p className="mt-1">
                {formatMoney(row.earlierPrice)} <Honesty kind="Verified" /> → {formatMoney(row.laterPrice)}{" "}
                <Honesty kind="Verified" /> · {formatDelta(row.unitDelta)} per {row.unit}{" "}
                <Honesty kind="Estimated" />
                {row.direction === "higher" ? ` · ${formatDelta(row.atLaterQty)} at ${row.laterQty} ${row.unit}s` : ""}
              </p>
              <p className="text-[#6b645c]">{row.direction === "steady" ? "Steady" : row.direction === "higher" ? "Higher" : "Lower"}</p>
            </li>
          ))}
          <li>
            Delivery service charge {formatMoney(PRAIRIE_EARLIER.delivery)} on both. Not a product.{" "}
            <Honesty kind="Verified" />
          </li>
          <li>
            Sales tax {formatMoney(PRAIRIE_EARLIER.tax)}, printed on both invoices. <Honesty kind="Verified" />
          </li>
        </ul>
      </details>
    </section>
  );
}

function Original({ invoice }: { invoice: PrairieInvoice }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl bg-white p-4 text-[#1c1916]">
      <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--accent)]">FICTIONAL TEST DATA</p>
      <h3 className="mt-2 text-lg font-bold">{invoice.vendor}</h3>
      <p className="text-sm">
        {invoice.number} · {invoice.date}
      </p>
      <p className="text-sm text-[#5c564e]">
        {invoice.billTo}. {invoice.shipTo}
      </p>
      <table className="mt-3 w-full min-w-[520px] text-left text-sm">
        <thead className="bg-[#1e3a45] text-white">
          <tr>
            <th className="px-2 py-2 font-semibold">Item</th>
            <th className="px-2 py-2 font-semibold">Qty</th>
            <th className="px-2 py-2 font-semibold">Price</th>
            <th className="px-2 py-2 font-semibold">Extension</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lines.map((item) => (
            <tr key={item.code} className="border-b border-[#eee6dc]">
              <td className="px-2 py-2">
                <span className="font-semibold">{item.code}</span> {item.description}
                <span className="block text-xs text-[#6b645c]">Pack: {item.pack}</span>
              </td>
              <td className="px-2 py-2">
                {item.qty} {item.unit}
              </td>
              <td className="px-2 py-2">
                {formatMoney(item.unitPrice)} <Honesty kind="Verified" />
              </td>
              <td className="px-2 py-2">
                {formatMoney(item.extension)} <Honesty kind="Verified" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm">Product subtotal {formatMoney(productSubtotal(invoice))}</p>
      <p className="text-sm">Delivery service charge (not a product) {formatMoney(invoice.delivery)}</p>
      <p className="text-sm">
        Sales tax {formatMoney(invoice.tax)} <Honesty kind="Verified" />
      </p>
      <p className="mt-1 font-bold">Invoice total {formatMoney(invoice.total)}</p>
    </div>
  );
}

function LaborView() {
  const extra = PRAIRIE_LABOR.workedHours - PRAIRIE_LABOR.scheduledHours;
  return (
    <section className="mt-4 rounded-2xl border border-[#e4ddd4] bg-white p-4 sm:p-6">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-[#6b645c]">SAME WEEK</p>
      <h2 className="mt-2 text-3xl font-bold">{PRAIRIE_LABOR.person} stayed longer.</h2>
      <p className="mt-3 text-4xl font-bold">
        {PRAIRIE_LABOR.scheduledHours} to {PRAIRIE_LABOR.workedHours}
      </p>
      <div className="mt-2">
        <Honesty kind="Sample" />
      </div>
      <p className="mt-3 text-sm text-[#5c564e]">
        {PRAIRIE_LABOR.day}: {PRAIRIE_LABOR.scheduledHours} scheduled paid hours and {PRAIRIE_LABOR.workedHours} worked
        hours. That is {extra} extra hours on this card.
      </p>
      <p className="mt-3 text-sm">
        Wage total <Honesty kind="Missing" />
      </p>
      <p className="mt-1 text-sm text-[#5c564e]">
        No wage rate is printed on this sample card, so the pay stays Missing.
      </p>
      <p className="mt-3 text-sm text-[#5c564e]">
        Week of 2026-09-14 through 2026-09-20. Payroll premiums are not on these papers.
      </p>
    </section>
  );
}

function EmptyPanel({ title, href, label }: { title: string; href?: string; label?: string }) {
  return (
    <section className="mt-4 rounded-2xl border border-[#e4ddd4] bg-white p-4">
      <p className="font-semibold">{title}</p>
      <div className="mt-2">
        <Honesty kind="Missing" />
      </div>
      {href && label ? (
        <Link href={href} className="mt-3 inline-block text-sm font-semibold text-[var(--accent)]">
          {label}
        </Link>
      ) : null}
    </section>
  );
}

function History() {
  return (
    <section className="mt-4 rounded-2xl border border-[#e4ddd4] bg-white p-4 text-sm">
      <h2 className="font-bold">On this phone</h2>
      <ul className="mt-2 grid gap-2">
        <li>
          {PRAIRIE_EARLIER.number} · {PRAIRIE_EARLIER.date} · {formatMoney(PRAIRIE_EARLIER.total)}{" "}
          <Honesty kind="Sample" />
        </li>
        <li>
          {PRAIRIE_LATER.number} · {PRAIRIE_LATER.date} · {formatMoney(PRAIRIE_LATER.total)}{" "}
          <Honesty kind="Sample" />
        </li>
      </ul>
    </section>
  );
}

function Rail() {
  return (
    <aside className="h-fit rounded-2xl border border-[#e4ddd4] bg-[#f7f4ef] p-4">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#6b645c]">BRING THE MISSING PIECES</p>
      <h2 className="mt-2 text-xl font-bold">Your week, in one place.</h2>
      <p className="mt-1 text-sm text-[#5c564e]">2026-09-20 — 2026-09-26</p>
      <p className="mt-2 text-sm text-[#5c564e]">Drop a report into a check, or open the sample that is already here.</p>
      <Folder title="Schedule" body="Avery's Saturday hours are in the sample. A full schedule file is not." href="/check/labor" />
      <Folder title="Time-clock report" body="The worked hours on the labor card are the sample. A clock file is not." href="/check/labor" />
      <Folder title="Sales reports" body="No sales file is in this sample." />
    </aside>
  );
}

function Folder({ title, body, href }: { title: string; body: string; href?: string }) {
  return (
    <div className="mt-3 rounded-xl border border-[#e4ddd4] bg-white p-3">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-[#5c564e]">{body}</p>
      <div className="mt-2">
        {href ? <Honesty kind="Sample" /> : <Honesty kind="Missing" />}
      </div>
      {href ? (
        <Link href={href} className="mt-2 inline-block text-sm font-semibold text-[var(--accent)]">
          Open
        </Link>
      ) : null}
    </div>
  );
}

function Tile({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid content-start gap-2 rounded-xl border border-[#e4ddd4] bg-white p-3">
      <h2 className="text-sm font-semibold text-[#5c564e]">{title}</h2>
      {children}
    </section>
  );
}
