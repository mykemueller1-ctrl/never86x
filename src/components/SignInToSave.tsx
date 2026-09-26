"use client";

import { useState } from "react";

/**
 * In-page gate for upload / save. Never navigates to an outside login.
 */
export function SignInToSave({
  label = "Upload my own papers",
}: {
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [stayed, setStayed] = useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setStayed(false);
        }}
        className="rounded-lg bg-[var(--ink)] px-4 py-2.5 text-sm font-semibold text-white"
      >
        {label}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-labelledby="save-signin-title"
          className="mt-3 rounded-2xl border border-[var(--line)] bg-white p-4 text-left shadow-sm"
        >
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
            SAMPLE MODE STAYS OPEN
          </p>
          <h2 id="save-signin-title" className="mt-1 text-lg font-bold">
            Sign in to save your own invoices, free, no card
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            This card stays on the page. Your sample documents stay here. We do not
            send you to an OpenAI login.
          </p>
          <form
            className="mt-3 space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              setStayed(true);
            }}
          >
            <label className="block text-sm font-medium">
              Email
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@restaurant.com"
                className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Continue on this page
            </button>
          </form>
          {stayed ? (
            <p className="mt-3 text-sm" role="status">
              Still on this page. Live account sign-in is Missing until the owner
              turns it on. The sample is unchanged.
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 text-sm text-[var(--muted)] underline"
          >
            Keep using the sample
          </button>
        </div>
      ) : null}
    </div>
  );
}
