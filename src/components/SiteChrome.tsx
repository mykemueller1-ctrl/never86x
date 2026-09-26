import Link from "next/link";
import { BRAND, FOUNDER, METHOD, OFFER, PRODUCT } from "@/lib/brand";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="border-b border-[var(--line)] bg-[#f6f5f3]">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-sm font-extrabold tracking-wide uppercase no-underline">
            {BRAND}
          </Link>
          <span className="text-[11px] font-semibold tracking-[0.14em] text-[var(--muted)]">{METHOD.toUpperCase()}</span>
          <Link href="/login" className="text-sm font-semibold no-underline">
            Sign in
          </Link>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="mt-16 border-t border-[var(--line)]">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-[var(--muted)]">
          <p>{FOUNDER}</p>
          <p className="mt-2">{OFFER}</p>
          <nav aria-label="More" className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/try/desk">Sample desk</Link>
            <Link href="/try/watch">Walkthrough</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/onboarding">Start</Link>
            <Link href="/contact">Talk to Myke</Link>
            <Link href="/support">Support</Link>
            <Link href="/status">Status</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/email-data">Email data</Link>
            <Link href="/check/invoices">Check my invoices</Link>
            <Link href="/check/labor">Check my labor</Link>
            <Link href="/check/menu">Check my plate cost</Link>
            <Link href="/seat">{PRODUCT}</Link>
            <span>Papers stay on this phone.</span>
          </nav>
        </div>
      </footer>
    </>
  );
}
