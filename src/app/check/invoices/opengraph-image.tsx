import { INVOICE_Q, TAGLINE } from "@/lib/brand";
import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = `${INVOICE_Q} ${TAGLINE}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard("INVOICE", INVOICE_Q, TAGLINE);
}
