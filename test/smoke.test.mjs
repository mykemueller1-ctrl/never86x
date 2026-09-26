import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

test("ship surfaces exist", () => {
  for (const p of [
    "src/app/api/health/route.ts",
    "src/app/api/audit/route.ts",
    "src/app/api/billing/checkout/route.ts",
    "src/app/pricing/page.tsx",
    "src/app/terms/page.tsx",
    "src/app/status/page.tsx",
    "src/app/support/page.tsx",
    "src/app/onboarding/page.tsx",
    "src/app/admin/page.tsx",
    ".github/workflows/ci.yml",
    ".env.example",
    "docs/INCIDENT.md",
    "docs/SHIP-CHECKLIST.md",
  ]) {
    assert.equal(existsSync(p), true, `missing ${p}`);
  }
});

test("checkout fails closed without stripe narrative", () => {
  const src = readFileSync("src/app/api/billing/checkout/route.ts", "utf8");
  assert.match(src, /STRIPE_SECRET_KEY/);
  assert.match(src, /503/);
});

test("honesty component exposes required labels", () => {
  const src = readFileSync("src/components/Honesty.tsx", "utf8");
  assert.match(src, /Verified/);
  assert.match(src, /Estimated/);
  assert.match(src, /Missing/);
  assert.match(src, /Sample/);
});

test("signed-out checks read the owner's papers on the phone", () => {
  const files = [
    "src/app/page.tsx",
    "src/app/try/page.tsx",
    "src/app/try/watch/page.tsx",
    "src/app/try/recipes/page.tsx",
    "src/app/try/labor/page.tsx",
    "src/app/try/desk/page.tsx",
    "src/app/check/invoices/page.tsx",
    "src/app/check/menu/page.tsx",
    "src/app/check/labor/page.tsx",
    "src/app/seat/page.tsx",
    "src/components/InvoiceCheck.tsx",
    "src/components/MenuCheck.tsx",
    "src/components/LaborCheck.tsx",
    "src/components/SamplePanels.tsx",
    "src/lib/readPaper.ts",
  ];
  const joined = files.map((p) => readFileSync(p, "utf8")).join("\n");
  assert.equal(joined.includes("auth.openai.com"), false);
  assert.equal(joined.includes("signin-with-chatgpt"), false);
  assert.equal(existsSync("src/components/SignInToSave.tsx"), false);
  assert.match(joined, /Nothing is uploaded/);
  assert.match(readFileSync("src/lib/readPhoto.ts", "utf8"), /import\("tesseract\.js"\)/);
  assert.match(readFileSync("src/components/InvoiceCheck.tsx", "utf8"), /Nothing compared yet/);
  assert.match(readFileSync("src/components/MenuCheck.tsx", "utf8"), /Nothing costed yet/);
  assert.match(readFileSync("src/components/LaborCheck.tsx", "utf8"), /Nothing compared yet/);
  assert.match(readFileSync("src/components/PhoneSeat.tsx", "utf8"), /No cards yet/);
  assert.equal(existsSync("src/app/loading.tsx"), true);
  assert.equal(existsSync("src/app/error.tsx"), true);
  assert.equal(existsSync("src/app/not-found.tsx"), true);
  assert.match(readFileSync("src/app/try/watch/page.tsx", "utf8"), /href="\/check\/invoices"/);
  assert.match(readFileSync("src/app/try/recipes/page.tsx", "utf8"), /href="\/check\/menu"/);
  assert.match(readFileSync("src/app/layout.tsx", "utf8"), /summary_large_image/);
});
