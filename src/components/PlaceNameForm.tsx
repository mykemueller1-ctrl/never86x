"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePlace } from "@/lib/history";

export function PlaceNameForm() {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <form
      className="mt-6 space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        savePlace(name);
        router.push("/check/invoices");
      }}
    >
      <label className="block text-sm font-medium" htmlFor="restaurant-name">
        Restaurant name, if you want it on the card
        <input
          id="restaurant-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Optional. Stays on this phone."
          className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-3 text-base"
        />
      </label>
      <button type="submit" className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white">
        Check my invoices
      </button>
    </form>
  );
}
