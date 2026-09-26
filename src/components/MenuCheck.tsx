"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaperField } from "@/components/PaperField";
import { ResultCard } from "@/components/ResultCard";
import { loadPlace } from "@/lib/history";
import { checkRecipe } from "@/lib/parseRecipe";
import { readPaper } from "@/lib/readPaper";
import { SAMPLE_RECIPE_PASTE, papersMatch } from "@/lib/sample";

export function MenuCheck() {
  const params = useSearchParams();
  const [recipe, setRecipe] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [place, setPlace] = useState("");
  const [ran, setRan] = useState(false);

  useEffect(() => {
    setPlace(loadPlace());
    if (params.get("sample") === "1") {
      setRecipe(SAMPLE_RECIPE_PASTE);
      setRan(true);
    }
  }, [params]);

  const result = ran ? checkRecipe(recipe) : null;
  const sample = papersMatch(recipe, SAMPLE_RECIPE_PASTE);

  return (
    <div className="mt-6">
      <p className="text-sm text-[var(--muted)]">
        A photo of the recipe card needs typing. Paste the lines, or add a PDF or CSV.
      </p>
      <div className="mt-4">
        <PaperField
          id="recipe-card"
          label="Recipe"
          value={recipe}
          rows={8}
          placeholder={"House cheese pizza | sell $16.00\nWhole milk mozzarella — $1.40\n8 oz dough @ $1.20/lb"}
          onChange={(value) => {
            setRecipe(value);
            setRan(false);
          }}
          onFile={async (file) => {
            if (!file) return;
            const read = await readPaper(file);
            setNotice(read.notice);
            if (!read.text) return;
            setRecipe(read.text);
            setRan(false);
          }}
        />
      </div>
      {notice ? <p className="mt-3 text-sm">{notice}</p> : null}
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={() => setRan(true)}
          className="rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white"
        >
          Cost this plate
        </button>
        <button
          type="button"
          onClick={() => {
            setRecipe(SAMPLE_RECIPE_PASTE);
            setNotice("Sample loaded. This is a fictional pizza.");
            setRan(true);
          }}
          className="rounded-xl border border-[var(--line)] px-4 py-3 text-base font-semibold"
        >
          Use the sample recipe
        </button>
      </div>
      {result && result.rows.length > 0 ? (
        <ResultCard headline={result.headline} rows={result.rows} sample={sample} tool="plate" place={place} />
      ) : result ? (
        <p className="mt-4 text-sm font-medium">{result.headline}</p>
      ) : null}
    </div>
  );
}
