export type MoveRow = { label: string; value: string; honesty: string };

function priced(rows: MoveRow[]): boolean {
  return rows.some((row) => row.honesty !== "Missing" && row.value.includes("$"));
}

/** One next move from the card. The sentence does not invent a dollar. */
export function nextMove(tool: "invoices" | "labor" | "plate", rows: MoveRow[]): string {
  if (tool === "invoices") {
    if (!priced(rows)) return "Get the missing price on paper before you treat this as a cost.";
    return "Check the new price with your rep.";
  }
  if (tool === "labor") {
    if (!priced(rows)) return "The hours are on the card. A pay figure stays off until a rate is on the paper.";
    return "Ask who stayed, and whether that time was on the schedule.";
  }
  const plate = rows.find((row) => row.label === "Plate cost");
  if (!plate || plate.honesty === "Missing" || !plate.value.includes("$")) {
    return "Fill the missing ingredient price before you cost the plate.";
  }
  return "Decide if this plate still fits before the next menu print.";
}
