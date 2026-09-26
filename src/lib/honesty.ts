export type HonestyKind = "Verified" | "Estimated" | "Missing" | "Sample";

export type CheckRow = {
  label: string;
  value: string;
  honesty: HonestyKind;
  detail?: string;
};

export type CheckResult = {
  headline: string;
  rows: CheckRow[];
};

export const NOT_ON_PAPER = "Not on the paper";

/** Sample papers keep Missing as Missing. Every other badge becomes Sample. */
export function presentRows(rows: CheckRow[], sample: boolean): CheckRow[] {
  if (!sample) return rows;
  return rows.map((row) => ({
    ...row,
    honesty: row.honesty === "Missing" ? "Missing" : "Sample",
  }));
}

export function rowsToCopy(title: string, rows: CheckRow[], sample: boolean): string {
  const head = sample
    ? `${title}\nSAMPLE — fictional papers, not your restaurant`
    : title;
  const body = rows
    .map((row) => {
      const detail = row.detail ? ` — ${row.detail}` : "";
      return `${row.label}: ${row.value} (${row.honesty})${detail}`;
    })
    .join("\n");
  return `${head}\n${body}\nRead on this phone. Nothing was uploaded.`;
}
