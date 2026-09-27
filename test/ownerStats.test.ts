import assert from "node:assert/strict";
import test from "node:test";
import { resetAnalyticsMemory, listEvents, ownerDashboard, recordEvent, seedTestStats } from "../src/lib/analytics";
import { userAgentClass } from "../src/lib/embedded";
import { finishLogin, startEmailLogin } from "../src/lib/loginFlow";
import { funnel, inStatsWindow, isOwnerEmail } from "../src/lib/ownerStats";
import { resetMemorySignups } from "../src/lib/signupStore";

process.env.SEAT_STORE = "memory";
process.env.AUTH_SECRET = "test-secret";
process.env.SEAT_DEV_SHOW_CODE = "1";
delete process.env.DATABASE_URL;
delete process.env.OWNER_EMAILS;

const VISITOR = "visitor-test-aaaaaaaa";

test("Central Time today excludes the previous evening", () => {
  const now = Date.parse("2026-09-26T15:00:00Z");
  assert.equal(inStatsWindow(new Date(now).toISOString(), "today", now), true);
  assert.equal(inStatsWindow("2026-09-26T04:30:00.000Z", "today", now), false);
  assert.equal(inStatsWindow("2026-09-20T15:00:00.000Z", "week", now), true);
  assert.equal(inStatsWindow("2026-09-10T15:00:00.000Z", "week", now), false);
});

test("the owner allowlist defaults to Myke and can be replaced", () => {
  assert.equal(isOwnerEmail("MykeMueller1@gmail.com", ""), true);
  assert.equal(isOwnerEmail("other@example.com", ""), false);
  assert.equal(isOwnerEmail("other@example.com", "other@example.com, second@example.com"), true);
  assert.equal(isOwnerEmail("mykemueller1@gmail.com", "other@example.com"), false);
});

test("a link open is tied to the email after sign-in", async () => {
  resetMemorySignups();
  resetAnalyticsMemory();
  const now = Date.parse("2026-09-26T18:00:00Z");
  await recordEvent({
    name: "link_open",
    visitorId: VISITOR,
    source: "x",
    uaClass: "x_in_app",
    now,
  });
  await recordEvent({
    name: "login_success",
    visitorId: VISITOR,
    email: "Owner@Cafe.test",
    source: "x",
    uaClass: "x_in_app",
    now: now + 1000,
  });
  const events = await listEvents();
  assert.equal(events.find((event) => event.name === "link_open")?.email, "owner@cafe.test");
  assert.equal(userAgentClass("Mozilla Twitter iPhone"), "x_in_app");
});

test("login attempts are counted once per email and network", async () => {
  resetAnalyticsMemory();
  const now = Date.parse("2026-09-26T18:00:00Z");
  const first = await recordEvent({
    name: "login_attempt",
    visitorId: VISITOR,
    email: "a@b.co",
    uaClass: "desktop",
    ip: "203.0.113.8",
    now,
  });
  const again = await recordEvent({
    name: "login_attempt",
    visitorId: "visitor-other-bbbbbbbb",
    email: "a@b.co",
    uaClass: "desktop",
    ip: "203.0.113.8",
    now: now + 1000,
  });
  const otherNetwork = await recordEvent({
    name: "login_attempt",
    visitorId: VISITOR,
    email: "a@b.co",
    uaClass: "mobile",
    ip: "203.0.113.9",
    now: now + 2000,
  });
  assert.equal(first.recorded, true);
  assert.equal(again.recorded, false);
  assert.equal(otherNetwork.recorded, true);
});

test("the free seat is claimed once, on the first successful sign-in", async () => {
  resetMemorySignups();
  resetAnalyticsMemory();
  const started = await startEmailLogin(
    { email: "new-seat@example.com", consent: true, origin: "https://never86.ai" },
    async () => ({ sent: true }),
  );
  assert.equal(started.ok, true);
  if (!started.ok) return;
  assert.equal(started.fresh, true);
  const finished = await finishLogin({ email: "new-seat@example.com", code: started.devCode });
  assert.equal(finished.ok, true);
  if (!finished.ok) return;
  assert.equal(finished.firstSeat, true);
  const again = await startEmailLogin(
    { email: "new-seat@example.com", consent: true, origin: "https://never86.ai" },
    async () => ({ sent: true }),
  );
  assert.equal(again.ok, true);
  if (!again.ok) return;
  const second = await finishLogin({ email: "new-seat@example.com", code: again.devCode });
  assert.equal(second.ok, true);
  if (!second.ok) return;
  assert.equal(second.firstSeat, false);
});

test("seeded test counts fill today, the week, and all time", async () => {
  resetMemorySignups();
  resetAnalyticsMemory();
  const now = Date.parse("2026-09-26T18:00:00Z");
  await seedTestStats(now);
  const board = await ownerDashboard(now);
  assert.equal(board.counts.today.link_open, 2);
  assert.equal(board.counts.today.check_start, 2);
  assert.equal(board.counts.today.check_complete, 1);
  assert.equal(board.counts.today.login_attempt, 1);
  assert.equal(board.counts.today.login_success, 1);
  assert.equal(board.counts.today.seat_claimed, 1);
  assert.equal(board.counts.week.link_open, 3);
  assert.equal(board.counts.week.login_attempt, 2);
  assert.equal(board.counts.all.link_open, 4);
  assert.equal(board.counts.all.check_start, 3);
  const today = funnel(board.counts.today);
  assert.equal(today[1].percent, 100);
  assert.equal(today[2].percent, 50);
  assert.equal(today[0].percent, null);
  const empty = funnel({
    link_open: 0,
    check_start: 0,
    check_complete: 0,
    login_attempt: 0,
    login_success: 0,
    seat_claimed: 0,
  });
  assert.equal(empty[1].percent, null);
  assert.equal(board.signups.every((row) => row.test), true);
  assert.equal(board.testRows > 0, true);
  const avery = board.signups.find((row) => row.email === "test-avery@example.com");
  assert.equal(avery?.restaurant, "Test Kitchen");
  assert.ok(avery?.checks.includes("invoices"));
});
