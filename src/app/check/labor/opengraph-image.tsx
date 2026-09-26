import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = "Scheduled until 9. Who stayed until 11? Free. No login.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard(
    "LABOR",
    "Scheduled until 9. Who stayed until 11?",
    "Paste the schedule and the clock. Free. No login.",
  );
}
