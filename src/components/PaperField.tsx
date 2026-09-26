"use client";

export function PaperField({
  id,
  label,
  value,
  placeholder,
  rows = 5,
  busy = false,
  statusId,
  onChange,
  onFile,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  rows?: number;
  busy?: boolean;
  statusId: string;
  onChange: (value: string) => void;
  onFile: (file: File | undefined) => void;
}) {
  return (
    <div aria-busy={busy || undefined}>
      <label className="block text-sm font-medium" htmlFor={id}>
        {label}
        <textarea
          id={id}
          value={value}
          placeholder={placeholder}
          rows={rows}
          spellCheck={false}
          autoComplete="off"
          aria-describedby={statusId}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-3 text-base"
        />
      </label>
      <label className="mt-2 inline-block cursor-pointer rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold">
        {busy ? "Reading…" : "Add a photo, PDF, CSV, or text"}
        <input
          type="file"
          accept=".pdf,.csv,.txt,text/plain,text/csv,application/pdf,image/*"
          className="sr-only"
          disabled={busy}
          aria-label={`Add a file for ${label}`}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            onFile(file);
          }}
        />
      </label>
    </div>
  );
}
