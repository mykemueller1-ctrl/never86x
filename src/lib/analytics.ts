import { createHmac, randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import type { NextRequest, NextResponse } from "next/server";
import { ensureSignupTables, neonSaveSignup } from "@/lib/neonSignups";
import {
  countEvents,
  funnel,
  isOwnerEmail,
  type CountSet,
  type EventName,
  type FunnelStep,
  type StatsWindow,
} from "@/lib/ownerStats";
import { newToken, normalizeEmail } from "@/lib/seatAuth";
import { blankDraft, saveSignup, type SignupRow } from "@/lib/signupStore";
import { allSignups } from "@/lib/signups";

export const VISITOR_COOKIE = "n86_vid";

export type UaClass = "x_in_app" | "mobile" | "desktop";

export type SeatEvent = {
  id: string;
  name: EventName;
  visitorId: string;
  email: string | null;
  source: string;
  uaClass: UaClass;
  detail: string | null;
  test: boolean;
  ipHash: string | null;
  createdAt: string;
};

export type SignupStat = {
  email: string;
  name: string | null;
  restaurant: string | null;
  source: string;
  firstSeen: string;
  checks: string[];
  lastActive: string;
  test: boolean;
};

const memoryEvents: SeatEvent[] = [];

const DEDUPE_MS: Record<EventName, number> = {
  link_open: 30 * 60 * 1000,
  check_start: 30 * 60 * 1000,
  check_complete: 30 * 60 * 1000,
  login_attempt: 15 * 60 * 1000,
  login_success: 15 * 60 * 1000,
  seat_claimed: Number.POSITIVE_INFINITY,
};

function memoryStore() {
  return process.env.SEAT_STORE === "memory" || !process.env.DATABASE_URL;
}

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  return neon(url);
}

function ipHash(ip: string): string {
  const secret = process.env.AUTH_SECRET || "seat-local";
  return createHmac("sha256", secret).update(ip).digest("hex").slice(0, 32);
}

export function resetAnalyticsMemory() {
  memoryEvents.length = 0;
}

export function readOrCreateVisitor(req: NextRequest): { id: string; fresh: boolean } {
  const existing = req.cookies.get(VISITOR_COOKIE)?.value || "";
  if (/^[A-Za-z0-9_-]{16,80}$/.test(existing)) return { id: existing, fresh: false };
  return { id: randomBytes(18).toString("base64url"), fresh: true };
}

export function setVisitorCookie(res: NextResponse, id: string) {
  res.cookies.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 400 * 24 * 60 * 60,
  });
}

function eventFrom(record: Record<string, unknown>): SeatEvent {
  return {
    id: String(record.id),
    name: String(record.name) as EventName,
    visitorId: String(record.visitor_id),
    email: record.email ? String(record.email) : null,
    source: String(record.source),
    uaClass: String(record.ua_class) as UaClass,
    detail: record.detail ? String(record.detail) : null,
    test: record.test === true || record.test === "t" || record.test === "true",
    ipHash: record.ip_hash ? String(record.ip_hash) : null,
    createdAt: new Date(String(record.created_at)).toISOString(),
  };
}

async function listStored(): Promise<SeatEvent[]> {
  if (memoryStore()) return memoryEvents.map((event) => ({ ...event }));
  await ensureSignupTables();
  const rows = await db()`SELECT * FROM seat_events ORDER BY created_at ASC`;
  return rows.map((row) => eventFrom(row as Record<string, unknown>));
}

function isDuplicate(existing: SeatEvent[], next: SeatEvent, now: number): boolean {
  const window = DEDUPE_MS[next.name];
  return existing.some((event) => {
    if (event.name !== next.name) return false;
    const age = now - new Date(event.createdAt).getTime();
    if (age > window) return false;
    if (next.name === "login_attempt") return event.email === next.email && event.ipHash === next.ipHash;
    if (next.name === "login_success" || next.name === "seat_claimed") return event.email === next.email;
    if (next.name === "check_start" || next.name === "check_complete") {
      return event.visitorId === next.visitorId && event.detail === next.detail;
    }
    return event.visitorId === next.visitorId;
  });
}

async function attachEmail(visitorId: string, email: string) {
  if (memoryStore()) {
    for (const event of memoryEvents) {
      if (event.visitorId === visitorId && !event.email) event.email = email;
    }
    return;
  }
  await ensureSignupTables();
  await db()`
    UPDATE seat_events
    SET email = ${email}
    WHERE visitor_id = ${visitorId} AND email IS NULL`;
}

export async function recordEvent(input: {
  name: EventName;
  visitorId: string;
  email?: string | null;
  source?: string | null;
  uaClass: UaClass;
  detail?: string | null;
  test?: boolean;
  ip?: string | null;
  now?: number;
}): Promise<{ recorded: boolean }> {
  const now = input.now ?? Date.now();
  const email = input.email ? normalizeEmail(input.email) : null;
  const next: SeatEvent = {
    id: newToken(),
    name: input.name,
    visitorId: input.visitorId,
    email,
    source: (input.source || "x").trim().slice(0, 80) || "x",
    uaClass: input.uaClass,
    detail: input.detail ? input.detail.slice(0, 40) : null,
    test: input.test === true,
    ipHash: input.ip ? ipHash(input.ip) : null,
    createdAt: new Date(now).toISOString(),
  };
  const existing = await listStored();
  if (isDuplicate(existing, next, now)) {
    if (email) await attachEmail(next.visitorId, email);
    return { recorded: false };
  }
  if (memoryStore()) memoryEvents.push(next);
  else {
    await ensureSignupTables();
    await db()`
      INSERT INTO seat_events (id, name, visitor_id, email, source, ua_class, detail, test, ip_hash, created_at)
      VALUES (
        ${next.id},
        ${next.name},
        ${next.visitorId},
        ${next.email},
        ${next.source},
        ${next.uaClass},
        ${next.detail},
        ${next.test},
        ${next.ipHash},
        ${next.createdAt}
      )`;
  }
  if (email) await attachEmail(next.visitorId, email);
  return { recorded: true };
}

export async function listEvents(): Promise<SeatEvent[]> {
  return listStored();
}

export async function ownerDashboard(now = Date.now()): Promise<{
  counts: Record<StatsWindow, CountSet>;
  funnels: Record<StatsWindow, FunnelStep[]>;
  signups: SignupStat[];
  testRows: number;
}> {
  const events = await listStored();
  const signups = await allSignups();
  const windows: StatsWindow[] = ["today", "week", "all"];
  const counts = {
    today: countEvents(events, "today", now),
    week: countEvents(events, "week", now),
    all: countEvents(events, "all", now),
  };
  const funnels = {
    today: funnel(counts.today),
    week: funnel(counts.week),
    all: funnel(counts.all),
  };
  void windows;
  const rows = signups.map((signup) => signupStat(signup, events));
  rows.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
  return { counts, funnels, signups: rows, testRows: events.filter((event) => event.test).length };
}

function signupStat(signup: SignupRow, events: SeatEvent[]): SignupStat {
  const mine = events.filter((event) => event.email === signup.email);
  const times = [signup.createdAt, ...mine.map((event) => event.createdAt)];
  const active = [signup.activatedAt, signup.createdAt, ...mine.map((event) => event.createdAt)].filter(
    (value): value is string => Boolean(value),
  );
  const firstSeen = times.reduce((earliest, value) => (new Date(value) < new Date(earliest) ? value : earliest));
  const lastActive = active.reduce((latest, value) => (new Date(value) > new Date(latest) ? value : latest));
  return {
    email: signup.email,
    name: signup.name,
    restaurant: signup.restaurant,
    source: signup.source,
    firstSeen,
    checks: signup.checks,
    lastActive,
    test: signup.source === "test" || mine.some((event) => event.test),
  };
}

export async function seedTestStats(now = Date.now()): Promise<void> {
  const secret = process.env.AUTH_SECRET || "seat-local";
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;
  const people = [
    {
      email: "test-avery@example.com",
      name: "Test Avery",
      restaurant: "Test Kitchen",
      visitorId: "testvisitoravery0001",
      at: now - 20 * 60 * 1000,
      steps: ["link_open", "check_start", "check_complete", "login_attempt", "login_success", "seat_claimed"] as EventName[],
      detail: "sample",
    },
    {
      email: "test-jordan@example.com",
      name: "Test Jordan",
      restaurant: "Test Counter",
      visitorId: "testvisitorjordan001",
      at: now - 2 * hour,
      steps: ["link_open", "check_start"] as EventName[],
      detail: "own",
    },
    {
      email: "test-sam@example.com",
      name: "Test Sam",
      restaurant: "Test Window",
      visitorId: "testvisitorsam000001",
      at: now - 3 * day,
      steps: ["link_open", "check_start", "check_complete", "login_attempt"] as EventName[],
      detail: "sample",
    },
    {
      email: "test-old@example.com",
      name: "Test Older",
      restaurant: "Test Store",
      visitorId: "testvisitorolder0001",
      at: now - 10 * day,
      steps: ["link_open"] as EventName[],
      detail: null,
    },
  ];
  for (const person of people) {
    const save = memoryStore() ? saveSignup : neonSaveSignup;
    await save({
      email: person.email,
      name: person.name,
      restaurant: person.restaurant,
      source: "test",
      checks: person.detail === "own" ? ["invoices"] : person.steps.includes("check_complete") ? ["invoices"] : [],
      secret,
      draft: blankDraft(null),
      now: person.at,
    });
    for (const [index, name] of person.steps.entries()) {
      await recordEvent({
        name,
        visitorId: person.visitorId,
        email: name === "link_open" || name === "check_start" || name === "check_complete" ? person.email : person.email,
        source: "test",
        uaClass: index % 2 === 0 ? "x_in_app" : "mobile",
        detail: name === "check_start" || name === "check_complete" ? person.detail : "test",
        test: true,
        ip: `test-${person.email}`,
        now: person.at + index * 1000,
      });
    }
  }
}

export function ownerGate(email: string | null): { ok: true } | { ok: false; status: number; reason: string } {
  if (!email) return { ok: false, status: 401, reason: "Sign in to read the owner numbers." };
  if (!isOwnerEmail(email)) return { ok: false, status: 403, reason: "This page is only for the owner." };
  return { ok: true };
}
