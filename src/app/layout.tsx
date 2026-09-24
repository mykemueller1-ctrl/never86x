import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Never86 X — Action Shift",
  description:
    "One Seat for independent restaurant operators. Verified / Estimated / Missing. Never invent dollars.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-[var(--line)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-baseline gap-2 no-underline">
              <span className="text-sm font-extrabold tracking-wide">NEVER86 X</span>
              <span className="text-xs font-medium tracking-wide text-[var(--muted)]">
                ACTION SHIFT
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/try" className="text-[var(--muted)] hover:text-[var(--ink)]">
                Try
              </Link>
              <Link href="/try/desk" className="text-[var(--muted)] hover:text-[var(--ink)]">
                Owner desk
              </Link>
              <Link
                href="/seat"
                className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-white hover:opacity-90"
              >
                Sign in
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-[var(--line)]">
          <div className="mx-auto flex max-w-5xl flex-wrap gap-4 px-4 py-6 text-sm text-[var(--muted)]">
            <Link href="/contact">Talk to Myke</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/email-data">Email data</Link>
            <span className="ml-auto">First owner seat free · No invented $</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
