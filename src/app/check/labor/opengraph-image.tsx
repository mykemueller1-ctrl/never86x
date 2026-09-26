import { SHIFT_Q, TAGLINE } from "@/lib/brand";
import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = `${SHIFT_Q} ${TAGLINE}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard("SHIFT", SHIFT_Q, TAGLINE);
}
