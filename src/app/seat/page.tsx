import type { Metadata } from "next";
import { PhoneSeat } from "@/components/PhoneSeat";

const title = "History stays on this phone.";
const description = "No account. Checks run in the browser. Saved cards never leave this phone.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default async function SeatPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const { start } = await searchParams;
  return <PhoneSeat start={start ?? ""} />;
}
