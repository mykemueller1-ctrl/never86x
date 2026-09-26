import { HEADLINE, PRODUCT, TAGLINE } from "@/lib/brand";
import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = `${PRODUCT}. ${HEADLINE} ${TAGLINE}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard(PRODUCT.toUpperCase(), HEADLINE, TAGLINE);
}
