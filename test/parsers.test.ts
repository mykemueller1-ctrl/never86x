import test from "node:test";
import assert from "node:assert/strict";
import { checkInvoices, parseInvoice } from "../src/lib/parseInvoice";
import { checkRecipe } from "../src/lib/parseRecipe";
import { checkLabor } from "../src/lib/parseLabor";
import { presentRows, type CheckResult } from "../src/lib/honesty";
import {
  SAMPLE_CLOCK_PASTE,
  SAMPLE_INVOICE_EARLIER,
  SAMPLE_INVOICE_LATER,
  SAMPLE_LABOR,
  SAMPLE_MOZZ,
  SAMPLE_PLATE,
  SAMPLE_RECIPE_PASTE,
  SAMPLE_SCHEDULE_PASTE,
} from "../src/lib/sample";

test("sample invoices show the published $8 and do not invent tax", () => {
  const result = checkInvoices(SAMPLE_INVOICE_EARLIER, SAMPLE_INVOICE_LATER);
  assert.match(result.headline, /\$8\.00/);
  const earlier = result.rows.find((row) => row.label.startsWith("Earlier"));
  const later = result.rows.find((row) => row.label.startsWith("Later"));
  const change = result.rows.find((row) => row.label.startsWith("Change"));
  const tax = result.rows.find((row) => row.label === "Tax");
  assert.equal(earlier?.value, "$48.00");
  assert.equal(earlier?.honesty, "Verified");
  assert.equal(later?.value, "$56.00");
  assert.equal(later?.honesty, "Verified");
  assert.equal(change?.value, "+$8.00 per case");
  assert.equal(change?.honesty, "Estimated");
  assert.equal(change?.detail, "16.7% on the earlier price");
  assert.equal(tax?.honesty, "Missing");
  assert.equal(SAMPLE_MOZZ.delta, 8);
});

test("an invoice number is not a price", () => {
  const parsed = parseInvoice("Invoice 3498211\nCheddar $12.00");
  assert.equal(parsed.lines.length, 1);
  assert.equal(parsed.lines[0].price, 12);
  assert.equal(parsed.lines[0].description.includes("3498211"), false);
});

test("unmatched lines do not get a made-up change", () => {
  const result = checkInvoices("Cheddar cheese $12.00", "Mozzarella cheese $56.00");
  assert.equal(result.rows.some((row) => row.label.startsWith("Change")), false);
  assert.equal(result.headline.includes("$"), false);
});

test("a line with no price stays missing", () => {
  const result = checkInvoices(
    "Mozzarella cheese whole milk 20 lb case",
    "Mozzarella cheese whole milk 20 lb case $56.00",
  );
  const change = result.rows.find((row) => row.label.startsWith("Change"));
  assert.equal(change?.honesty, "Missing");
  assert.equal(change?.value, "Not on the paper");
});

test("sample recipe is the published $4 plate and 25%", () => {
  const result = checkRecipe(SAMPLE_RECIPE_PASTE);
  const plate = result.rows.find((row) => row.label === "Plate cost");
  const menu = result.rows.find((row) => row.label === "Menu price");
  const pct = result.rows.find((row) => row.label === "Food cost");
  const left = result.rows.find((row) => row.label === "Left before labor");
  assert.equal(plate?.value, "$4.00");
  assert.equal(plate?.honesty, "Estimated");
  assert.equal(menu?.value, "$16.00");
  assert.equal(menu?.honesty, "Verified");
  assert.equal(pct?.value, "25%");
  assert.equal(left?.value, "$12.00");
  assert.equal(SAMPLE_PLATE.ingredientCost, 4);
  assert.equal(SAMPLE_PLATE.ingredientPercent, 25);
});

test("one missing ingredient blocks the plate total", () => {
  const result = checkRecipe("House cheese pizza | sell $16.00\nMozzarella\nDough — $1.50");
  const plate = result.rows.find((row) => row.label === "Plate cost");
  const mozz = result.rows.find((row) => row.label === "Mozzarella");
  assert.equal(plate?.honesty, "Missing");
  assert.equal(plate?.value, "Not on the paper");
  assert.equal(mozz?.honesty, "Missing");
  assert.equal(result.rows.some((row) => row.value === "$1.50" && row.label === "Plate cost"), false);
});

test("ounces at a per-pound price convert, mismatched units do not", () => {
  const converted = checkRecipe("8 oz mozzarella @ $2.80/lb");
  const line = converted.rows.find((row) => row.label === "mozzarella");
  assert.equal(line?.value, "$1.40");
  assert.equal(line?.honesty, "Estimated");

  const blocked = checkRecipe("8 oz mozzarella @ $2.80/case");
  const missing = blocked.rows.find((row) => row.label === "mozzarella");
  assert.equal(missing?.honesty, "Missing");
  assert.equal(missing?.value, "Not on the paper");
});

test("sample Friday labor is the published 1.5 hours and $31", () => {
  const result = checkLabor(SAMPLE_SCHEDULE_PASTE, SAMPLE_CLOCK_PASTE);
  const net = result.rows.find((row) => row.label === "Net hours");
  const pay = result.rows.find((row) => row.label === "Straight-time difference");
  const alex = result.rows.find((row) => row.label === "Alex · pay drift");
  const jordan = result.rows.find((row) => row.label === "Jordan · pay drift");
  assert.equal(net?.value, "+1.5 h");
  assert.equal(pay?.value, "+$31.00");
  assert.equal(pay?.honesty, "Estimated");
  assert.equal(alex?.value, "+$40.00");
  assert.equal(jordan?.value, "-$9.00");
  assert.equal(SAMPLE_LABOR.straightTimeDollars, 31);
  assert.equal(SAMPLE_LABOR.netHours, 1.5);
});

test("each sample row is labeled, and Sample does not hide a missing tax", () => {
  const invoices = checkInvoices(SAMPLE_INVOICE_EARLIER, SAMPLE_INVOICE_LATER);
  const shown = presentRows(invoices.rows, true);
  assert.equal(shown.find((row) => row.label === "Tax")?.honesty, "Missing");
  assert.equal(shown.find((row) => row.label.startsWith("Earlier"))?.honesty, "Sample");
  assert.equal(shown.find((row) => row.label.startsWith("Change"))?.honesty, "Sample");

  const plate = checkRecipe(SAMPLE_RECIPE_PASTE);
  assert.equal(plate.rows.find((row) => row.label === "Menu price")?.honesty, "Verified");
  assert.equal(plate.rows.find((row) => row.label === "Plate cost")?.honesty, "Estimated");
  assert.equal(plate.rows.find((row) => row.label === "Food cost")?.honesty, "Estimated");

  const labor = checkLabor(SAMPLE_SCHEDULE_PASTE, SAMPLE_CLOCK_PASTE);
  assert.equal(labor.rows.find((row) => row.label === "Alex · rate")?.honesty, "Verified");
  assert.equal(labor.rows.find((row) => row.label === "Alex · hour drift")?.honesty, "Estimated");
  assert.equal(labor.rows.find((row) => row.label === "Straight-time difference")?.honesty, "Estimated");
});

test("csv prices are read, and a tied name is not paired", () => {
  const csv = checkInvoices(
    "item,price\nMozzarella cheese,48",
    "item,price\nMozzarella cheese,56",
  );
  assert.equal(csv.rows.find((row) => row.label.startsWith("Earlier"))?.value, "$48.00");
  assert.equal(csv.rows.find((row) => row.label.startsWith("Earlier"))?.honesty, "Verified");
  assert.equal(csv.rows.find((row) => row.label.startsWith("Change"))?.value, "+$8.00");
  assert.equal(csv.rows.find((row) => row.label.startsWith("Change"))?.honesty, "Estimated");

  const tied = checkInvoices("Mozzarella cheese $40.00", "Mozzarella cheese $10.00\nMozzarella cheese $90.00");
  assert.equal(tied.rows.some((row) => row.label.startsWith("Change")), false);
  assert.equal(tied.headline.includes("$"), false);
});

test("past midnight is estimated, and two rates produce no pay", () => {
  const overnight = checkLabor(
    "Alex in 10:00pm out 2:00am break 0 rate 15",
    "Alex in 10:00pm out 2:00am break 0 rate 15",
  );
  const hours = overnight.rows.find((row) => row.label === "Alex · scheduled");
  assert.equal(hours?.value, "4 h");
  assert.equal(hours?.honesty, "Estimated");
  assert.match(hours?.detail ?? "", /midnight/);

  const split = checkLabor(
    "Alex in 4:00pm out 9:00pm break 30 rate 20",
    "Alex in 4:00pm out 11:00pm break 30 rate 18",
  );
  const pay = split.rows.find((row) => row.label === "Alex · pay drift");
  assert.equal(pay?.honesty, "Missing");
  assert.equal(pay?.value, "Not on the paper");
  assert.equal(split.rows.some((row) => /\$\d/.test(row.value)), false);
});

test("empty papers and a recipe with no prices do not invent a dollar", () => {
  const cases: { name: string; result: CheckResult; source: string }[] = [
    { name: "blank invoices", result: checkInvoices("", "   "), source: "" },
    { name: "words only", result: checkInvoices("Vendor: Foods", "See you Friday"), source: "Vendor: Foods\nSee you Friday" },
    { name: "blank recipe", result: checkRecipe(""), source: "" },
    { name: "recipe names only", result: checkRecipe("House cheese pizza\nMozzarella\nDough"), source: "House cheese pizza\nMozzarella\nDough" },
    { name: "blank labor", result: checkLabor("", "Alex"), source: "" },
    { name: "labor no rate", result: checkLabor("Alex in 4:00pm out 9:00pm break 30", "Alex in 4:00pm out 11:00pm break 30"), source: "Alex in 4:00pm out 9:00pm break 30\nAlex in 4:00pm out 11:00pm break 30" },
  ];
  for (const item of cases) {
    assertNoInventedDollar(item.result, item.source, item.name);
  }
});

test("labor dollars stay missing when the rate is not on the paper", () => {
  const result = checkLabor(
    "Alex in 4:00pm out 9:00pm break 30",
    "Alex in 4:00pm out 11:00pm break 30",
  );
  const pay = result.rows.find((row) => row.label === "Alex · pay drift");
  const total = result.rows.find((row) => row.label === "Straight-time difference");
  const hours = result.rows.find((row) => row.label === "Alex · hour drift");
  assert.equal(hours?.value, "+2 h");
  assert.equal(hours?.honesty, "Estimated");
  assert.equal(pay?.honesty, "Missing");
  assert.equal(total?.honesty, "Missing");
  assert.equal(result.rows.some((row) => /\$\d/.test(row.value)), false);
});

function numbersOn(source: string): Set<string> {
  const found = new Set<string>();
  for (const match of source.matchAll(/\d+(?:\.\d+)?/g)) {
    const n = Number(match[0]);
    if (Number.isFinite(n)) found.add(n.toFixed(2));
  }
  return found;
}

function assertNoInventedDollar(result: CheckResult, source: string, name: string) {
  const have = numbersOn(source);
  const blob = `${result.headline}\n${result.rows.map((row) => row.value).join("\n")}`;
  if (have.size === 0) {
    assert.equal(/\$\s*\d/.test(blob), false, `${name} invented a dollar in ${blob}`);
  }
  for (const row of result.rows) {
    if (row.honesty === "Missing") {
      assert.equal(/\$\s*\d/.test(row.value), false, `${name} missing row has ${row.value}`);
    }
    if (row.honesty !== "Verified") continue;
    for (const match of row.value.matchAll(/\$\s*(\d{1,7}(?:,\d{3})*(?:\.\d{2})?)/g)) {
      const n = Number(match[1].replace(/,/g, "")).toFixed(2);
      assert.equal(have.has(n), true, `${name} verified ${row.label} invented ${n}`);
    }
  }
}
