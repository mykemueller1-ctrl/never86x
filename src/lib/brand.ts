import type { Metadata } from "next";

/** Word-for-word from the never86.ai brand sheet, Sat Sep 26, 2026. */
export const BRAND = "Never86'd";
export const PRODUCT = "One Seat";
export const METHOD = "Action Shift";
export const WHO = "independent restaurants with 1–5 units, run by owners wearing every hat";
export const FOUNDER = "Built by Myke Mueller, Community Tap & Pizza, Fort Dodge, Iowa.";
export const SITE = "https://never86.ai";

export const HEADLINE = "You run the restaurant. Let's check the numbers.";
export const TAGLINE = "No CFO. No back office. Still your numbers.";
/** X / Open Graph card. Same strings on twitter:* and og:*. */
export const SHARE_TITLE = "You run the restaurant. Let's watch the costs.";
export const SHARE_LINE = "Your first owner seat is free. No card. No POS.";
export const SHARE_DESCRIPTION = `${SHARE_LINE} For independent restaurants with 1–5 units.`;
export const ONE_SENTENCE =
  "Drop last week's papers and get one next move to own, proven with your own numbers.";
export const YC = "Invoice & labor checks for indie restaurants";
export const A16Z =
  "Invoice, labor, and plate-cost checks for independent restaurants. No CFO needed.";

export const INVOICE_Q = "What went up on my invoice?";
export const SHIFT_Q = "Why did the shift run over?";
export const PLATE_Q = "What does this plate cost now?";

export const HONESTY_RULE =
  "Every number is Verified, Estimated, or Missing. A missing invoice stays Missing, not $0. We do not invent dollars.";
export const AI_RULE = "The formulas decide the dollars. Grok only explains the result.";

export const OFFER =
  "The first owner seat is free for one restaurant, with pilot usage limits. No card is needed to start, no POS connection is needed, and there is no ChatGPT sign-in.";
export const PAID =
  "Additional manager seats are planned as paid options. We will explain availability and pricing before anyone commits.";

export function shareUrl(path: string): string {
  return new URL(path, SITE).toString();
}

export function pageMeta(path: string, title: string, description: string): Metadata {
  const url = shareUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: BRAND,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
