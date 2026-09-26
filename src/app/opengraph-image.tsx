import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = "Never86. You run the restaurant. Watch the costs. Free. No login.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard(
    "FREE · NO LOGIN",
    "You run the restaurant. Watch the costs.",
    "Papers stay on the phone.",
  );
}
