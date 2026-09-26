import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = "Every ingredient. One honest plate cost. Paste a recipe. Free. No login.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard("PLATE COST", "Every ingredient. One honest plate cost.", "Paste a recipe. Free. No login.");
}
