import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function validEmail(email: string): boolean {
  return email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function signupSource(utm: string | null | undefined, ref: string | null | undefined): string {
  const raw = (utm || ref || "x").trim().slice(0, 80);
  return raw || "x";
}

export function hashSecret(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export function newCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function signSession(email: string, secret: string, now = Date.now()): string {
  const body = Buffer.from(JSON.stringify({ email, exp: now + 1000 * 60 * 60 * 24 * 60 })).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readSession(token: string, secret: string, now = Date.now()): string | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString()) as { email?: unknown; exp?: unknown };
    if (typeof parsed.email !== "string" || typeof parsed.exp !== "number" || parsed.exp < now) return null;
    return parsed.email;
  } catch {
    return null;
  }
}

export function adminAllowed(emailHeader: string, bearer: string, emails: string, exportToken: string): boolean {
  const list = emails.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (emailHeader && list.includes(emailHeader.trim().toLowerCase())) return true;
  if (!exportToken || !bearer) return false;
  const left = Buffer.from(bearer);
  const right = Buffer.from(exportToken);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function csvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}
