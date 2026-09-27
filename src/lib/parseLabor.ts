import type { CheckResult, CheckRow, HonestyKind } from "./honesty";
import { NOT_ON_PAPER } from "./honesty";
import { formatDelta, formatHours, formatMoney, formatSignedHours, round2 } from "./money";

type Shift = {
  name: string;
  inMin: number | null;
  outMin: number | null;
  breakMin: number | null;
  rate: number | null;
};

type HoursRead = {
  hours: number | null;
  honesty: HonestyKind;
  detail?: string;
};

function parseTime(raw: string): number | null {
  const m = raw.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let hour = Number(m[1]);
  const minute = m[2] ? Number(m[2]) : 0;
  const ap = m[3];
  if (minute > 59 || hour > 23) return null;
  if (ap) {
    if (hour < 1 || hour > 12) return null;
    if (hour === 12) hour = 0;
    if (ap === "pm") hour += 12;
  } else if (hour > 23) return null;
  return hour * 60 + minute;
}

function parseRate(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return round2(n);
}

function shiftFromParts(
  name: string,
  inn: string,
  out: string,
  breakRaw: string | undefined,
  rateRaw: string | undefined,
): Shift {
  return {
    name: name.trim().replace(/\s+/g, " "),
    inMin: parseTime(inn),
    outMin: parseTime(out),
    breakMin: breakRaw == null || breakRaw === "" ? null : Number(breakRaw),
    rate: parseRate(rateRaw),
  };
}

function parseLine(line: string): Shift | null {
  const spoken = line.match(
    /^(.+?)\s+in\s+(\S+)\s+out\s+(\S+)(?:\s+break\s+(\d+))?(?:\s+rate\s+\$?(\d+(?:\.\d{1,2})?))?\s*$/i,
  );
  if (spoken) return shiftFromParts(spoken[1], spoken[2], spoken[3], spoken[4], spoken[5]);

  const cols = line.split(",").map((part) => part.trim());
  if (cols.length >= 3 && parseTime(cols[1]) != null && parseTime(cols[2]) != null) {
    return shiftFromParts(cols[0], cols[1], cols[2], cols[3], cols[4]);
  }
  return null;
}

export function parseShifts(text: string): Shift[] {
  const rows = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);
  const header = rows[0]?.toLowerCase() ?? "";
  const start =
    header.includes(",") && /name|employee|person/.test(header) && /in|out/.test(header) ? 1 : 0;
  const shifts: Shift[] = [];
  for (const row of rows.slice(start)) {
    const shift = parseLine(row);
    if (shift && shift.name) shifts.push(shift);
  }
  return shifts;
}

function hoursOf(shift: Shift): HoursRead {
  if (shift.inMin == null || shift.outMin == null) {
    return { hours: null, honesty: "Missing", detail: "In or out time is not on the paper." };
  }
  let span = shift.outMin - shift.inMin;
  let crossed = false;
  if (span <= 0) {
    span += 24 * 60;
    crossed = true;
  }
  const breakMin = shift.breakMin ?? 0;
  if (shift.breakMin != null && (!Number.isFinite(breakMin) || breakMin < 0 || breakMin >= span)) {
    return { hours: null, honesty: "Missing", detail: "Break minutes don't fit the shift." };
  }
  const hours = round2((span - breakMin) / 60);
  if (shift.breakMin == null) {
    return {
      hours,
      honesty: "Estimated",
      detail: crossed
        ? "No break on the paper, so none was taken off. Counted past midnight."
        : "No break on the paper, so none was taken off.",
    };
  }
  return {
    hours,
    honesty: "Estimated",
    detail: crossed ? "Counted past midnight. Break taken off." : "Out minus in, minus the break.",
  };
}

function nameKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

export function checkLabor(scheduleText: string, clockText: string): CheckResult {
  if (!scheduleText.trim() || !clockText.trim()) {
    return { headline: "Paste the schedule and the clock report.", rows: [] };
  }

  const schedule = parseShifts(scheduleText);
  const clock = parseShifts(clockText);
  if (schedule.length === 0 && clock.length === 0) {
    return {
      headline: "No shifts on that paste.",
      rows: [{ label: "Shifts", value: NOT_ON_PAPER, honesty: "Missing" }],
    };
  }

  const used = new Set<number>();
  const rows: CheckRow[] = [];
  let extra = 0;
  let fewer = 0;
  let netHours = 0;
  let hoursKnown = 0;
  let pay = 0;
  let payKnown = 0;
  let payMissing = 0;

  const consider = (sched: Shift | undefined, punched: Shift | undefined) => {
    const name = sched?.name ?? punched?.name ?? "Shift";
    const planned = sched ? hoursOf(sched) : { hours: null, honesty: "Missing" as const, detail: "Not on the schedule." };
    const actual = punched
      ? hoursOf(punched)
      : { hours: null, honesty: "Missing" as const, detail: "Not on the clock report." };

    rows.push({
      label: `${name} · scheduled`,
      value: planned.hours == null ? NOT_ON_PAPER : formatHours(planned.hours),
      honesty: planned.hours == null ? "Missing" : planned.honesty,
      detail: planned.detail,
    });
    rows.push({
      label: `${name} · clock`,
      value: actual.hours == null ? NOT_ON_PAPER : formatHours(actual.hours),
      honesty: actual.hours == null ? "Missing" : actual.honesty,
      detail: actual.detail,
    });

    if (planned.hours == null || actual.hours == null) {
      rows.push({
        label: `${name} · hour drift`,
        value: NOT_ON_PAPER,
        honesty: "Missing",
      });
      payMissing += 1;
      rows.push({ label: `${name} · pay drift`, value: NOT_ON_PAPER, honesty: "Missing" });
      return;
    }

    const drift = round2(actual.hours - planned.hours);
    if (drift > 0) extra = round2(extra + drift);
    if (drift < 0) fewer = round2(fewer + Math.abs(drift));
    netHours = round2(netHours + drift);
    hoursKnown += 1;
    rows.push({
      label: `${name} · hour drift`,
      value: formatSignedHours(drift),
      honesty: "Estimated",
      detail: "Clock hours minus scheduled hours.",
    });

    const rate = sched?.rate ?? null;
    const clockRate = punched?.rate ?? null;
    if (rate != null && clockRate != null && rate !== clockRate) {
      payMissing += 1;
      rows.push({
        label: `${name} · pay drift`,
        value: NOT_ON_PAPER,
        honesty: "Missing",
        detail: "Two different rates. We will not pick one.",
      });
      return;
    }
    const usedRate = rate ?? clockRate;
    if (usedRate == null) {
      payMissing += 1;
      rows.push({
        label: `${name} · pay drift`,
        value: NOT_ON_PAPER,
        honesty: "Missing",
        detail: "No hourly rate on the paper.",
      });
      rows.push({ label: `${name} · rate`, value: NOT_ON_PAPER, honesty: "Missing" });
      return;
    }
    const dollars = round2(drift * usedRate);
    pay = round2(pay + dollars);
    payKnown += 1;
    rows.push({ label: `${name} · rate`, value: `${formatMoney(usedRate)}/h`, honesty: "Verified" });
    rows.push({
      label: `${name} · pay drift`,
      value: formatDelta(dollars),
      honesty: "Estimated",
      detail: "Hour drift times the rate on the paper.",
    });
  };

  for (const sched of schedule) {
    const key = nameKey(sched.name);
    const idx = clock.findIndex((shift, i) => !used.has(i) && nameKey(shift.name) === key);
    if (idx >= 0) used.add(idx);
    consider(sched, idx >= 0 ? clock[idx] : undefined);
  }
  clock.forEach((shift, i) => {
    if (!used.has(i)) consider(undefined, shift);
  });

  if (hoursKnown > 0) {
    rows.push({
      label: "Extra hours",
      value: formatHours(extra),
      honesty: "Estimated",
    });
    rows.push({
      label: "Fewer hours",
      value: formatHours(fewer),
      honesty: "Estimated",
    });
    rows.push({
      label: "Net hours",
      value: formatSignedHours(netHours),
      honesty: "Estimated",
    });
  }

  if (payKnown > 0 && payMissing === 0) {
    rows.push({
      label: "Straight-time difference",
      value: formatDelta(pay),
      honesty: "Estimated",
      detail: "Sum of each pay drift. Not a payroll filing.",
    });
  } else {
    rows.push({
      label: "Straight-time difference",
      value: NOT_ON_PAPER,
      honesty: "Missing",
      detail: "A rate or a shift is missing, so there is no pay total.",
    });
  }

  const headline =
    hoursKnown === 0
      ? "No hours to compare."
      : payKnown > 0 && payMissing === 0
        ? `Net ${formatHours(netHours).replace(/^\+/, "")}. Straight-time difference ${formatDelta(pay)}.`
        : `Net ${formatHours(netHours).replace(/^\+/, "")}. Pay stays blank where the rate is missing.`;

  return { headline, rows };
}
