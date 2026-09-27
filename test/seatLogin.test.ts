import assert from "node:assert/strict";
import test from "node:test";
import { resetMemorySignups } from "../src/lib/signupStore";
import { adminAllowed, csvCell, readSession, signSession, signupSource } from "../src/lib/seatAuth";
import { isEmbeddedWebview, showGoogleSignIn } from "../src/lib/embedded";
import { nextMove } from "../src/lib/nextMove";
import { finishLogin, startEmailLogin } from "../src/lib/loginFlow";

process.env.SEAT_STORE = "memory";
process.env.AUTH_SECRET = "test-secret";
process.env.SEAT_DEV_SHOW_CODE = "1";
delete process.env.DATABASE_URL;

test("email login keeps the draft and records the x source", async () => {
  resetMemorySignups();
  const started = await startEmailLogin(
    {
      email: "Owner@Cafe.test",
      consent: true,
      utm: null,
      ref: null,
      checks: ["invoices"],
      draft: { earlier: "Mozzarella $48.00", later: "Mozzarella $56.00" },
      origin: "https://never86.ai",
    },
    async () => ({ sent: true }),
  );
  assert.equal(started.ok, true);
  if (!started.ok) return;
  assert.equal(started.sent, true);
  assert.equal(started.devCode?.length, 6);
  const finished = await finishLogin({ email: "owner@cafe.test", code: started.devCode });
  assert.equal(finished.ok, true);
  if (!finished.ok) return;
  assert.equal(finished.signup.source, "x");
  assert.equal(finished.signup.checks.includes("invoices"), true);
  assert.equal(finished.draft.earlier, "Mozzarella $48.00");
  assert.equal(finished.signup.restaurant, null);
});

test("login refuses a missing consent line and a bad email", async () => {
  resetMemorySignups();
  const refused = await startEmailLogin(
    { email: "owner@cafe.test", consent: false, origin: "https://never86.ai" },
    async () => ({ sent: true }),
  );
  assert.equal(refused.ok, false);
  const bad = await startEmailLogin(
    { email: "not-an-email", consent: true, origin: "https://never86.ai" },
    async () => ({ sent: true }),
  );
  assert.equal(bad.ok, false);
});

test("unsubscribe stops a later code, and a new consent can start again", async () => {
  resetMemorySignups();
  const started = await startEmailLogin(
    { email: "owner@cafe.test", consent: true, origin: "http://127.0.0.1:3000" },
    async (mail) => {
      const token = new URL(mail.unsubscribe).searchParams.get("token") || "";
      const { optOut } = await import("../src/lib/signups");
      await optOut(token, "test-secret");
      return { sent: true };
    },
  );
  assert.equal(started.ok, true);
  if (!started.ok || !started.devCode) return;
  const blocked = await finishLogin({ email: "owner@cafe.test", code: started.devCode });
  assert.equal(blocked.ok, false);
  const again = await startEmailLogin(
    { email: "owner@cafe.test", consent: true, origin: "http://127.0.0.1:3000" },
    async () => ({ sent: true }),
  );
  assert.equal(again.ok, true);
  if (!again.ok || !again.devCode) return;
  const finished = await finishLogin({ email: "owner@cafe.test", code: again.devCode });
  assert.equal(finished.ok, true);
});

test("google stays off inside X, and the next move does not invent a price", () => {
  assert.equal(isEmbeddedWebview("Mozilla/5.0 Twitter"), true);
  assert.equal(showGoogleSignIn("Mozilla/5.0 Twitter", "client"), false);
  assert.equal(showGoogleSignIn("Mozilla/5.0 Safari", "client"), true);
  assert.equal(showGoogleSignIn("Mozilla/5.0 Safari", ""), false);
  const move = nextMove("invoices", [{ label: "Change", value: "Not on the paper", honesty: "Missing" }]);
  assert.equal(move.includes("$"), false);
  assert.equal(signupSource(null, null), "x");
  assert.equal(signupSource("newsletter", null), "newsletter");
});

test("admin export stays locked without the token", () => {
  assert.equal(adminAllowed("", "", "myke@example.com", "secret"), false);
  assert.equal(adminAllowed("myke@example.com", "", "myke@example.com", ""), true);
  assert.equal(adminAllowed("", "secret", "", "secret"), true);
  assert.equal(csvCell('say "hi", now'), '"say ""hi"", now"');
  const session = signSession("owner@cafe.test", "test-secret", 1_000);
  assert.equal(readSession(session, "test-secret", 1_000), "owner@cafe.test");
  assert.equal(readSession(session, "test-secret", 1_000 + 1000 * 60 * 60 * 24 * 61), null);
});
