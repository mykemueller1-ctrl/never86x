import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BANNED = [
  { name: "Pulse", re: /\bPulse\b/i },
  { name: "24-agent workforce", re: /24-agent workforce/i },
  { name: "Command Center", re: /Command Center/i },
  { name: "Community logic", re: /Community logic/i },
  { name: "seat price", re: /\$(?:99|129|199|399|499)\b/ },
  { name: "Month-end card", re: /Month-end is too late/i },
  { name: "DoorDash card", re: /\bDoorDash\b/ },
  { name: "operating intelligence", re: /Restaurant operating intelligence/i },
  { name: "multi-unit operators", re: /multi-unit operators/i },
];

const REQUIRED = [
  "Never86'd",
  "One Seat",
  "Action Shift",
  "You run the restaurant. Let's check the numbers.",
  "You run the restaurant. Let's watch the costs.",
  "Your first owner seat is free. No card. No POS.",
  "No CFO. No back office. Still your numbers.",
  "What went up on my invoice?",
  "Why did the shift run over?",
  "What does this plate cost now?",
  "https://never86.ai",
  "The first owner seat is free for one restaurant, with pilot usage limits.",
  "Additional manager seats are planned as paid options.",
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(tsx|ts|jsx|js|mjs)$/.test(name)) out.push(path);
  }
  return out;
}

function corpus() {
  const files = [
    ...walk("src/app"),
    ...walk("src/components"),
    "src/lib/brand.ts",
    "src/lib/ogCard.tsx",
    "src/lib/honesty.ts",
  ];
  return files.map((file) => ({ file, text: readFileSync(file, "utf8") }));
}

test("customer pages do not use retired names or a seat price", () => {
  for (const { file, text } of corpus()) {
    for (const ban of BANNED) {
      assert.equal(ban.re.test(text), false, `${file} contains ${ban.name}`);
    }
  }
});

test("the brand sheet is the copy on the pages people see", () => {
  const joined = corpus().map((item) => item.text).join("\n");
  for (const line of REQUIRED) {
    assert.equal(joined.includes(line), true, `missing ${line}`);
  }
  const home = readFileSync("src/components/OneSeat.tsx", "utf8");
  for (const name of ["HEADLINE", "TAGLINE", "ONE_SENTENCE", "INVOICE_Q", "SHIFT_Q", "PLATE_Q"]) {
    assert.match(home, new RegExp(`\\b${name}\\b`));
  }
  assert.match(readFileSync("src/app/layout.tsx", "utf8"), /\bSITE\b/);
  assert.match(readFileSync("src/app/check/invoices/page.tsx", "utf8"), /INVOICE_Q/);
  assert.match(readFileSync("src/app/check/labor/page.tsx", "utf8"), /SHIFT_Q/);
  assert.match(readFileSync("src/app/check/menu/page.tsx", "utf8"), /PLATE_Q/);
  assert.match(readFileSync("src/components/ResultCard.tsx", "utf8"), /shareUrl/);
  assert.equal(/\$\d/.test(readFileSync("src/app/pricing/page.tsx", "utf8")), false);
  assert.match(readFileSync("src/lib/brand.ts", "utf8"), /https:\/\/never86\.ai/);
  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(layout, /openGraph:[\s\S]*SHARE_TITLE[\s\S]*SHARE_DESCRIPTION/);
  assert.match(layout, /twitter:[\s\S]*SHARE_TITLE[\s\S]*SHARE_DESCRIPTION/);
  const seat = readFileSync("src/app/seat/page.tsx", "utf8");
  assert.match(seat, /SHARE_TITLE/);
  assert.match(seat, /SHARE_DESCRIPTION/);
  const card = readFileSync("src/lib/ogCard.tsx", "utf8");
  assert.match(card, /SHARE_TITLE/);
  assert.match(card, /SHARE_LINE/);
  assert.equal(/\$\d/.test(card), false);
  assert.match(readFileSync("src/app/opengraph-image.tsx", "utf8"), /shareCard/);
  assert.match(readFileSync("src/app/seat/opengraph-image.tsx", "utf8"), /shareCard/);
});
