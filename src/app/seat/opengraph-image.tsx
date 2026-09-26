import { PRODUCT } from "@/lib/brand";
import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = `${PRODUCT}. History stays on this phone. No ChatGPT sign-in.`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard(PRODUCT.toUpperCase(), "History stays on this phone.", "No ChatGPT sign-in.");
}
