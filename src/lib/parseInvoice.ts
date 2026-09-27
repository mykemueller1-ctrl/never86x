import type { CheckResult, CheckRow, HonestyKind } from "./honesty";
import { NOT_ON_PAPER } from "./honesty";
import { formatDelta, formatMoney, formatPercent, round2 } from "./money";

export type ParsedLine = {
  description: string;
  price: number | null;
};

export type ParsedInvoice = {
  vendor: string | null;
  date: string | null;
  tax: number | null;
  total: number | null;
  lines: ParsedLine[];
};

const MONEY_SRC =
  String.raw`\$\s*(\d{1,7}(?:,\d{3})*(?:\.\d{1,2})?)|(?<![A-Za-z0-9.])(\d{1,7}(?:,\d{3})*\.\d{2})(?![A-Za-z0-9.])`;

function moneyFrom(raw: string): number | null {
  const n = Number(raw.replace(/[$,\s]/g, ""));
  if (!Number.isFinite(n)) return null;
  return round2(n);
}

function allMoney(line: string): number[] {
  const out: number[] = [];
  for (const match of line.matchAll(new RegExp(MONEY_SRC, "g"))) {
    const raw = match[1] ?? match[2];
    if (!raw) continue;
    const n = moneyFrom(raw);
    if (n != null) out.push(n);
  }
  return out;
}

function stripMoney(line: string): string {
  return line.replace(new RegExp(MONEY_SRC, "g"), " ");
}

function splitCsv(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') {
      quoted = !quoted;
      continue;
    }
    if (ch === "," && !quoted) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function csvMoney(raw: string): number | null {
  const t = raw.trim();
  if (!/^\$?\d{1,7}(?:,\d{3})*(?:\.\d{1,2})?$/.test(t)) return null;
  return moneyFrom(t);
}

type Bucket = "tax" | "total" | "skip" | "item";

function bucket(label: string): Bucket {
  const l = label.toLowerCase().replace(/[:#]/g, "").trim();
  if (/^(sales\s+)?tax$/.test(l)) return "tax";
  if (/^(sub\s*total|total|invoice total|amount due|balance due|grand total)$/.test(l)) {
    return "total";
  }
  if (/^(shipping|freight|discount|tip)$/.test(l)) return "skip";
  if (/^invoice(\s+(number|no|num))?$/.test(l)) return "skip";
  return "item";
}

function cleanLabel(raw: string): string {
  return raw.replace(/\s+/g, " ").replace(/^[-–—*•]+\s*/, "").trim();
}

/**
 * Read prices that are actually written. A bare integer is not a price
 * (that would turn an invoice number into a dollar). CSV price columns may
 * be whole dollars because the header says so.
 */
export function parseInvoice(text: string): ParsedInvoice {
  const rows = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);

  let vendor: string | null = null;
  let date: string | null = null;
  let tax: number | null = null;
  let total: number | null = null;
  const lines: ParsedLine[] = [];

  const header = rows[0]?.toLowerCase() ?? "";
  const csv =
    header.includes(",") &&
    /(item|description|product|sku)/.test(header) &&
    /(price|amount|cost|ext)/.test(header);

  if (csv) {
    const heads = splitCsv(rows[0]).map((h) => h.toLowerCase());
    const descIdx = heads.findIndex((h) => /item|description|product|sku/.test(h));
    const unitIdx = heads.findIndex((h) => /unit/.test(h) && /price|cost/.test(h));
    const priceIdx =
      unitIdx >= 0 ? unitIdx : heads.findIndex((h) => /price|amount|ext|cost/.test(h));
    for (const row of rows.slice(1)) {
      const cols = splitCsv(row);
      const description = cleanLabel(cols[descIdx] ?? "");
      if (!description) continue;
      const price = priceIdx >= 0 ? csvMoney(cols[priceIdx] ?? "") : null;
      const kind = bucket(description);
      if (kind === "tax") tax = price;
      else if (kind === "total") total = price;
      else if (kind === "item") lines.push({ description, price });
    }
    return { vendor, date, tax, total, lines };
  }

  for (const row of rows) {
    const vendorMatch = row.match(/^vendor\s*:\s*(.+)$/i);
    if (vendorMatch) {
      vendor = cleanLabel(vendorMatch[1]);
      continue;
    }
    const dateMatch = row.match(/^(?:invoice\s*)?date\s*:\s*(.+)$/i);
    if (dateMatch) {
      date = cleanLabel(dateMatch[1]);
      continue;
    }
    if (/^invoice\b/i.test(row) && allMoney(row).length === 0) continue;

    const monies = allMoney(row);
    const label = cleanLabel(stripMoney(row).replace(/[$]/g, " "));
    if (!label) continue;
    const kind = bucket(label);
    const price = monies.at(-1) ?? null;
    if (kind === "tax") tax = price;
    else if (kind === "total") total = price;
    else if (kind === "item") lines.push({ description: label, price });
  }

  return { vendor, date, tax, total, lines };
}

const DROP = new Set([
  "the",
  "and",
  "for",
  "with",
  "per",
  "lb",
  "lbs",
  "oz",
  "case",
  "each",
  "pack",
  "whole",
  "milk",
  "size",
]);

function tokens(desc: string): string[] {
  return desc
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t.length >= 4 && !DROP.has(t) && !/^\d+$/.test(t));
}

function norm(desc: string): string {
  return desc.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** 1 = same line, 0 = do not pair. Ties stay 0 so we do not guess. */
export function matchScore(a: string, b: string): number {
  if (norm(a) === norm(b) && norm(a).length > 0) return 1;
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.length === 0 || tb.length === 0) return 0;
  const setB = new Set(tb);
  let inter = 0;
  for (const t of ta) if (setB.has(t)) inter += 1;
  const union = new Set([...ta, ...tb]).size;
  const score = inter / union;
  if (score >= 0.67) return score;
  const [short, long] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  const longSet = new Set(long);
  const subset = short.every((t) => longSet.has(t));
  const strong = short.some((t) => t.length >= 8);
  if (subset && strong) return 0.66;
  return 0;
}

function priceRow(label: string, price: number | null, detail?: string): CheckRow {
  if (price == null) {
    return { label, value: NOT_ON_PAPER, honesty: "Missing", detail };
  }
  return { label, value: formatMoney(price), honesty: "Verified", detail };
}

function shortName(desc: string): string {
  return desc.split(/\s+/).slice(0, 4).join(" ");
}

export function checkInvoices(earlierText: string, laterText: string): CheckResult {
  if (!earlierText.trim() || !laterText.trim()) {
    return { headline: "Paste both invoices.", rows: [] };
  }

  const earlier = parseInvoice(earlierText);
  const later = parseInvoice(laterText);
  const used = new Set<number>();
  const pairs: { a: number; b: number }[] = [];

  for (let i = 0; i < earlier.lines.length; i += 1) {
    let best = -1;
    let bestScore = 0;
    let second = 0;
    for (let j = 0; j < later.lines.length; j += 1) {
      if (used.has(j)) continue;
      const score = matchScore(earlier.lines[i].description, later.lines[j].description);
      if (score > bestScore) {
        second = bestScore;
        bestScore = score;
        best = j;
      } else if (score > second) {
        second = score;
      }
    }
    if (best >= 0 && bestScore >= 0.66 && bestScore > second) {
      used.add(best);
      pairs.push({ a: i, b: best });
    }
  }

  const pairedA = new Set(pairs.map((p) => p.a));
  const rows: CheckRow[] = [];
  const moved: { name: string; delta: number }[] = [];
  let compared = 0;

  if (earlier.vendor || later.vendor) {
    rows.push({
      label: "Vendor",
      value: [earlier.vendor, later.vendor].filter(Boolean).join(" → "),
      honesty: "Verified",
    });
  }
  if (earlier.date || later.date) {
    rows.push({
      label: "Date",
      value: [earlier.date ?? NOT_ON_PAPER, later.date ?? NOT_ON_PAPER].join(" → "),
      honesty: earlier.date && later.date ? "Verified" : "Missing",
    });
  }

  for (const pair of pairs) {
    const a = earlier.lines[pair.a];
    const b = later.lines[pair.b];
    const name = a.description;
    rows.push(priceRow(`Earlier · ${name}`, a.price));
    rows.push(priceRow(`Later · ${name}`, b.price));
    if (a.price == null || b.price == null) {
      rows.push({
        label: `Change · ${shortName(name)}`,
        value: NOT_ON_PAPER,
        honesty: "Missing",
        detail: "One side has no price, so there is no change to show.",
      });
      continue;
    }
    const delta = round2(b.price - a.price);
    compared += 1;
    const pct = formatPercent(delta, a.price);
    const perCase = /case/i.test(a.description) && /case/i.test(b.description) ? " per case" : "";
    rows.push({
      label: `Change · ${shortName(name)}`,
      value: `${formatDelta(delta)}${perCase}`,
      honesty: "Estimated",
      detail: pct ? `${pct} on the earlier price` : "Earlier price is $0.00, so no percent.",
    });
    if (delta !== 0) moved.push({ name: shortName(name), delta });
  }

  for (let i = 0; i < earlier.lines.length; i += 1) {
    if (pairedA.has(i)) continue;
    const line = earlier.lines[i];
    rows.push({
      label: `Only on the earlier invoice · ${line.description}`,
      value: line.price == null ? NOT_ON_PAPER : formatMoney(line.price),
      honesty: line.price == null ? "Missing" : "Verified",
      detail: "No matching line on the later invoice.",
    });
  }
  for (let j = 0; j < later.lines.length; j += 1) {
    if (used.has(j)) continue;
    const line = later.lines[j];
    rows.push({
      label: `Only on the later invoice · ${line.description}`,
      value: line.price == null ? NOT_ON_PAPER : formatMoney(line.price),
      honesty: line.price == null ? "Missing" : "Verified",
      detail: "No matching line on the earlier invoice.",
    });
  }

  rows.push(taxOrTotal("Tax", earlier.tax, later.tax));
  if (earlier.total != null || later.total != null) {
    rows.push(taxOrTotal("Invoice total", earlier.total, later.total));
  }

  let headline = "No matching lines. Check the item names — we will not guess.";
  if (pairs.length > 0 && compared === 0) headline = "Lines matched, but a price is missing.";
  else if (pairs.length > 0 && moved.length === 0) headline = "Matched lines. No price change on them.";
  else if (moved.length === 1) {
    headline = `${moved[0].name} is ${moved[0].delta > 0 ? "up" : "down"} ${formatMoney(Math.abs(moved[0].delta))}.`;
  } else if (moved.length > 1) {
    headline = `${moved.length} prices moved. Each line is listed. No combined guess.`;
  }

  if (earlier.lines.length === 0 && later.lines.length === 0) {
    headline = "No item prices on that paste.";
  }

  return { headline, rows };
}

function taxOrTotal(label: string, a: number | null, b: number | null): CheckRow {
  if (a == null && b == null) {
    return { label, value: NOT_ON_PAPER, honesty: "Missing" };
  }
  const left = a == null ? NOT_ON_PAPER : formatMoney(a);
  const right = b == null ? NOT_ON_PAPER : formatMoney(b);
  const honesty: HonestyKind = a == null || b == null ? "Missing" : "Verified";
  return { label, value: `${left} → ${right}`, honesty };
}
