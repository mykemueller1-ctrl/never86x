export function Honesty({
  kind,
}: {
  kind: "Verified" | "Estimated" | "Missing" | "Sample";
}) {
  const cls =
    kind === "Verified"
      ? "badge-verified"
      : kind === "Estimated"
        ? "badge-estimated"
        : kind === "Missing"
          ? "badge-missing"
          : "badge-sample";
  return <span className={`badge ${cls}`}>{kind}</span>;
}
