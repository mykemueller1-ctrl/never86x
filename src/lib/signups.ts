import type { SeatDraft } from "@/lib/draft";
import {
  neonConsumeCode,
  neonConsumeToken,
  neonListSignups,
  neonMarkActive,
  neonSaveSignup,
  neonUnsubscribe,
  neonUpdateSignup,
} from "@/lib/neonSignups";
import {
  consumeCode,
  consumeToken,
  listSignups,
  markActive,
  saveSignup,
  unsubscribeByToken,
  updateSignup,
  type IssuedLogin,
  type SignupRow,
} from "@/lib/signupStore";

function memoryStore() {
  return process.env.SEAT_STORE === "memory" || !process.env.DATABASE_URL;
}

export type { IssuedLogin, SignupRow };

export function persistSignup(input: {
  email: string;
  name: string | null;
  restaurant: string | null;
  source: string;
  checks: string[];
  secret: string;
  draft: SeatDraft;
  now?: number;
}) {
  return memoryStore() ? saveSignup(input) : neonSaveSignup(input);
}

export function openToken(token: string, secret: string, now?: number) {
  return memoryStore() ? consumeToken(token, secret, now) : neonConsumeToken(token, secret, now);
}

export function openCode(email: string, code: string, secret: string, now?: number) {
  return memoryStore() ? consumeCode(email, code, secret, now) : neonConsumeCode(email, code, secret, now);
}

export function activateSignup(email: string, now?: number) {
  return memoryStore() ? markActive(email, now) : neonMarkActive(email, now);
}

export function saveProfile(email: string, patch: { name?: string | null; restaurant?: string | null; checks?: string[] }) {
  return memoryStore() ? updateSignup(email, patch) : neonUpdateSignup(email, patch);
}

export function optOut(token: string, secret: string, now?: number) {
  return memoryStore() ? unsubscribeByToken(token, secret, now) : neonUnsubscribe(token, secret, now);
}

export function allSignups() {
  return memoryStore() ? listSignups() : neonListSignups();
}
