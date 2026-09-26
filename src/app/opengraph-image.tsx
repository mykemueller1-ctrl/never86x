import { HEADLINE, TAGLINE } from "@/lib/brand";
import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = `${HEADLINE} ${TAGLINE}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard("ONE SEAT", HEADLINE, TAGLINE);
}
