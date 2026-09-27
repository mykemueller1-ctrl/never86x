import assert from "node:assert/strict";
import test from "node:test";
import { formatMoney } from "../src/lib/money";
import {
  PRAIRIE_EARLIER,
  PRAIRIE_LABOR,
  PRAIRIE_LATER,
  comparePrairie,
  matchSentence,
  productSubtotal,
} from "../src/lib/prairie";

test("Prairie Route invoices match the printed fictional totals", () => {
  assert.equal(productSubtotal(PRAIRIE_EARLIER), 1276);
  assert.equal(productSubtotal(PRAIRIE_LATER), 1336);
  for (const invoice of [PRAIRIE_EARLIER, PRAIRIE_LATER]) {
    for (const item of invoice.lines) {
      assert.equal(item.extension, Math.round(item.qty * item.unitPrice * 100) / 100);
    }
    assert.equal(
      Math.round((productSubtotal(invoice) + invoice.delivery + invoice.tax) * 100) / 100,
      invoice.total,
    );
  }
  assert.equal(PRAIRIE_EARLIER.tax, 0);
  assert.equal(PRAIRIE_LATER.tax, 0);
});

test("the later delivery is $60 more because mozzarella moved $6 on 10 cases", () => {
  const compare = comparePrairie(PRAIRIE_EARLIER, PRAIRIE_LATER);
  assert.equal(compare.lead?.code, "MOZ-305");
  assert.equal(compare.lead?.earlierPrice, 72);
  assert.equal(compare.lead?.laterPrice, 78);
  assert.equal(compare.lead?.unitDelta, 6);
  assert.equal(compare.lead?.laterQty, 10);
  assert.equal(compare.lead?.atLaterQty, 60);
  assert.equal(compare.productDelta, 60);
  assert.equal(compare.higher, 1);
  assert.equal(compare.steady, 3);
  assert.equal(compare.lower, 0);
  assert.equal(compare.matched, 4);
  assert.equal(compare.deliveryDelta, 0);
  assert.equal(matchSentence(compare), "1 matched item went up. 4 matched products: 1 higher, 3 steady, 0 lower.");
  assert.equal(formatMoney(compare.productDelta), "$60.00");
});

test("the labor card has hours and does not invent a wage", () => {
  assert.equal(PRAIRIE_LABOR.workedHours - PRAIRIE_LABOR.scheduledHours, 2);
  assert.equal("wage" in PRAIRIE_LABOR, false);
});
