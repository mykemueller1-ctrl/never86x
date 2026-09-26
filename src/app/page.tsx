import { Suspense } from "react";
import { OneSeat } from "@/components/OneSeat";
import { ScreenStatus } from "@/components/ScreenStatus";

export default function HomePage() {
  return (
    <Suspense fallback={<ScreenStatus kind="loading">Opening One Seat…</ScreenStatus>}>
      <OneSeat />
    </Suspense>
  );
}
