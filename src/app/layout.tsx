import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { A16Z, BRAND, PRODUCT, SHARE_DESCRIPTION, SHARE_TITLE, SITE } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${BRAND} — ${PRODUCT}`,
    template: `%s · ${BRAND}`,
  },
  description: A16Z,
  alternates: { canonical: SITE },
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    url: SITE,
    siteName: BRAND,
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
