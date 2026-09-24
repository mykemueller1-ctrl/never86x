export default function ContactPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-bold">Want a hand getting started?</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Just your email. No inbox connect.</p>
      <form className="mt-6 space-y-3">
        <input className="w-full rounded-lg border border-[var(--line)] px-3 py-2" placeholder="Your email" />
        <button className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white">
          Yes, contact me
        </button>
      </form>
      <p className="mt-3 text-xs text-[var(--muted)]">
        This sends only your contact request. It does not connect your inbox or share restaurant files.
      </p>
    </div>
  );
}
