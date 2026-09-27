import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ALLOWED_EXTERNAL = new Set([
  "https://app.never86.app/media/never86-landscape-v24.mp4",
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(tsx|ts|jsx|js|mjs)$/.test(name)) out.push(path);
  }
  return out;
}

function routesFromApp(dir, prefix = "") {
  const routes = new Set();
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (name.startsWith("_")) continue;
    if (statSync(path).isDirectory()) {
      if (name === "api") {
        for (const route of routesFromApp(path, `${prefix}/api`)) routes.add(route);
        continue;
      }
      const segment = name.startsWith("(") ? "" : `/${name}`;
      for (const route of routesFromApp(path, `${prefix}${segment}`)) routes.add(route);
    } else if (name === "page.tsx" || name === "route.ts") {
      routes.add(prefix || "/");
    }
  }
  return routes;
}

test("every static link lands on a page", () => {
  const routes = routesFromApp("src/app");
  const files = walk("src");
  const hrefs = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    assert.equal(text.includes("auth.openai.com"), false, file);
    assert.equal(text.includes("signin-with-chatgpt"), false, file);
    for (const match of text.matchAll(/(?:href|action)\s*=\s*["']([^"']+)["']/g)) {
      hrefs.push({ file, href: match[1] });
    }
    for (const match of text.matchAll(/href:\s*["']([^"']+)["']/g)) {
      hrefs.push({ file, href: match[1] });
    }
  }

  assert.ok(hrefs.length > 10);
  for (const { file, href } of hrefs) {
    if (href.startsWith("#")) continue;
    if (href.startsWith("mailto:")) {
      assert.match(href, /^mailto:[^@\s]+@[^@\s]+$/, `${file} ${href}`);
      continue;
    }
    if (ALLOWED_EXTERNAL.has(href)) continue;
    assert.equal(href.startsWith("/"), true, `${file} has off-site href ${href}`);
    const path = href.split("#")[0].split("?")[0] || "/";
    assert.equal(routes.has(path), true, `${file} links to missing route ${href}`);
  }
});
