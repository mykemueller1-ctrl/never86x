import { SHARE_LINE, SHIFT_Q } from "@/lib/brand";
import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = `${SHIFT_Q} ${SHARE_LINE}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard("SHIFT", SHIFT_Q, SHARE_LINE);
}
