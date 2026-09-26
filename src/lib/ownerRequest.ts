import type { NextRequest } from "next/server";
import { ownerGate } from "@/lib/analytics";
import { authSecret } from "@/lib/loginFlow";
import { readSession } from "@/lib/seatAuth";
import { SESSION_COOKIE } from "@/lib/sessionCookie";

export function ownerFrom(req: NextRequest) {
  const secret = authSecret();
  const token = req.cookies.get(SESSION_COOKIE)?.value || "";
  const email = secret && token ? readSession(token, secret) : null;
  return { email, gate: ownerGate(email) };
}
