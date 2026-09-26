"use client";

export function PaperField({
  id,
  label,
  value,
  placeholder,
  rows = 5,
  onChange,
  onFile,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  rows?: number;
  onChange: (value: string) => void;
  onFile: (file: File | undefined) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium" htmlFor={id}>
        {label}
        <textarea
          id={id}
          value={value}
          placeholder={placeholder}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-3 text-base"
        />
      </label>
      <label className="mt-2 inline-block cursor-pointer rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold">
        Add PDF, CSV, or text
        <input
          type="file"
          accept=".pdf,.csv,.txt,text/plain,text/csv,application/pdf,image/*"
          className="sr-only"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
      </label>
    </div>
  );
}
