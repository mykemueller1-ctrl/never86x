export function ScreenStatus({
  kind,
  children,
}: {
  kind: "empty" | "loading" | "error";
  children: string;
}) {
  if (kind === "error") {
    return (
      <p role="alert" className="mt-4 rounded-xl border border-[var(--miss)] bg-[#fef2f2] px-3 py-3 text-sm font-medium">
        {children}
      </p>
    );
  }
  if (kind === "loading") {
    return (
      <p role="status" aria-live="polite" className="mt-4 text-sm font-medium">
        {children}
      </p>
    );
  }
  return (
    <p role="status" className="mt-4 rounded-xl border border-dashed border-[var(--line)] px-3 py-3 text-sm">
      {children}
    </p>
  );
}
