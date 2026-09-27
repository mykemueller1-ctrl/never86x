"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenStatus } from "@/components/ScreenStatus";
import { INVOICE_Q } from "@/lib/brand";
import { savePlace } from "@/lib/history";

export function PlaceNameForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mt-6 space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const saveError = savePlace(name);
        if (saveError) {
          setError(saveError);
          return;
        }
        router.push("/check/invoices");
      }}
    >
      <label className="block text-sm font-medium" htmlFor="restaurant-name">
        Restaurant name, if you want it on the card
        <input
          id="restaurant-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError(null);
          }}
          placeholder="Optional. Stays on this phone."
          aria-describedby="place-status"
          className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-3 text-base"
        />
      </label>
      <div id="place-status">
        {error ? <ScreenStatus kind="error">{error}</ScreenStatus> : null}
        {!error && !name.trim() ? (
          <ScreenStatus kind="empty">No name yet. The checks work without one.</ScreenStatus>
        ) : null}
      </div>
      <button type="submit" className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white">
        {INVOICE_Q}
      </button>
    </form>
  );
}
