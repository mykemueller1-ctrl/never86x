export type SavedCard = {
  id: string;
  tool: "invoices" | "plate" | "labor";
  title: string;
  text: string;
  at: string;
};

const CARDS = "never86x.phone.cards";
const PLACE = "never86x.phone.place";

function isCard(value: unknown): value is SavedCard {
  if (!value || typeof value !== "object") return false;
  const card = value as SavedCard;
  return (
    typeof card.id === "string" &&
    (card.tool === "invoices" || card.tool === "plate" || card.tool === "labor") &&
    typeof card.title === "string" &&
    typeof card.text === "string" &&
    typeof card.at === "string"
  );
}

export function loadCards(): SavedCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CARDS);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCard).slice(0, 20);
  } catch {
    return [];
  }
}

export function saveCard(input: { tool: SavedCard["tool"]; title: string; text: string }): SavedCard {
  const card: SavedCard = {
    id: crypto.randomUUID(),
    tool: input.tool,
    title: input.title,
    text: input.text,
    at: new Date().toISOString(),
  };
  const next = [card, ...loadCards()].slice(0, 20);
  window.localStorage.setItem(CARDS, JSON.stringify(next));
  return card;
}

export function removeCard(id: string) {
  const next = loadCards().filter((card) => card.id !== id);
  window.localStorage.setItem(CARDS, JSON.stringify(next));
}

export function clearCards() {
  window.localStorage.removeItem(CARDS);
}

export function loadPlace(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(PLACE) ?? "";
}

export function savePlace(name: string) {
  const clean = name.trim().slice(0, 80);
  if (!clean) window.localStorage.removeItem(PLACE);
  else window.localStorage.setItem(PLACE, clean);
}
