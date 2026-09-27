import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createWorker } from "tesseract.js";
import { checkInvoices } from "../src/lib/parseInvoice";
import { applyPhotoTrust } from "../src/lib/photoHonesty";
import { paperFromOcr } from "../src/lib/readPhoto";
import { pngOf } from "./pngLine";

const lang = "public/tesseract/lang/eng.traineddata.gz";

test("a real photo read does not verify an invented dollar", { timeout: 60_000 }, async () => {
  assert.equal(existsSync(lang), true, "photo reader language file is missing");
  const worker = await createWorker("eng", 1, {
    langPath: "public/tesseract/lang",
    gzip: true,
    cacheMethod: "none",
  });
  try {
    const result = await worker.recognize(pngOf("$48.00"), {}, { blocks: true });
    const paper = paperFromOcr(result.data);
    const shown = applyPhotoTrust(
      checkInvoices(paper.text || "not a price", "Mozzarella cheese $56.00"),
      paper.trust ?? { confidence: null, moneyConfidence: null },
    );
    assert.equal(
      shown.rows.some((row) => row.honesty === "Verified" && /\$\s*\d/.test(row.value)),
      false,
    );
    const score = paper.trust?.moneyConfidence ?? paper.trust?.confidence ?? 0;
    const amounts = (paper.text.match(/\d+\.\d{2}/g) ?? []).map((n) => Number(n).toFixed(2));
    if (score < 40) {
      const blob = `${shown.headline}\n${shown.rows.map((row) => row.value).join("\n")}`;
      assert.equal(/\$\s*\d/.test(blob), false);
    } else {
      for (const amount of amounts) assert.equal(amount, "48.00");
    }
  } finally {
    await worker.terminate();
  }
});
