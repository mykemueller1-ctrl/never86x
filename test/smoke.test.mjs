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
    "docs/email/welcome.md",
    "docs/email/support-ack.md",
    "src/lib/audit.ts",
    "src/lib/rateLimit.ts",
  ]) {
    assert.equal(existsSync(p), true, `missing ${p}`);
  }
});

test("layout nav and footer links", () => {
  const src = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(src, /href="\/pricing"/);
  assert.match(src, /href="\/onboarding"[\s\S]*Start/);
  assert.match(src, /href="\/support"/);
  assert.match(src, /href="\/status"/);
  assert.match(src, /href="\/terms"/);
});

test("pricing page does not invent a dollar figure", () => {
  const src = readFileSync("src/app/pricing/page.tsx", "utf8");
  assert.equal(/\$\d/.test(src), false);
  assert.match(src, /Free/);
  assert.match(src, /TBD/);
});

test("checkout fails closed without stripe narrative", () => {
  const src = readFileSync("src/app/api/billing/checkout/route.ts", "utf8");
  assert.match(src, /STRIPE_SECRET_KEY/);
  assert.match(src, /503/);
});

test("honesty component exposes required labels", () => {
  const src = readFileSync("src/components/Honesty.tsx", "utf8");
  assert.match(src, /Verified/);
  assert.match(src, /Missing/);
});
