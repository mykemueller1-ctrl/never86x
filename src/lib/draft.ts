export type SeatDraft = {
  earlier: string;
  later: string;
  recipe: string;
  schedule: string;
  clock: string;
};

export type CheckNote = {
  tool: "invoices" | "labor" | "plate";
  headline: string;
  rows: { label: string; value: string; honesty: string }[];
};

const DRAFT_KEY = "never86x.seat.draft";
const CHECKS_KEY = "never86x.seat.checks";
const MAX = 8000;

export function emptyDraft(): SeatDraft {
  return { earlier: "", later: "", recipe: "", schedule: "", clock: "" };
}

function clip(value: unknown): string {
  return typeof value === "string" ? value.slice(0, MAX) : "";
}

export function readDraft(): SeatDraft {
  if (typeof window === "undefined") return emptyDraft();
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return emptyDraft();
    const parsed = JSON.parse(raw) as Partial<SeatDraft>;
    return {
      earlier: clip(parsed.earlier),
      later: clip(parsed.later),
      recipe: clip(parsed.recipe),
      schedule: clip(parsed.schedule),
      clock: clip(parsed.clock),
    };
  } catch {
    return emptyDraft();
  }
}

export function writeDraft(patch: Partial<SeatDraft>) {
  if (typeof window === "undefined") return;
  const next = { ...readDraft(), ...patch };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
}

export function replaceDraft(draft: SeatDraft) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify({
    earlier: clip(draft.earlier),
    later: clip(draft.later),
    recipe: clip(draft.recipe),
    schedule: clip(draft.schedule),
    clock: clip(draft.clock),
  }));
}

export function readChecks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHECKS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item === "invoices" || item === "labor" || item === "plate");
  } catch {
    return [];
  }
}

export function rememberCheck(note: CheckNote) {
  if (typeof window === "undefined") return;
  const checks = readChecks();
  if (!checks.includes(note.tool)) {
    checks.push(note.tool);
    localStorage.setItem(CHECKS_KEY, JSON.stringify(checks));
  }
  window.dispatchEvent(new CustomEvent("never86-check", { detail: note }));
}
