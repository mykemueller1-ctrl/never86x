import { Honesty } from "@/components/Honesty";
import { HONESTY_RULE } from "@/lib/brand";

export function Legend() {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      <span>
        <Honesty kind="Verified" /> read off the paper
      </span>
      <span>
        <Honesty kind="Estimated" /> math on those numbers
      </span>
      <span>
        <Honesty kind="Missing" /> not on the paper
      </span>
      <span>
        <Honesty kind="Sample" /> fictional example
      </span>
      <span className="basis-full text-[var(--muted)]">{HONESTY_RULE}</span>
    </p>
  );
}
