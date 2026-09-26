import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

const site =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Never86 — free cost checks",
    template: "%s · Never86",
  },
  description:
    "Paste invoices, a recipe, or the schedule. Free. No login. Papers stay on the phone.",
  openGraph: {
    title: "You run the restaurant. Watch the costs.",
    description: "Free. No login. Papers stay on the phone.",
    siteName: "Never86",
  },
  twitter: {
    card: "summary_large_image",
    title: "You run the restaurant. Watch the costs.",
    description: "Free. No login. Papers stay on the phone.",
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
              NEVER86
            </Link>
            <nav aria-label="Checks" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <Link href="/check/invoices">Invoices</Link>
              <Link href="/check/menu">Plate</Link>
              <Link href="/check/labor">Labor</Link>
              <Link href="/seat" className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-white">
                This phone
              </Link>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="mt-16 border-t border-[var(--line)]">
          <nav aria-label="More" className="mx-auto flex max-w-5xl flex-wrap gap-x-4 gap-y-2 px-4 py-6 text-sm text-[var(--muted)]">
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
            <span>Free. Papers stay on this phone.</span>
          </nav>
        </footer>
      </body>
    </html>
  );
}
