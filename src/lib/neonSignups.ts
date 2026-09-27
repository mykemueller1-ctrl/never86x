import { neon } from "@neondatabase/serverless";
import type { SeatDraft } from "@/lib/draft";
import { hashSecret, newCode, newToken } from "@/lib/seatAuth";
import { blankDraft, type IssuedLogin, type SignupRow } from "@/lib/signupStore";

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  return neon(url);
}

let ready: Promise<void> | null = null;

export function ensureSignupTables() {
  ready ??= (async () => {
    const sql = db();
    await sql`
      CREATE TABLE IF NOT EXISTS seat_signups (
        id text PRIMARY KEY,
        email text NOT NULL UNIQUE,
        name text,
        restaurant_name text,
        source text NOT NULL,
        checks_used text NOT NULL DEFAULT '',
        consent_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL,
        activated_at timestamptz,
        unsubscribed_at timestamptz
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS seat_login_codes (
        id text PRIMARY KEY,
        email text NOT NULL,
        token_hash text NOT NULL UNIQUE,
        code_hash text NOT NULL,
        unsub_hash text NOT NULL,
        draft text,
        expires_at timestamptz NOT NULL,
        consumed_at timestamptz
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS seat_events (
        id text PRIMARY KEY,
        name text NOT NULL,
        visitor_id text NOT NULL,
        email text,
        source text NOT NULL,
        ua_class text NOT NULL,
        detail text,
        test boolean NOT NULL DEFAULT false,
        ip_hash text,
        created_at timestamptz NOT NULL
      )`;
  })();
  return ready;
}

function rowFrom(record: Record<string, unknown>): SignupRow {
  const checks = String(record.checks_used || "")
    .split("|")
    .filter((item) => item === "invoices" || item === "labor" || item === "plate");
  return {
    id: String(record.id),
    email: String(record.email),
    name: record.name ? String(record.name) : null,
    restaurant: record.restaurant_name ? String(record.restaurant_name) : null,
    source: String(record.source),
    checks,
    consentAt: new Date(String(record.consent_at)).toISOString(),
    createdAt: new Date(String(record.created_at)).toISOString(),
    activatedAt: record.activated_at ? new Date(String(record.activated_at)).toISOString() : null,
    unsubscribedAt: record.unsubscribed_at ? new Date(String(record.unsubscribed_at)).toISOString() : null,
  };
}

export async function neonSaveSignup(input: {
  email: string;
  name: string | null;
  restaurant: string | null;
  source: string;
  checks: string[];
  secret: string;
  draft: SeatDraft;
  now?: number;
}): Promise<IssuedLogin> {
  await ensureSignupTables();
  const sql = db();
  const now = new Date(input.now ?? Date.now());
  const existing = await sql`SELECT * FROM seat_signups WHERE email = ${input.email} LIMIT 1`;
  const prior = existing[0] ? rowFrom(existing[0] as Record<string, unknown>) : null;
  const checks = [...new Set([...(prior?.checks ?? []), ...input.checks])].join("|");
  const id = prior?.id ?? newToken();
  const created = prior?.createdAt ?? now.toISOString();
  await sql`
    INSERT INTO seat_signups (id, email, name, restaurant_name, source, checks_used, consent_at, created_at, activated_at, unsubscribed_at)
    VALUES (
      ${id},
      ${input.email},
      ${input.name},
      ${input.restaurant},
      ${input.source},
      ${checks},
      ${now.toISOString()},
      ${created},
      ${prior?.activatedAt},
      NULL
    )
    ON CONFLICT (email) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, seat_signups.name),
      restaurant_name = COALESCE(EXCLUDED.restaurant_name, seat_signups.restaurant_name),
      source = EXCLUDED.source,
      checks_used = EXCLUDED.checks_used,
      consent_at = EXCLUDED.consent_at,
      unsubscribed_at = NULL`;
  const token = newToken();
  const code = newCode();
  const unsub = newToken();
  const expires = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
  await sql`
    INSERT INTO seat_login_codes (id, email, token_hash, code_hash, unsub_hash, draft, expires_at)
    VALUES (
      ${newToken()},
      ${input.email},
      ${hashSecret(token, input.secret)},
      ${hashSecret(code, input.secret)},
      ${hashSecret(unsub, input.secret)},
      ${JSON.stringify(input.draft)},
      ${expires}
    )`;
  const saved = await sql`SELECT * FROM seat_signups WHERE email = ${input.email} LIMIT 1`;
  return {
    signup: rowFrom(saved[0] as Record<string, unknown>),
    token,
    code,
    unsubscribeToken: unsub,
    fresh: !prior,
  };
}

async function consume(where: "token" | "code", email: string | null, hash: string, secret: string, now = Date.now()) {
  await ensureSignupTables();
  const sql = db();
  const stamp = new Date(now).toISOString();
  const found = where === "token"
    ? await sql`
        SELECT * FROM seat_login_codes
        WHERE token_hash = ${hash} AND consumed_at IS NULL AND expires_at > ${stamp}
        LIMIT 1`
    : await sql`
        SELECT * FROM seat_login_codes
        WHERE email = ${email} AND code_hash = ${hash} AND consumed_at IS NULL AND expires_at > ${stamp}
        ORDER BY expires_at DESC
        LIMIT 1`;
  const login = found[0] as Record<string, unknown> | undefined;
  if (!login) return null;
  await sql`UPDATE seat_login_codes SET consumed_at = ${stamp} WHERE id = ${String(login.id)} AND consumed_at IS NULL`;
  const signupRows = await sql`SELECT * FROM seat_signups WHERE email = ${String(login.email)} LIMIT 1`;
  const signup = signupRows[0] ? rowFrom(signupRows[0] as Record<string, unknown>) : null;
  if (!signup || signup.unsubscribedAt) return null;
  const firstSeat = !signup.activatedAt;
  await sql`UPDATE seat_signups SET activated_at = ${stamp} WHERE email = ${signup.email}`;
  signup.activatedAt = stamp;
  let draft = blankDraft(null);
  try {
    draft = blankDraft(JSON.parse(String(login.draft || "{}")) as SeatDraft);
  } catch {
    draft = blankDraft(null);
  }
  void secret;
  return { signup, draft, firstSeat };
}

export async function neonConsumeToken(token: string, secret: string, now = Date.now()) {
  return consume("token", null, hashSecret(token, secret), secret, now);
}

export async function neonConsumeCode(email: string, code: string, secret: string, now = Date.now()) {
  return consume("code", email, hashSecret(code, secret), secret, now);
}

export async function neonMarkActive(email: string, now = Date.now()) {
  await ensureSignupTables();
  const sql = db();
  const stamp = new Date(now).toISOString();
  const rows = await sql`
    UPDATE seat_signups SET activated_at = ${stamp}
    WHERE email = ${email}
    RETURNING *`;
  return rows[0] ? rowFrom(rows[0] as Record<string, unknown>) : null;
}

export async function neonUpdateSignup(email: string, patch: { name?: string | null; restaurant?: string | null; checks?: string[] }) {
  await ensureSignupTables();
  const sql = db();
  const current = await sql`SELECT * FROM seat_signups WHERE email = ${email} LIMIT 1`;
  if (!current[0]) return null;
  const row = rowFrom(current[0] as Record<string, unknown>);
  const name = patch.name !== undefined ? patch.name : row.name;
  const restaurant = patch.restaurant !== undefined ? patch.restaurant : row.restaurant;
  const checks = [...new Set([...row.checks, ...(patch.checks ?? [])])].join("|");
  await sql`
    UPDATE seat_signups
    SET name = ${name}, restaurant_name = ${restaurant}, checks_used = ${checks}
    WHERE email = ${email}`;
  row.name = name;
  row.restaurant = restaurant;
  row.checks = checks ? checks.split("|") : [];
  return row;
}

export async function neonUnsubscribe(token: string, secret: string, now = Date.now()) {
  await ensureSignupTables();
  const sql = db();
  const hash = hashSecret(token, secret);
  const found = await sql`SELECT email FROM seat_login_codes WHERE unsub_hash = ${hash} LIMIT 1`;
  if (!found[0]) return false;
  await sql`UPDATE seat_signups SET unsubscribed_at = ${new Date(now).toISOString()} WHERE email = ${String(found[0].email)}`;
  return true;
}

export async function neonListSignups(): Promise<SignupRow[]> {
  await ensureSignupTables();
  const sql = db();
  const rows = await sql`SELECT * FROM seat_signups ORDER BY created_at ASC`;
  return rows.map((row) => rowFrom(row as Record<string, unknown>));
}
