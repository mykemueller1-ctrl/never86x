/** Round half-up to cents. Used only on numbers already read from a paper. */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatMoney(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

export function formatDelta(n: number): string {
  if (n > 0) return `+${formatMoney(n)}`;
  return formatMoney(n);
}

export function formatHours(n: number): string {
  const rounded = round2(n);
  const text = rounded.toFixed(2).replace(/\.?0+$/, "");
  return `${text} h`;
}

export function formatSignedHours(n: number): string {
  if (n > 0) return `+${formatHours(n)}`;
  return formatHours(n);
}

/** One decimal percent. Null when the base is zero — we do not divide into a fake percent. */
export function formatPercent(part: number, whole: number): string | null {
  if (whole === 0) return null;
  const pct = Math.round((part / whole) * 1000) / 10;
  return `${pct.toFixed(1).replace(/\.0$/, "")}%`;
}
