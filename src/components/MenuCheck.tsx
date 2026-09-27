"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaperField } from "@/components/PaperField";
import { ResultCard } from "@/components/ResultCard";
import { ScreenStatus } from "@/components/ScreenStatus";
import { usePaperSlot } from "@/components/usePaperSlot";
import { PLATE_Q } from "@/lib/brand";
import { readDraft, rememberCheck, writeDraft } from "@/lib/draft";
import { loadPlace } from "@/lib/history";
import { applyPhotoTrust } from "@/lib/photoHonesty";
import { checkRecipe } from "@/lib/parseRecipe";
import { SAMPLE_RECIPE_PASTE, papersMatch } from "@/lib/sample";

const STATUS = "recipe-status";

export function MenuCheck() {
  const params = useSearchParams();
  const slot = usePaperSlot();
  const [recipe, setRecipe] = useState("");
  const [place, setPlace] = useState("");
  const [ran, setRan] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setPlace(loadPlace());
    if (params.get("sample") === "1") {
      setRecipe(SAMPLE_RECIPE_PASTE);
      setRan(true);
      return;
    }
    const draft = readDraft();
    if (draft.recipe) setRecipe(draft.recipe);
  }, [params]);

  useEffect(() => {
    writeDraft({ recipe });
  }, [recipe]);

  const sample = papersMatch(recipe, SAMPLE_RECIPE_PASTE);
  const raw = ran ? checkRecipe(recipe) : null;
  const result = raw ? applyPhotoTrust(raw, slot.trustFor(recipe)) : null;
  const readError = slot.error;

  const plateNote = result?.rows.map((row) => `${row.label}:${row.honesty}`).join("|") ?? "";
  useEffect(() => {
    if (!ran || !result?.rows.length) return;
    rememberCheck({
      tool: "plate",
      headline: result.headline,
      rows: result.rows.map((row) => ({ label: row.label, value: row.value, honesty: row.honesty })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plateNote, ran]);

  function cost() {
    if (slot.reading) return;
    if (slot.blocked(recipe)) {
      setFormError("A photo is too uncertain to price. Type the lines. No dollar was filled in.");
      setRan(false);
      return;
    }
    if (!recipe.trim()) {
      setFormError("Paste a recipe.");
      setRan(false);
      return;
    }
    setFormError(null);
    setRan(true);
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-[var(--muted)]">
        A photo of the card is read on this phone. A blurry read is flagged and is not a price.
        Nothing is uploaded.
      </p>
      <div className="mt-4">
        <PaperField
          id="recipe-card"
          label="Recipe"
          value={recipe}
          rows={8}
          statusId={STATUS}
          busy={slot.reading}
          placeholder={"House cheese pizza | sell $16.00\nWhole milk mozzarella — $1.40\n8 oz dough @ $1.20/lb"}
          onChange={(value) => {
            setRecipe(value);
            setRan(false);
            setFormError(null);
            slot.reset();
          }}
          onFile={async (file) => {
            const text = await slot.read(file);
            if (text) {
              setRecipe(text);
              setRan(false);
            }
          }}
        />
      </div>
      <div id={STATUS}>
        {slot.reading ? (
          <ScreenStatus kind="loading">{slot.notice ?? "Reading on this phone. Nothing is uploaded."}</ScreenStatus>
        ) : null}
        {!slot.reading && (formError || readError) ? (
          <ScreenStatus kind="error">{formError || readError || ""}</ScreenStatus>
        ) : null}
        {!slot.reading && !formError && !readError && slot.notice ? (
          <p role="status" className="mt-3 text-sm">
            {slot.notice}
          </p>
        ) : null}
        {!slot.reading && !formError && !readError && !ran ? (
          <ScreenStatus kind="empty">{`${PLATE_Q} Nothing costed yet. Paste the recipe, then cost the plate.`}</ScreenStatus>
        ) : null}
      </div>
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={cost}
          disabled={slot.reading}
          className="rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white"
        >
          Cost this plate
        </button>
        <button
          type="button"
          onClick={() => {
            slot.reset();
            setRecipe(SAMPLE_RECIPE_PASTE);
            setFormError(null);
            setRan(true);
          }}
          disabled={slot.reading}
          className="rounded-xl border border-[var(--line)] px-4 py-3 text-base font-semibold"
        >
          Use the sample recipe
        </button>
      </div>
      {result && result.rows.length > 0 ? (
        <ResultCard
          headline={result.headline}
          rows={result.rows}
          sample={sample}
          tool="plate"
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
