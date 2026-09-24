import Link from "next/link";
import { Honesty } from "@/components/Honesty";

export default function TryRecipesPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Honesty kind="Sample" />
      <h1 className="mt-3 text-3xl font-bold">Every ingredient. One honest plate cost.</h1>
      <p className="mt-2 text-lg font-medium">House cheese pizza · $16 menu price</p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Ingredient cost / serving <strong>$4.00</strong> · 25% ·{" "}
        <Honesty kind="Sample" />
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        <li>Whole milk mozzarella — $1.40</li>
        <li>Prepared dough ball — $1.50</li>
        <li>Prepared sauce — $0.70</li>
        <li>Oil and seasoning — $0.40</li>
      </ul>
      <p className="mt-4 text-xs text-[var(--muted)]">
        Sample prices never enter your private seat.
      </p>
      <Link href="/try/desk" className="mt-6 inline-block text-[var(--accent)]">
        Explore the sample workspace →
      </Link>
    </div>
  );
}
