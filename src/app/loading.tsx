import { ScreenStatus } from "@/components/ScreenStatus";

export default function Loading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold">Opening this screen</h1>
      <ScreenStatus kind="loading">Loading. The checks stay on this phone.</ScreenStatus>
    </div>
  );
}
