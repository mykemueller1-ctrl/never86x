import { round2 } from "@/lib/money";

/** Fictional Prairie Route papers from the operator test invoices. Not a live account. */
export type PrairieLine = {
  code: string;
  description: string;
  pack: string;
  qty: number;
  unit: string;
  unitPrice: number;
  extension: number;
};

export type PrairieInvoice = {
  vendor: string;
  number: string;
  date: string;
  billTo: string;
  shipTo: string;
  lines: PrairieLine[];
  delivery: number;
  tax: number;
  total: number;
};

export const PRAIRIE_EARLIER: PrairieInvoice = {
  vendor: "Prairie Route Foodservice - Fictional",
  number: "FIC-PR-0908-101",
  date: "2026-09-08",
  billTo: "Riverbend Pizza - Fictional Test",
  shipTo: "Test store RB-01 | Counter, kitchen and delivery",
  delivery: 14.5,
  tax: 0,
  total: 1290.5,
  lines: [
    line("MOZ-305", "Whole-milk mozzarella, shredded", "6 x 5 lb", 10, "case", 72),
    line("SAU-610", "Pizza sauce, no. 10 cans", "6 x #10 cans", 6, "case", 29.5),
    line("PEP-225", "Sliced pepperoni", "2 x 12.5 lb", 3, "case", 98),
    line("FLR-050", "High-gluten pizza flour", "1 x 50 lb", 4, "bag", 21.25),
  ],
};

export const PRAIRIE_LATER: PrairieInvoice = {
  vendor: "Prairie Route Foodservice - Fictional",
  number: "FIC-PR-0915-102",
  date: "2026-09-15",
  billTo: "Riverbend Pizza - Fictional Test",
  shipTo: "Test store RB-01 | Counter, kitchen and delivery",
  delivery: 14.5,
  tax: 0,
  total: 1350.5,
  lines: [
    line("MOZ-305", "Whole-milk mozzarella, shredded", "6 x 5 lb", 10, "case", 78),
    line("SAU-610", "Pizza sauce, no. 10 cans", "6 x #10 cans", 6, "case", 29.5),
    line("PEP-225", "Sliced pepperoni", "2 x 12.5 lb", 3, "case", 98),
    line("FLR-050", "High-gluten pizza flour", "1 x 50 lb", 4, "bag", 21.25),
  ],
};

/**
 * Hours named on the demo card. No wage rate was printed on that card,
 * so a pay figure is not derived here.
 */
export const PRAIRIE_LABOR = {
  person: "Avery",
  day: "Saturday",
  scheduledHours: 8,
  workedHours: 10,
};

function line(
  code: string,
  description: string,
  pack: string,
  qty: number,
  unit: string,
  unitPrice: number,
): PrairieLine {
  return {
    code,
    description,
    pack,
    qty,
    unit,
    unitPrice,
    extension: round2(qty * unitPrice),
  };
}

export function productSubtotal(invoice: PrairieInvoice): number {
  return round2(invoice.lines.reduce((sum, item) => sum + item.extension, 0));
}

export type PriceDirection = "higher" | "lower" | "steady";

export type ComparedLine = {
  code: string;
  description: string;
  pack: string;
  unit: string;
  earlierQty: number;
  laterQty: number;
  earlierPrice: number;
  laterPrice: number;
  unitDelta: number;
  atLaterQty: number;
  direction: PriceDirection;
};

export type PrairieCompare = {
  rows: ComparedLine[];
  higher: number;
  lower: number;
  steady: number;
  matched: number;
  deliveryDelta: number;
  productDelta: number;
  lead: ComparedLine | null;
};

export function comparePrairie(earlier: PrairieInvoice, later: PrairieInvoice): PrairieCompare {
  const rows: ComparedLine[] = [];
  for (const left of earlier.lines) {
    const right = later.lines.find((item) => item.code === left.code);
    if (!right) continue;
    const unitDelta = round2(right.unitPrice - left.unitPrice);
    const direction: PriceDirection = unitDelta > 0 ? "higher" : unitDelta < 0 ? "lower" : "steady";
    rows.push({
      code: left.code,
      description: left.description,
      pack: left.pack,
      unit: right.unit,
      earlierQty: left.qty,
      laterQty: right.qty,
      earlierPrice: left.unitPrice,
      laterPrice: right.unitPrice,
      unitDelta,
      atLaterQty: round2(unitDelta * right.qty),
      direction,
    });
  }
  const higher = rows.filter((row) => row.direction === "higher").length;
  const lower = rows.filter((row) => row.direction === "lower").length;
  const steady = rows.filter((row) => row.direction === "steady").length;
  const lead = rows.find((row) => row.direction === "higher") ?? null;
  return {
    rows,
    higher,
    lower,
    steady,
    matched: rows.length,
    deliveryDelta: round2(later.delivery - earlier.delivery),
    productDelta: round2(rows.reduce((sum, row) => sum + row.atLaterQty, 0)),
    lead,
  };
}

export function matchSentence(compare: PrairieCompare): string {
  const item =
    compare.higher === 1 ? "1 matched item went up." : `${compare.higher} matched items went up.`;
  return `${item} ${compare.matched} matched products: ${compare.higher} higher, ${compare.steady} steady, ${compare.lower} lower.`;
}
