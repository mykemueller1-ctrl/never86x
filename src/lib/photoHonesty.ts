import type { CheckResult, CheckRow } from "./honesty";
import { NOT_ON_PAPER } from "./honesty";

/** Tesseract confidence is 0–100. Below this, the card says low confidence. */
export const PHOTO_LOW = 70;
/** Below this, no dollar from the photo is shown. */
export const PHOTO_REFUSE = 40;

export type PhotoTrust = {
  confidence: number | null;
  moneyConfidence: number | null;
};

export type PhotoDecision = "ok" | "low" | "refuse";

export type PhotoResult = CheckResult & {
  photoNote: string | null;
  lowConfidence: boolean;
};

const MONEY_WORD = /\$\s?\d|\d+\.\d{2}/;

export function moneyWordConfidence(words: { text: string; confidence: number }[]): number | null {
  const hits = words.filter((word) => MONEY_WORD.test(word.text));
  if (hits.length === 0) return null;
  return Math.min(...hits.map((word) => word.confidence));
}

export function trustScore(trust: PhotoTrust): number | null {
  const score = trust.moneyConfidence ?? trust.confidence;
  if (score == null || Number.isNaN(score)) return null;
  return score;
}

export function photoDecision(trust: PhotoTrust): PhotoDecision {
  const score = trustScore(trust);
  if (score == null || score < PHOTO_REFUSE) return "refuse";
  if (score < PHOTO_LOW) return "low";
  return "ok";
}

/** Keep the lower (less sure) read when two papers were photographed. */
export function tighterTrust(a: PhotoTrust | null, b: PhotoTrust | null): PhotoTrust | null {
  if (!a) return b;
  if (!b) return a;
  const sa = trustScore(a);
  const sb = trustScore(b);
  if (sa == null) return a;
  if (sb == null) return b;
  return sa <= sb ? a : b;
}

function hasDollar(value: string): boolean {
  return /\$\s*\d/.test(value);
}

function noteFor(score: number, low: boolean): string {
  const rounded = Math.round(score);
  if (low) {
    return `Low confidence photo read (${rounded}%). Check every digit. These figures are not Verified.`;
  }
  return `Photo read at ${rounded}% confidence. Check the number. A photo is not Verified.`;
}

function downgrade(row: CheckRow, note: string): CheckRow {
  if (row.honesty === "Missing" || row.honesty === "Sample") return row;
  const detail = row.detail ? `${row.detail} ${note}` : note;
  if (row.honesty === "Verified") return { ...row, honesty: "Estimated", detail };
  return { ...row, detail };
}

function stripDollars(result: CheckResult, note: string): PhotoResult {
  const rows = result.rows.map((row) => {
    if (!hasDollar(row.value)) {
      if (row.honesty === "Missing") return row;
      const detail = row.detail ? `${row.detail} ${note}` : note;
      return { ...row, detail };
    }
    return {
      label: row.label,
      value: NOT_ON_PAPER,
      honesty: "Missing" as const,
      detail: note,
    };
  });
  const headline = hasDollar(result.headline)
    ? "Photo confidence is too low to price. Type the lines."
    : result.headline;
  return { headline, rows, photoNote: note, lowConfidence: true };
}

/**
 * A photo is never Verified. Low confidence is labeled. A read below the
 * refuse line does not keep a dollar.
 */
export function applyPhotoTrust(result: CheckResult, trust: PhotoTrust | null): PhotoResult {
  if (!trust) return { ...result, photoNote: null, lowConfidence: false };
  const score = trustScore(trust);
  if (score == null) {
    return stripDollars(
      result,
      "The photo reader returned no confidence score, so no price from it is shown.",
    );
  }
  if (score < PHOTO_REFUSE) {
    return stripDollars(
      result,
      `Photo confidence ${Math.round(score)}% is too low to price. Type the lines. No dollar was filled in.`,
    );
  }
  const low = score < PHOTO_LOW;
  const note = noteFor(score, low);
  return {
    headline: result.headline,
    rows: result.rows.map((row) => downgrade(row, note)),
    photoNote: note,
    lowConfidence: low,
  };
}
