"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";

export default function UnsubscribePage() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  async function unsubscribe() {
    setError(null);
    const response = await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(typeof body.reason === "string" ? body.reason : "That link did not work.");
      return;
    }
    setDone(true);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-3xl font-bold">Unsubscribe</h1>
      <p className="mt-3 text-[var(--muted)]">{BRAND} will stop emailing you about your seat. The checks stay on this page.</p>
      {done ? (
        <p role="status" className="mt-4 text-sm font-semibold">You are unsubscribed.</p>
      ) : (
        <button
          type="button"
          onClick={unsubscribe}
          className="mt-4 rounded-xl bg-[var(--ink)] px-4 py-3 text-base font-semibold text-white"
        >
          Unsubscribe
        </button>
      )}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-[var(--miss)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
