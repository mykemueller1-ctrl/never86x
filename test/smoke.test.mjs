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

test("signed-out doors stay on-site in sample mode", () => {
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
    "src/components/SignInToSave.tsx",
    "src/components/SamplePanels.tsx",
  ];
  const joined = files.map((p) => readFileSync(p, "utf8")).join("\n");
  assert.equal(joined.includes("auth.openai.com"), false);
  assert.equal(joined.includes("signin-with-chatgpt"), false);
  assert.match(joined, /Sample mode/);
  assert.match(joined, /Sign in to save your own invoices, free, no card/);
  assert.match(readFileSync("src/app/try/watch/page.tsx", "utf8"), /href="\/check\/invoices"/);
  assert.match(readFileSync("src/app/try/recipes/page.tsx", "utf8"), /href="\/check\/menu"/);
});
