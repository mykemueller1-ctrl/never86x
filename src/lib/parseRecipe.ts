import type { CheckResult, CheckRow } from "./honesty";
import { NOT_ON_PAPER } from "./honesty";
import { formatMoney, formatPercent, round2 } from "./money";

type UnitFamily = Record<string, number>;

const MASS: UnitFamily = {
  oz: 1,
  ounce: 1,
  ounces: 1,
  lb: 16,
  lbs: 16,
  pound: 16,
  pounds: 16,
};

const VOL: UnitFamily = {
  floz: 1,
  cup: 8,
  cups: 8,
  pint: 16,
  quart: 32,
  gallon: 128,
  gal: 128,
};

const EACH: UnitFamily = { each: 1, ea: 1 };

function family(unit: string): UnitFamily | null {
  const u = unit.toLowerCase().replace(/\./g, "");
  if (u in MASS) return MASS;
  if (u in VOL) return VOL;
  if (u in EACH) return EACH;
  return null;
}

function unitFactor(qtyUnit: string, priceUnit: string): number | null {
  const left = family(qtyUnit);
  const right = family(priceUnit);
  if (!left || left !== right) return null;
  const q = left[qtyUnit.toLowerCase().replace(/\./g, "")];
  const p = right[priceUnit.toLowerCase().replace(/\./g, "")];
  if (!q || !p) return null;
  return q / p;
}

type Ingredient = {
  name: string;
  cost: number | null;
  honesty: "Verified" | "Estimated" | "Missing";
  detail?: string;
};

function splitCsv(line: string): string[] {
  return line.split(",").map((part) => part.trim());
}

function money(raw: string): number | null {
  const t = raw.trim();
  if (!/^\$?\d{1,7}(?:\.\d{1,2})?$/.test(t)) return null;
  const n = Number(t.replace("$", ""));
  return Number.isFinite(n) ? round2(n) : null;
}

function parseIngredient(line: string): Ingredient | null {
  const extended = line.match(/^(.+?)\s+[—–-]\s+(\$?\d{1,7}(?:\.\d{1,2})?)\s*$/);
  if (extended) {
    const cost = money(extended[2]);
    return {
      name: extended[1].trim(),
      cost,
      honesty: cost == null ? "Missing" : "Verified",
      detail: cost == null ? undefined : "Line cost written on the card.",
    };
  }

  const converted = line.match(
    /^(\d+(?:\.\d+)?)\s+([a-zA-Z.]+)\s+(.+?)\s+@\s+(\$?\d+(?:\.\d{1,2})?)\s*\/\s*([a-zA-Z.]+)\s*$/,
  );
  if (converted) {
    const qty = Number(converted[1]);
    const qtyUnit = converted[2];
    const name = converted[3].trim();
    const price = money(converted[4]);
    const priceUnit = converted[5];
    if (price == null) {
      return { name, cost: null, honesty: "Missing", detail: "No price after @." };
    }
    const factor = unitFactor(qtyUnit, priceUnit);
    if (factor == null) {
      return {
        name,
        cost: null,
        honesty: "Missing",
        detail: `${qtyUnit} and ${priceUnit} are different units. No cost until they match.`,
      };
    }
    return {
      name,
      cost: round2(qty * factor * price),
      honesty: "Estimated",
      detail: `${qty} ${qtyUnit} at ${formatMoney(price)}/${priceUnit}.`,
    };
  }

  return null;
}

export function checkRecipe(text: string): CheckResult {
  if (!text.trim()) return { headline: "Paste a recipe.", rows: [] };

  const rowsIn = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);

  let name = "This plate";
  let menu: number | null = null;
  const ingredients: Ingredient[] = [];
  const header = rowsIn[0]?.toLowerCase() ?? "";
  const csv =
    header.includes(",") && /ingredient|item|name/.test(header) && /price|cost/.test(header);

  if (csv) {
    const heads = splitCsv(rowsIn[0]).map((h) => h.toLowerCase());
    const nameIdx = heads.findIndex((h) => /ingredient|item|name/.test(h));
    const qtyIdx = heads.findIndex((h) => /qty|quantity|amount/.test(h));
    const unitIdx = heads.findIndex((h) => h === "unit" || h.startsWith("unit"));
    const priceIdx = heads.findIndex((h) => /price|cost/.test(h));
    const perIdx = heads.findIndex((h) => /per|price unit/.test(h));
    for (const row of rowsIn.slice(1)) {
      const cols = splitCsv(row);
      const item = cols[nameIdx] ?? "";
      if (!item) continue;
      if (qtyIdx >= 0 && unitIdx >= 0 && perIdx >= 0 && priceIdx >= 0) {
        const built = parseIngredient(
          `${cols[qtyIdx]} ${cols[unitIdx]} ${item} @ ${cols[priceIdx]}/${cols[perIdx]}`,
        );
        ingredients.push(built ?? { name: item, cost: null, honesty: "Missing" });
      } else if (priceIdx >= 0) {
        const cost = money(cols[priceIdx] ?? "");
        ingredients.push({
          name: item,
          cost,
          honesty: cost == null ? "Missing" : "Verified",
          detail: "Price column.",
        });
      }
    }
  } else {
    for (const row of rowsIn) {
      const sell = row.match(/^(.*?)\s*\|\s*(?:sell|menu)\s+(\$?\d+(?:\.\d{1,2})?)\s*$/i);
      if (sell) {
        name = sell[1].trim() || name;
        menu = money(sell[2]);
        continue;
      }
      const ingredient = parseIngredient(row);
      if (ingredient) {
        ingredients.push(ingredient);
        continue;
      }
      if (!/\$|@/.test(row) && ingredients.length === 0 && name === "This plate") {
        name = row;
      } else {
        ingredients.push({
          name: row,
          cost: null,
          honesty: "Missing",
          detail: "This line has no price we can read.",
        });
      }
    }
  }

  const out: CheckRow[] = [];
  out.push({
    label: "Menu price",
    value: menu == null ? NOT_ON_PAPER : formatMoney(menu),
    honesty: menu == null ? "Missing" : "Verified",
  });

  for (const item of ingredients) {
    out.push({
      label: item.name,
      value: item.cost == null ? NOT_ON_PAPER : formatMoney(item.cost),
      honesty: item.honesty,
      detail: item.detail,
    });
  }

  const missingCost = ingredients.length === 0 || ingredients.some((item) => item.cost == null);
  const plate = missingCost
    ? null
    : round2(ingredients.reduce((sum, item) => sum + (item.cost ?? 0), 0));

  out.push({
    label: "Plate cost",
    value: plate == null ? NOT_ON_PAPER : formatMoney(plate),
    honesty: plate == null ? "Missing" : "Estimated",
    detail:
      plate == null
        ? "One ingredient has no price, so the plate total stays blank."
        : "Sum of the ingredient lines.",
  });

  const pct = plate != null && menu != null ? formatPercent(plate, menu) : null;
  out.push({
    label: "Food cost",
    value: pct ?? NOT_ON_PAPER,
    honesty: pct ? "Estimated" : "Missing",
    detail: pct ? "Plate cost divided by the menu price." : undefined,
  });

  const left = plate != null && menu != null ? round2(menu - plate) : null;
  out.push({
    label: "Left before labor",
    value: left == null ? NOT_ON_PAPER : formatMoney(left),
    honesty: left == null ? "Missing" : "Estimated",
    detail: left == null ? undefined : "Menu price minus plate cost. Not a profit number.",
  });

  const headline =
    plate == null
      ? `${name}. Plate cost is not on the card yet.`
      : `${name}. Plate cost ${formatMoney(plate)}.`;

  return { headline, rows: out };
}
