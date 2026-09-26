"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaperField } from "@/components/PaperField";
import { ResultCard } from "@/components/ResultCard";
import { ScreenStatus } from "@/components/ScreenStatus";
import { usePaperSlot } from "@/components/usePaperSlot";
import { loadPlace } from "@/lib/history";
import { applyPhotoTrust, tighterTrust } from "@/lib/photoHonesty";
import { checkLabor } from "@/lib/parseLabor";
import { SAMPLE_CLOCK_PASTE, SAMPLE_SCHEDULE_PASTE, papersMatch } from "@/lib/sample";

const STATUS = "labor-status";

export function LaborCheck() {
  const params = useSearchParams();
  const planned = usePaperSlot();
  const punched = usePaperSlot();
  const [schedule, setSchedule] = useState("");
  const [clock, setClock] = useState("");
  const [place, setPlace] = useState("");
  const [ran, setRan] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setPlace(loadPlace());
    if (params.get("sample") === "1") {
      setSchedule(SAMPLE_SCHEDULE_PASTE);
      setClock(SAMPLE_CLOCK_PASTE);
      setRan(true);
    }
  }, [params]);

  const reading = planned.reading || punched.reading;
  const sample =
    papersMatch(schedule, SAMPLE_SCHEDULE_PASTE) && papersMatch(clock, SAMPLE_CLOCK_PASTE);
  const raw = ran ? checkLabor(schedule, clock) : null;
  const result = raw
    ? applyPhotoTrust(raw, tighterTrust(planned.trustFor(schedule), punched.trustFor(clock)))
    : null;
  const photoError = planned.blocked(schedule)
    ? planned.error
    : punched.blocked(clock)
      ? punched.error
      : null;

  function compare() {
    if (reading) return;
    if (planned.blocked(schedule) || punched.blocked(clock)) {
      setFormError("A photo is too uncertain to price. Type the lines. No dollar was filled in.");
      setRan(false);
      return;
    }
    if (!schedule.trim() || !clock.trim()) {
      setFormError("Paste the schedule and the clock report.");
      setRan(false);
      return;
    }
    setFormError(null);
    setRan(true);
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-[var(--muted)]">
        A photo is read on this phone. A blurry read is flagged and is not a pay figure. No rate on
        the paper means the pay line stays blank. Nothing is uploaded.
      </p>
      <div className="mt-4 grid gap-4">
        <PaperField
          id="schedule"
          label="Schedule"
          value={schedule}
          statusId={STATUS}
          busy={planned.reading}
          placeholder={"Alex in 4:00pm out 9:00pm break 30 rate 20\nJordan in 5:00pm out 9:00pm break 0 rate 18"}
          onChange={(value) => {
            setSchedule(value);
            setRan(false);
            setFormError(null);
            planned.reset();
          }}
          onFile={async (file) => {
            const text = await planned.read(file);
            if (text) {
              setSchedule(text);
              setRan(false);
            }
          }}
        />
        <PaperField
          id="clock"
          label="Clock-outs"
          value={clock}
          statusId={STATUS}
          busy={punched.reading}
          placeholder={"Alex in 4:00pm out 11:00pm break 30\nJordan in 5:00pm out 8:30pm break 0"}
          onChange={(value) => {
            setClock(value);
            setRan(false);
            setFormError(null);
            punched.reset();
          }}
          onFile={async (file) => {
            const text = await punched.read(file);
            if (text) {
              setClock(text);
              setRan(false);
            }
          }}
        />
      </div>
      <div id={STATUS}>
        {reading ? (
          <ScreenStatus kind="loading">
            {planned.notice ?? punched.notice ?? "Reading on this phone. Nothing is uploaded."}
          </ScreenStatus>
        ) : null}
        {!reading && (formError || photoError) ? (
          <ScreenStatus kind="error">{formError ?? photoError ?? ""}</ScreenStatus>
        ) : null}
        {!reading && !formError && !photoError && (planned.notice || punched.notice) ? (
          <p role="status" className="mt-3 text-sm">
            {[planned.notice, punched.notice].filter(Boolean).join(" ")}
          </p>
        ) : null}
        {!reading && !formError && !photoError && !ran ? (
          <ScreenStatus kind="empty">Nothing compared yet. Paste the schedule and the clock-outs.</ScreenStatus>
        ) : null}
      </div>
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={compare}
          disabled={reading}
          className="rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white"
        >
          Compare schedule and clock
        </button>
        <button
          type="button"
          onClick={() => {
            planned.reset();
            punched.reset();
            setSchedule(SAMPLE_SCHEDULE_PASTE);
            setClock(SAMPLE_CLOCK_PASTE);
            setFormError(null);
            setRan(true);
          }}
          disabled={reading}
          className="rounded-xl border border-[var(--line)] px-4 py-3 text-base font-semibold"
        >
          Use the sample Friday
        </button>
      </div>
      {result && result.rows.length > 0 ? (
        <ResultCard
          headline={result.headline}
          rows={result.rows}
          sample={sample}
          tool="labor"
          place={place}
          photoNote={result.photoNote}
          lowConfidence={result.lowConfidence}
        />
      ) : result ? (
        <ScreenStatus kind="empty">{result.headline}</ScreenStatus>
      ) : null}
    </div>
  );
}
