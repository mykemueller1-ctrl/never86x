import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { A16Z, BRAND, FOUNDER, HEADLINE, INVOICE_Q, OFFER, PLATE_Q, PRODUCT, SHIFT_Q, SITE, TAGLINE } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${BRAND} — ${PRODUCT}`,
    template: `%s · ${BRAND}`,
  },
  description: A16Z,
  alternates: { canonical: SITE },
  openGraph: {
    title: HEADLINE,
    description: TAGLINE,
    url: SITE,
    siteName: BRAND,
  },
  twitter: {
    card: "summary_large_image",
    title: HEADLINE,
    description: TAGLINE,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="border-b border-[var(--line)]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <Link href="/" className="text-sm font-extrabold tracking-wide no-underline">
              {BRAND}
            </Link>
            <nav aria-label="Checks" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <Link href="/check/invoices">{INVOICE_Q}</Link>
              <Link href="/check/labor">{SHIFT_Q}</Link>
              <Link href="/check/menu">{PLATE_Q}</Link>
              <Link href="/seat" className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-white">
                {PRODUCT}
              </Link>
            </nav>
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
              <span>Papers stay on this phone.</span>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
