import { Suspense } from "react";
import { ScreenStatus } from "@/components/ScreenStatus";
import { SeatDesk } from "@/components/SeatDesk";
import { SHARE_DESCRIPTION, SHARE_TITLE, pageMeta } from "@/lib/brand";

export const metadata = pageMeta("/seat", SHARE_TITLE, SHARE_DESCRIPTION);

export default function SeatPage() {
  return (
    <Suspense fallback={<ScreenStatus kind="loading">Opening One Seat…</ScreenStatus>}>
      <SeatDesk googleConfigured={Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)} />
    </Suspense>
  );
}
