export default function EmailDataPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">How email reports are handled</h1>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
        <li>You choose what to collect.</li>
        <li>No send or delete permission requested.</li>
        <li>Prefer not to grant mailbox access? Forward or upload a file.</li>
        <li>Pause and disconnect are always available.</li>
        <li>No fake Connect status — Missing until verified.</li>
      </ul>
    </div>
  );
}
