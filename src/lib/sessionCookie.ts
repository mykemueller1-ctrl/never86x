export const SESSION_COOKIE = "seat_session";

export function sessionCookie() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 24 * 60 * 60,
  };
}
