import { hashSecret, newCode, newToken } from "@/lib/seatAuth";
import type { SeatDraft } from "@/lib/draft";
import { emptyDraft } from "@/lib/draft";

export type SignupRow = {
  id: string;
  email: string;
  name: string | null;
  restaurant: string | null;
  source: string;
  checks: string[];
  consentAt: string;
  createdAt: string;
  activatedAt: string | null;
  unsubscribedAt: string | null;
};

type LoginRow = {
  signupId: string;
  tokenHash: string;
  codeHash: string;
  draft: SeatDraft;
  expiresAt: number;
  consumedAt: number | null;
  unsubscribeToken: string;
};

export type IssuedLogin = {
  signup: SignupRow;
  token: string;
  code: string;
  unsubscribeToken: string;
};

const memory = {
  signups: new Map<string, SignupRow>(),
  logins: [] as LoginRow[],
  unsubByHash: new Map<string, string>(),
};

function checksOf(value: string[]): string[] {
  return [...new Set(value.filter((item) => item === "invoices" || item === "labor" || item === "plate"))];
}

export function resetMemorySignups() {
  memory.signups.clear();
  memory.logins.length = 0;
  memory.unsubByHash.clear();
}

export async function saveSignup(input: {
  email: string;
  name: string | null;
  restaurant: string | null;
  source: string;
  checks: string[];
  secret: string;
  draft: SeatDraft;
  now?: number;
}): Promise<IssuedLogin> {
  const now = input.now ?? Date.now();
  const existing = [...memory.signups.values()].find((row) => row.email === input.email);
  const row: SignupRow = {
    id: existing?.id ?? newToken(),
    email: input.email,
    name: input.name ?? existing?.name ?? null,
    restaurant: input.restaurant ?? existing?.restaurant ?? null,
    source: input.source,
    checks: checksOf([...(existing?.checks ?? []), ...input.checks]),
    consentAt: new Date(now).toISOString(),
    createdAt: existing?.createdAt ?? new Date(now).toISOString(),
    activatedAt: existing?.activatedAt ?? null,
    unsubscribedAt: null,
  };
  memory.signups.set(row.email, row);
  const token = newToken();
  const code = newCode();
  const unsub = newToken();
  memory.unsubByHash.set(hashSecret(unsub, input.secret), row.email);
  memory.logins.push({
    signupId: row.id,
    tokenHash: hashSecret(token, input.secret),
    codeHash: hashSecret(code, input.secret),
    draft: input.draft,
    expiresAt: now + 15 * 60 * 1000,
    consumedAt: null,
    unsubscribeToken: unsub,
  });
  return { signup: row, token, code, unsubscribeToken: unsub };
}

function take(match: (row: LoginRow) => boolean, now: number, secret: string): { signup: SignupRow; draft: SeatDraft } | null {
  const row = [...memory.logins].reverse().find((item) => !item.consumedAt && item.expiresAt > now && match(item));
  if (!row) return null;
  row.consumedAt = now;
  const signup = [...memory.signups.values()].find((item) => item.id === row.signupId);
  if (!signup || signup.unsubscribedAt) return null;
  signup.activatedAt = new Date(now).toISOString();
  void secret;
  return { signup, draft: row.draft };
}

export async function consumeToken(token: string, secret: string, now = Date.now()) {
  const hash = hashSecret(token, secret);
  return take((row) => row.tokenHash === hash, now, secret);
}

export async function consumeCode(email: string, code: string, secret: string, now = Date.now()) {
  const signup = memory.signups.get(email);
  if (!signup) return null;
  const hash = hashSecret(code, secret);
  return take((row) => row.signupId === signup.id && row.codeHash === hash, now, secret);
}

export async function markActive(email: string, now = Date.now()) {
  const row = memory.signups.get(email);
  if (!row) return null;
  row.activatedAt = new Date(now).toISOString();
  return row;
}

export async function updateSignup(email: string, patch: { name?: string | null; restaurant?: string | null; checks?: string[] }) {
  const row = memory.signups.get(email);
  if (!row) return null;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.restaurant !== undefined) row.restaurant = patch.restaurant;
  if (patch.checks) row.checks = checksOf([...row.checks, ...patch.checks]);
  return row;
}

export async function unsubscribeByToken(token: string, secret: string, now = Date.now()) {
  const email = memory.unsubByHash.get(hashSecret(token, secret));
  if (!email) return false;
  const row = memory.signups.get(email);
  if (!row) return false;
  row.unsubscribedAt = new Date(now).toISOString();
  return true;
}

export async function listSignups(): Promise<SignupRow[]> {
  return [...memory.signups.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function blankDraft(draft: Partial<SeatDraft> | null | undefined): SeatDraft {
  return {
    earlier: draft?.earlier?.slice(0, 8000) ?? "",
    later: draft?.later?.slice(0, 8000) ?? "",
    recipe: draft?.recipe?.slice(0, 8000) ?? "",
    schedule: draft?.schedule?.slice(0, 8000) ?? "",
    clock: draft?.clock?.slice(0, 8000) ?? "",
  };
}

export function emptyIssuedDraft(): SeatDraft {
  return emptyDraft();
}
