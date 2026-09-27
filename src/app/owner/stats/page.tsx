import { OwnerStats } from "@/components/OwnerStats";

export const metadata = {
  title: "Owner numbers",
  robots: { index: false, follow: false },
};

export default function OwnerStatsPage() {
  return <OwnerStats googleConfigured={Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)} />;
}
