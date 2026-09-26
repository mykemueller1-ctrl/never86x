import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = "History stays on this phone. No account.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard("THIS PHONE", "History stays on this phone.", "No account. No ChatGPT login.");
}
