import { Suspense } from "react";
import { OneSeat } from "@/components/OneSeat";
import { ScreenStatus } from "@/components/ScreenStatus";
import { SHARE_DESCRIPTION, SHARE_TITLE, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/seat", SHARE_TITLE, SHARE_DESCRIPTION);

export default function SeatPage() {
  return (
    <Suspense fallback={<ScreenStatus kind="loading">Opening One Seat…</ScreenStatus>}>
      <OneSeat />
    </Suspense>
  );
}
