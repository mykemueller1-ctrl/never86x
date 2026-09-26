"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { METHOD } from "@/lib/brand";
import { isEmbeddedWebview } from "@/lib/embedded";
import { SeatLogin } from "@/components/SeatLogin";

export function LoginScreen({ googleConfigured = false }: { googleConfigured?: boolean }) {
  const [embedded, setEmbedded] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmbedded(isEmbeddedWebview(navigator.userAgent));
  }, []);

  return (
    <div className="mx-auto max-w-lg bg-[#f6f5f3] px-4 py-8 text-[var(--ink)]">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--muted)]">{METHOD.toUpperCase()}</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight">
        Sign in.
        <br />
        <span className="text-[var(--accent)]">The checks stay open.</span>
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        One email on this page. No card. No POS connection. You can run the checks before you sign in.
      </p>
      <section className="mt-6 rounded-3xl bg-[#17191c] p-3 text-[#f7f3ee]">
        <div className="rounded-2xl bg-white p-4 text-[var(--ink)]">
          {email ? (
            <p className="text-sm font-semibold">
              Your free seat is on for {email}. <Link href="/seat">Open the seat</Link>
            </p>
          ) : (
            <SeatLogin
              asPage
              open
              embedded={embedded}
              source="login"
              notice={null}
              googleConfigured={googleConfigured}
              onClose={() => undefined}
              onSignedIn={setEmail}
            />
          )}
        </div>
      </section>
      <nav className="mt-6 grid gap-3 text-sm font-semibold" aria-label="Checks">
        <Link href="/check/invoices">Check my invoices</Link>
        <Link href="/check/labor">Check my labor</Link>
        <Link href="/check/menu">Check my plate cost</Link>
        <Link href="/seat">Open the free seat</Link>
      </nav>
    </div>
  );
}
