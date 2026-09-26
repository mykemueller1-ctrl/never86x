import { OFFER, PRODUCT, pageMeta } from "@/lib/brand";
import { PhoneSeat } from "@/components/PhoneSeat";

const title = PRODUCT;
const description = `${OFFER} History stays on this phone.`;

export const metadata = pageMeta("/seat", title, description);

export default async function SeatPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const { start } = await searchParams;
  return <PhoneSeat start={start ?? ""} />;
}
