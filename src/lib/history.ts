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

export function parseStoredCards(raw: string | null): { cards: SavedCard[]; error: string | null } {
  if (!raw) return { cards: [], error: null };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return {
        cards: [],
        error: "History on this phone can't be read. Clear it, then keep a new card.",
      };
    }
    return { cards: parsed.filter(isCard).slice(0, 20), error: null };
  } catch {
    return { cards: [], error: "Couldn't read history on this phone." };
  }
}

export function loadCards(): SavedCard[] {
  if (typeof window === "undefined") return [];
  return parseStoredCards(window.localStorage.getItem(CARDS)).cards;
}

export function readHistory(): { cards: SavedCard[]; place: string; error: string | null } {
  if (typeof window === "undefined") return { cards: [], place: "", error: null };
  try {
    const place = window.localStorage.getItem(PLACE) ?? "";
    const stored = parseStoredCards(window.localStorage.getItem(CARDS));
    return { cards: stored.cards, place, error: stored.error };
  } catch {
    return { cards: [], place: "", error: "This phone blocked reading saved cards." };
  }
}

export function saveCard(input: { tool: SavedCard["tool"]; title: string; text: string }): string | null {
  try {
    const card: SavedCard = {
      id: crypto.randomUUID(),
      tool: input.tool,
      title: input.title,
      text: input.text,
      at: new Date().toISOString(),
    };
    const next = [card, ...loadCards()].slice(0, 20);
    window.localStorage.setItem(CARDS, JSON.stringify(next));
    return null;
  } catch {
    return "Couldn't keep that card on this phone.";
  }
}

export function removeCard(id: string): string | null {
  try {
    const next = loadCards().filter((card) => card.id !== id);
    window.localStorage.setItem(CARDS, JSON.stringify(next));
    return null;
  } catch {
    return "Couldn't remove that card on this phone.";
  }
}

export function clearCards(): string | null {
  try {
    window.localStorage.removeItem(CARDS);
    return null;
  } catch {
    return "Couldn't clear history on this phone.";
  }
}

export function loadPlace(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(PLACE) ?? "";
  } catch {
    return "";
  }
}

export function savePlace(name: string): string | null {
  try {
    const clean = name.trim().slice(0, 80);
    if (!clean) window.localStorage.removeItem(PLACE);
    else window.localStorage.setItem(PLACE, clean);
    return null;
  } catch {
    return "Couldn't save the name on this phone.";
  }
}
