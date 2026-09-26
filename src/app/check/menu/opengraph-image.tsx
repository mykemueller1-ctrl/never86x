import { PLATE_Q, SHARE_LINE } from "@/lib/brand";
import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = `${PLATE_Q} ${SHARE_LINE}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard("PLATE", PLATE_Q, SHARE_LINE);
}
