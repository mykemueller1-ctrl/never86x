"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaperField } from "@/components/PaperField";
import { ResultCard } from "@/components/ResultCard";
import { loadPlace } from "@/lib/history";
import { checkLabor } from "@/lib/parseLabor";
import { readPaper } from "@/lib/readPaper";
import { SAMPLE_CLOCK_PASTE, SAMPLE_SCHEDULE_PASTE, papersMatch } from "@/lib/sample";

export function LaborCheck() {
  const params = useSearchParams();
  const [schedule, setSchedule] = useState("");
  const [clock, setClock] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [place, setPlace] = useState("");
  const [ran, setRan] = useState(false);

  useEffect(() => {
    setPlace(loadPlace());
    if (params.get("sample") === "1") {
      setSchedule(SAMPLE_SCHEDULE_PASTE);
      setClock(SAMPLE_CLOCK_PASTE);
      setRan(true);
    }
  }, [params]);

  const result = ran ? checkLabor(schedule, clock) : null;
  const sample =
    papersMatch(schedule, SAMPLE_SCHEDULE_PASTE) && papersMatch(clock, SAMPLE_CLOCK_PASTE);

  async function onFile(which: "schedule" | "clock", file: File | undefined) {
    if (!file) return;
    const read = await readPaper(file);
    setNotice(read.notice);
    if (!read.text) return;
    if (which === "schedule") setSchedule(read.text);
    else setClock(read.text);
    setRan(false);
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-[var(--muted)]">
        A photo of the schedule needs typing. No rate on the paper means the pay line stays blank.
      </p>
      <div className="mt-4 grid gap-4">
        <PaperField
          id="schedule"
          label="Schedule"
          value={schedule}
          placeholder={"Alex in 4:00pm out 9:00pm break 30 rate 20\nJordan in 5:00pm out 9:00pm break 0 rate 18"}
          onChange={(value) => {
            setSchedule(value);
            setRan(false);
          }}
          onFile={(file) => onFile("schedule", file)}
        />
        <PaperField
          id="clock"
          label="Clock-outs"
          value={clock}
          placeholder={"Alex in 4:00pm out 11:00pm break 30\nJordan in 5:00pm out 8:30pm break 0"}
          onChange={(value) => {
            setClock(value);
            setRan(false);
          }}
          onFile={(file) => onFile("clock", file)}
        />
      </div>
      {notice ? <p className="mt-3 text-sm">{notice}</p> : null}
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={() => setRan(true)}
          className="rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white"
        >
          Compare schedule and clock
        </button>
        <button
          type="button"
          onClick={() => {
            setSchedule(SAMPLE_SCHEDULE_PASTE);
            setClock(SAMPLE_CLOCK_PASTE);
            setNotice("Sample loaded. Fictional staff. The $31 is math on the sample rates.");
            setRan(true);
          }}
          className="rounded-xl border border-[var(--line)] px-4 py-3 text-base font-semibold"
        >
          Use the sample Friday
        </button>
      </div>
      {result && result.rows.length > 0 ? (
        <ResultCard headline={result.headline} rows={result.rows} sample={sample} tool="labor" place={place} />
      ) : result ? (
        <p className="mt-4 text-sm font-medium">{result.headline}</p>
      ) : null}
    </div>
  );
}
