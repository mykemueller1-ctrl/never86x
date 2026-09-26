import { BRAND, PRODUCT } from "@/lib/brand";

export async function sendSeatMail(input: {
  to: string;
  link: string;
  code: string;
  unsubscribe: string;
}): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false };
  const from = process.env.SEAT_FROM_EMAIL || `${BRAND} <login@never86.ai>`;
  const text = [
    `Your ${PRODUCT} link:`,
    input.link,
    "",
    `Or stay on the page and enter this code: ${input.code}`,
    "The code expires in 15 minutes.",
    "",
    `${BRAND} may email you about your seat.`,
    `Unsubscribe: ${input.unsubscribe}`,
  ].join("\n");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: `Your ${PRODUCT} link`,
      text,
    }),
  });
  return { sent: response.ok };
}
