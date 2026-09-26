export const STATS_ZONE = "America/Chicago";

export const EVENT_NAMES = [
  "link_open",
  "check_start",
  "check_complete",
  "login_attempt",
  "login_success",
  "seat_claimed",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

export const EVENT_LABEL: Record<EventName, string> = {
  link_open: "Opened the link",
  check_start: "Started an invoice check",
  check_complete: "Saw a result",
  login_attempt: "Asked for a sign-in link",
  login_success: "Signed in",
  seat_claimed: "Claimed the free seat",
};

export type StatsWindow = "today" | "week" | "all";

export type CountSet = Record<EventName, number>;

export type FunnelStep = {
  name: EventName;
  label: string;
  count: number;
  from: number | null;
  percent: number | null;
};

const DAY = 24 * 60 * 60 * 1000;

/** Midnight at the start of `now`'s calendar day in the given zone, as epoch ms. */
export function zonedMidnight(now: Date, timeZone = STATS_ZONE): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  const offset = asUtc - now.getTime();
  return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) - offset;
}

export function inStatsWindow(iso: string, window: StatsWindow, now = Date.now()): boolean {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return false;
  if (window === "all") return true;
  if (window === "week") return time >= now - 7 * DAY;
  return time >= zonedMidnight(new Date(now));
}

export function emptyCounts(): CountSet {
  return {
    link_open: 0,
    check_start: 0,
    check_complete: 0,
    login_attempt: 0,
    login_success: 0,
    seat_claimed: 0,
  };
}

export function countEvents(
  events: { name: EventName; createdAt: string }[],
  window: StatsWindow,
  now = Date.now(),
): CountSet {
  const counts = emptyCounts();
  for (const event of events) {
    if (!inStatsWindow(event.createdAt, window, now)) continue;
    counts[event.name] += 1;
  }
  return counts;
}

/** Percent of the previous step. Null when that step has not happened. */
export function funnel(counts: CountSet): FunnelStep[] {
  return EVENT_NAMES.map((name, index) => {
    const previous = index === 0 ? null : counts[EVENT_NAMES[index - 1]];
    const count = counts[name];
    const percent = previous === null || previous <= 0 ? null : Math.round((count / previous) * 1000) / 10;
    return { name, label: EVENT_LABEL[name], count, from: previous, percent };
  });
}

export function formatWhen(iso: string): string {
  const time = new Date(iso);
  if (Number.isNaN(time.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: STATS_ZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(time);
}

export function deviceLabel(uaClass: string): string {
  if (uaClass === "x_in_app") return "X app";
  if (uaClass === "mobile") return "Phone";
  return "Computer";
}

const DEFAULT_OWNER = "mykemueller1@gmail.com";

export function ownerAllowlist(raw = process.env.OWNER_EMAILS): string[] {
  const source = raw?.trim() ? raw : DEFAULT_OWNER;
  return [...new Set(source.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean))];
}

export function isOwnerEmail(email: string | null | undefined, raw = process.env.OWNER_EMAILS): boolean {
  if (!email) return false;
  return ownerAllowlist(raw).includes(email.trim().toLowerCase());
}
