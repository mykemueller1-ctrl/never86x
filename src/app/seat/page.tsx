import { Suspense } from "react";
import { OneSeat } from "@/components/OneSeat";
import { ScreenStatus } from "@/components/ScreenStatus";
import { HEADLINE, PRODUCT, TAGLINE, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/seat", PRODUCT, `${HEADLINE} ${TAGLINE}`);

export default function SeatPage() {
  return (
    <Suspense fallback={<ScreenStatus kind="loading">Opening One Seat…</ScreenStatus>}>
      <OneSeat />
    </Suspense>
  );
}
