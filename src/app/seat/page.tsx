import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export default function SeatPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Honesty kind="Missing" />
      <h1 className="mt-4 text-3xl font-bold">Sign in to your owner seat</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        First owner seat is free. Auth wiring is Pending on this clean build — we will not fake
        an OpenAI wall or invent a live Connect.
      </p>
      <form className="mt-6 space-y-3">
        <input
          type="email"
          placeholder="Email address"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
          disabled
        />
        <button
          type="button"
          disabled
          className="w-full rounded-lg bg-[var(--ink)] px-4 py-2.5 text-sm font-semibold text-white opacity-60"
        >
          Continue (Pending — needs Myke Yes + new GitHub/auth)
        </button>
      </form>
      <Link href="/try/desk" className="mt-4 block text-center text-sm underline">
        Keep exploring the sample desk
      </Link>
    </div>
  );
}
