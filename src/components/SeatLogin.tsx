"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { readChecks, readDraft } from "@/lib/draft";
import { showGoogleSignIn } from "@/lib/embedded";

const CONSENT = `${BRAND} may email you about your seat.`;

export function SeatLogin({
  open,
  embedded,
  source,
  notice,
  onClose,
  onSignedIn,
  asPage = false,
  googleConfigured = false,
}: {
  open: boolean;
  embedded: boolean;
  source: string;
  notice: string | null;
  onClose: () => void;
  onSignedIn: (email: string) => void;
  asPage?: boolean;
  googleConfigured?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(notice);
  const [busy, setBusy] = useState(false);
  const google = showGoogleSignIn(
    typeof navigator === "undefined" ? "" : navigator.userAgent,
    googleConfigured ? "on" : "",
  );

  useEffect(() => {
    setError(notice);
  }, [notice]);

  useEffect(() => {
    if (!open) return;
    const field = document.getElementById("seat-email");
    if (field instanceof HTMLInputElement) field.focus();
  }, [open]);

  if (!open && !asPage) return null;

  async function sendLink(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch("/api/auth/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        consent,
        utm: source,
        checks: readChecks(),
        draft: readDraft(),
      }),
    });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(typeof body.reason === "string" ? body.reason : "The link did not send.");
      return;
    }
    setSent(true);
    if (!body.sent && typeof body.reason === "string") setError(body.reason);
    if (typeof body.devCode === "string") setCode(body.devCode);
  }

  async function useCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const body = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(typeof body.reason === "string" ? body.reason : "That code did not work.");
      return;
    }
    onSignedIn(String(body.email || email));
  }

  const form = (
      <div
        role={asPage ? undefined : "dialog"}
        aria-modal={asPage ? undefined : true}
        aria-labelledby="seat-login-title"
        className={asPage ? "w-full" : "w-full max-w-md rounded-2xl bg-white p-4 shadow-lg"}
      >
        {asPage ? (
          <h2 id="seat-login-title" className="text-xl font-bold">
            One email
          </h2>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <h2 id="seat-login-title" className="text-xl font-bold">Save this seat</h2>
            <button type="button" className="text-sm underline" onClick={onClose}>
              Close
            </button>
          </div>
        )}
        <p className="mt-2 text-sm text-[var(--muted)]">
          One email. The seat stays free. No card. No POS connection. No approval wait.
        </p>
        <form className="mt-4" onSubmit={sent ? useCode : sendLink}>
          <label className="block text-sm font-medium" htmlFor="seat-email">
            Email
            <input
              id="seat-email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-3 text-base"
            />
          </label>
          <label className="mt-3 flex items-start gap-2 text-sm" htmlFor="seat-consent">
            <input
              id="seat-consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1"
              required
            />
            <span>
              {CONSENT}{" "}
              <a className="underline" href="/unsubscribe">
                Unsubscribe
              </a>
            </span>
          </label>
          {sent ? (
            <label className="mt-3 block text-sm font-medium" htmlFor="seat-code">
              Code from the email
              <input
                id="seat-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-3 text-base"
              />
            </label>
          ) : null}
          {error ? (
            <p role="alert" className="mt-3 text-sm text-[var(--miss)]">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white"
          >
            {sent ? "Use this code" : "Email me a sign-in link"}
          </button>
        </form>
        {google && consent ? (
          <a className="mt-3 block text-center text-sm font-semibold text-[var(--accent)]" href="/api/auth/google?consent=1">
            Continue with Google
          </a>
        ) : null}
        {google && !consent ? (
          <p className="mt-3 text-sm text-[var(--muted)]">Check the consent line to use Google.</p>
        ) : null}
        {embedded ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Google sign-in is blocked inside X. Use the email code here, or{" "}
            <a className="underline" href="/seat" target="_blank" rel="noopener noreferrer">
              open in browser
            </a>
            .
          </p>
        ) : null}
      </div>
  );

  if (asPage) return form;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-3 sm:items-center" role="presentation">
      {form}
    </div>
  );
}
