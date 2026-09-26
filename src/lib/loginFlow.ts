import type { SeatDraft } from "@/lib/draft";
import { blankDraft } from "@/lib/signupStore";
import { normalizeEmail, signupSource, validEmail } from "@/lib/seatAuth";
import { sendSeatMail } from "@/lib/seatMail";
import { openCode, openToken, persistSignup, type SignupRow } from "@/lib/signups";

export function authSecret(): string | null {
  const secret = process.env.AUTH_SECRET?.trim();
  return secret || null;
}

export async function startEmailLogin(input: {
  email: string;
  consent: boolean;
  name?: string | null;
  restaurant?: string | null;
  utm?: string | null;
  ref?: string | null;
  checks?: string[];
  draft?: Partial<SeatDraft> | null;
  origin: string;
  now?: number;
}, send: (mail: { to: string; link: string; code: string; unsubscribe: string }) => Promise<{ sent: boolean }> = sendSeatMail): Promise<
  | { ok: true; sent: boolean; email: string; devCode?: string }
  | { ok: false; reason: string }
> {
  const secret = authSecret();
  if (!secret) return { ok: false, reason: "Sign-in is not configured on this preview." };
  if (!input.consent) return { ok: false, reason: "Consent is required before we email you." };
  const email = normalizeEmail(input.email);
  if (!validEmail(email)) return { ok: false, reason: "Enter a real email address." };
  const issued = await persistSignup({
    email,
    name: input.name?.trim() || null,
    restaurant: input.restaurant?.trim() || null,
    source: signupSource(input.utm, input.ref),
    checks: input.checks ?? [],
    secret,
    draft: blankDraft(input.draft),
    now: input.now,
  });
  const link = new URL(`/seat?login=${issued.token}`, input.origin).toString();
  const unsubscribe = new URL(`/unsubscribe?token=${issued.unsubscribeToken}`, input.origin).toString();
  const mailed = await send({ to: email, link, code: issued.code, unsubscribe });
  return {
    ok: true,
    sent: mailed.sent,
    email,
    ...(process.env.SEAT_DEV_SHOW_CODE === "1" ? { devCode: issued.code } : {}),
  };
}

export async function finishLogin(input: { token?: string; email?: string; code?: string; now?: number }): Promise<
  | { ok: true; signup: SignupRow; draft: SeatDraft }
  | { ok: false; reason: string }
> {
  const secret = authSecret();
  if (!secret) return { ok: false, reason: "Sign-in is not configured on this preview." };
  if (input.token) {
    const opened = await openToken(input.token, secret, input.now);
    if (!opened) return { ok: false, reason: "That link is used or expired. Ask for a new one." };
    return { ok: true, signup: opened.signup, draft: opened.draft };
  }
  const email = normalizeEmail(input.email || "");
  const code = (input.code || "").trim();
  if (!validEmail(email) || !/^\d{6}$/.test(code)) {
    return { ok: false, reason: "Enter the email and the 6-digit code." };
  }
  const opened = await openCode(email, code, secret, input.now);
  if (!opened) return { ok: false, reason: "That code is used or expired. Ask for a new one." };
  return { ok: true, signup: opened.signup, draft: opened.draft };
}
