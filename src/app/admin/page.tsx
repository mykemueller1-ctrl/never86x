"use client";

import { useState } from "react";
import { Honesty } from "@/components/Honesty";

export default function AdminPage() {
  const configured = false;
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function download(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/admin/signups", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      setError("That export token was not accepted.");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "seat-signups.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Admin</h1>
      <p className="mt-2 text-[var(--muted)]">This page does not list restaurants or prices.</p>
      <div className="mt-6 rounded-xl border border-[var(--line)] p-4 text-sm">
        <div className="flex items-center gap-2">
          <span>Admin gate configured</span>
          {configured ? <Honesty kind="Verified" /> : <Honesty kind="Missing" />}
        </div>
        <p className="mt-3 text-[var(--muted)]">
          This page does not list restaurants until you export the signup file.
        </p>
      </div>
      <form className="mt-6 rounded-xl border border-[var(--line)] p-4" onSubmit={download}>
        <h2 className="font-semibold">Signup export</h2>
        <label className="mt-3 block text-sm" htmlFor="export-token">
          Admin export token
          <input
            id="export-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-3 text-base"
          />
        </label>
        <button type="submit" className="mt-3 rounded-xl bg-[var(--ink)] px-4 py-3 text-base font-semibold text-white">
          Download CSV
        </button>
        {error ? (
          <p role="alert" className="mt-2 text-sm text-[var(--miss)]">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
