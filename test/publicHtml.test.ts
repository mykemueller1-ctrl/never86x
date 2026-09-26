import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { SiteChrome } from "../src/components/SiteChrome";

const router = {
  back() {},
  forward() {},
  refresh() {},
  push() {},
  replace() {},
  prefetch() {},
};

const BANNED = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
  "AUTH_SECRET",
  "ADMIN_EXPORT_TOKEN",
  "DATABASE_URL",
  "RESEND_API_KEY",
  "STRIPE_SECRET_KEY",
  "SEAT_DEV_SHOW_CODE",
  "SEAT_FROM_EMAIL",
  "ADMIN_EMAILS",
  "OWNER_EMAILS",
  "/portal",
  "signin-with-chatgpt",
  "auth.openai.com",
  "papers-settings",
  "house-code",
  "House-code",
  "set-password",
];

function pageFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) pageFiles(path, out);
    else if (name === "page.tsx" || name === "not-found.tsx") out.push(path);
  }
  return out;
}

async function renderFile(file: string): Promise<string> {
  const mod = await import(join(process.cwd(), file));
  const Page = mod.default as React.ComponentType<Record<string, unknown>>;
  const props = { params: Promise.resolve({}), searchParams: Promise.resolve({}) };
  const asyncPage = (Page as unknown as { constructor: { name: string } }).constructor.name === "AsyncFunction";
  const node = asyncPage
    ? await (Page as unknown as (props: Record<string, unknown>) => Promise<React.ReactNode>)(props)
    : React.createElement(Page, props);
  return renderToStaticMarkup(
    React.createElement(
      AppRouterContext.Provider,
      { value: router },
      React.createElement(
        SearchParamsContext.Provider,
        { value: new URLSearchParams() },
        React.createElement(SiteChrome, null, node as React.ReactElement),
      ),
    ),
  );
}

test("public pages render without env names or internal routes", async () => {
  const files = pageFiles("src/app");
  assert.ok(files.some((file) => file.endsWith("src/app/login/page.tsx")));
  assert.ok(files.some((file) => file.endsWith("src/app/check/invoices/page.tsx")));
  assert.ok(files.some((file) => file.endsWith("src/app/seat/page.tsx")));
  const htmlByFile: { file: string; html: string }[] = [];
  for (const file of files) {
    const html = await renderFile(file);
    htmlByFile.push({ file, html });
    for (const banned of BANNED) {
      assert.equal(html.includes(banned), false, `${file} rendered public HTML contains ${banned}`);
    }
  }
  const home = htmlByFile.find((item) => item.file.endsWith("src/app/page.tsx"))?.html ?? "";
  const invoices = htmlByFile.find((item) => item.file.endsWith("src/app/check/invoices/page.tsx"))?.html ?? "";
  const seat = htmlByFile.find((item) => item.file.endsWith("src/app/seat/page.tsx"))?.html ?? "";
  const login = htmlByFile.find((item) => item.file.endsWith("src/app/login/page.tsx"))?.html ?? "";
  assert.match(home, /Check my invoices/);
  assert.match(home, /href="\/check\/invoices"/);
  assert.match(invoices, /This check works signed out/);
  assert.match(invoices, /Try the example/);
  assert.doesNotMatch(invoices, /Welcome back/);
  assert.match(seat, /Email me this seat|Your free seat is on|Save this seat/);
  assert.match(seat, /Prairie Route/);
  assert.match(seat, /\$60\.00/);
  assert.match(seat, /Verified/);
  assert.match(seat, /Estimated/);
  assert.match(seat, /Missing/);
  assert.doesNotMatch(seat, /Sign in with your ChatGPT/);
  assert.match(login, /Email me a sign-in link/);
  assert.match(login, /href="\/check\/invoices"/);
  assert.doesNotMatch(login, /Welcome back/);
  assert.doesNotMatch(`${home}\n${invoices}\n${seat}\n${login}`, /chatgpt\.com/i);
});
