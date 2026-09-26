import test from "node:test";
import assert from "node:assert/strict";
import { checkInvoices } from "../src/lib/parseInvoice";
import { checkRecipe } from "../src/lib/parseRecipe";
import { checkLabor } from "../src/lib/parseLabor";
import {
  PHOTO_LOW,
  PHOTO_REFUSE,
  applyPhotoTrust,
  moneyWordConfidence,
  photoDecision,
  tighterTrust,
} from "../src/lib/photoHonesty";
import { paperFromOcr } from "../src/lib/readPhoto";
import { parseStoredCards } from "../src/lib/history";

const priced = checkInvoices(
  "Mozzarella cheese whole milk 20 lb case $48.00",
  "Mozzarella cheese whole milk 20 lb case $56.00",
);

test("a clear photo is estimated, never verified", () => {
  const shown = applyPhotoTrust(priced, { confidence: 92, moneyConfidence: 91 });
  assert.equal(shown.lowConfidence, false);
  assert.match(shown.photoNote ?? "", /91%/);
  assert.equal(shown.rows.some((row) => row.honesty === "Verified"), false);
  assert.equal(shown.rows.find((row) => row.label.startsWith("Change"))?.value, "+$8.00 per case");
  assert.equal(shown.rows.find((row) => row.label.startsWith("Earlier"))?.honesty, "Estimated");
});

test("low confidence is flagged and still not a verified dollar", () => {
  const shown = applyPhotoTrust(priced, { confidence: 80, moneyConfidence: 55 });
  assert.equal(photoDecision({ confidence: 80, moneyConfidence: 55 }), "low");
  assert.equal(shown.lowConfidence, true);
  assert.match(shown.photoNote ?? "", /Low confidence/);
  assert.equal(shown.rows.some((row) => row.honesty === "Verified"), false);
  assert.equal(shown.rows.find((row) => row.label.startsWith("Later"))?.value, "$56.00");
});

test("a blurry photo never invents a dollar", () => {
  const shown = applyPhotoTrust(priced, { confidence: 12, moneyConfidence: 12 });
  const blob = `${shown.headline}\n${shown.rows.map((row) => `${row.value}`).join("\n")}`;
  assert.equal(/\$\s*\d/.test(blob), false);
  assert.equal(shown.rows.every((row) => !row.value.includes("$") || row.honesty === "Missing"), true);
  assert.match(shown.headline, /too low to price/);
  assert.equal(applyPhotoTrust(priced, { confidence: null, moneyConfidence: null }).rows.some((row) => /\$\s*\d/.test(row.value)), false);
});

test("confidence gates sit at 70 and 40", () => {
  assert.equal(photoDecision({ confidence: PHOTO_LOW, moneyConfidence: null }), "ok");
  assert.equal(photoDecision({ confidence: PHOTO_LOW - 0.1, moneyConfidence: null }), "low");
  assert.equal(photoDecision({ confidence: PHOTO_REFUSE, moneyConfidence: null }), "low");
  assert.equal(photoDecision({ confidence: PHOTO_REFUSE - 0.1, moneyConfidence: null }), "refuse");
  assert.equal(photoDecision({ confidence: null, moneyConfidence: null }), "refuse");
});

test("money-word confidence uses the weakest price, and the worse paper wins", () => {
  assert.equal(
    moneyWordConfidence([
      { text: "Mozzarella", confidence: 99 },
      { text: "$48.00", confidence: 81 },
      { text: "$2.00", confidence: 44 },
    ]),
    44,
  );
  assert.equal(moneyWordConfidence([{ text: "Mozzarella", confidence: 10 }]), null);
  const tight = tighterTrust({ confidence: 90, moneyConfidence: 88 }, { confidence: 40, moneyConfidence: 30 });
  assert.equal(tight?.moneyConfidence, 30);
});

test("ocr output with no score does not become a price", () => {
  const read = paperFromOcr({
    text: "Mozzarella cheese $48.00",
    confidence: 15,
    blocks: [
      {
        paragraphs: [
          { lines: [{ words: [{ text: "$48.00", confidence: 15 }] }] },
        ],
      },
    ],
  });
  assert.ok(read.error);
  const plate = applyPhotoTrust(checkRecipe("House pizza | sell $16.00\nCheese — $1.40"), read.trust);
  assert.equal(/\$\s*\d/.test(plate.rows.map((row) => row.value).join(" ")), false);

  const labor = applyPhotoTrust(
    checkLabor("Alex in 4:00pm out 9:00pm break 30 rate 20", "Alex in 4:00pm out 11:00pm break 30 rate 20"),
    { confidence: 10, moneyConfidence: 10 },
  );
  assert.equal(/\$\s*\d/.test(`${labor.headline}\n${labor.rows.map((row) => row.value).join("\n")}`), false);
});

test("a confident ocr page keeps the text and says it is not verified", () => {
  const read = paperFromOcr({
    text: "Mozzarella $48.00",
    confidence: 93,
    blocks: [{ paragraphs: [{ lines: [{ words: [{ text: "$48.00", confidence: 93 }] }] }] }],
  });
  assert.equal(read.error, null);
  assert.match(read.notice, /Not Verified/);
  assert.equal(read.trust?.moneyConfidence, 93);
});

test("broken history is an error, not a made-up card", () => {
  assert.equal(parseStoredCards(null).cards.length, 0);
  assert.equal(parseStoredCards(null).error, null);
  assert.ok(parseStoredCards("{").error);
  assert.equal(parseStoredCards("{").cards.length, 0);
  assert.ok(parseStoredCards('{"title":"nope"}').error);
  const ok = parseStoredCards(
    JSON.stringify([
      { id: "1", tool: "invoices", title: "Mozz", text: "Earlier: $48.00", at: "2026-09-26" },
      { id: "2", tool: "nope", title: "x", text: "y", at: "z" },
    ]),
  );
  assert.equal(ok.error, null);
  assert.equal(ok.cards.length, 1);
  assert.equal(ok.cards[0].title, "Mozz");
});
