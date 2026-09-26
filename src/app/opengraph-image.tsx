import { SHARE_LINE, SHARE_TITLE } from "@/lib/brand";
import { ogContentType, ogSize, shareCard } from "@/lib/ogCard";

export const alt = `${SHARE_TITLE} ${SHARE_LINE}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return shareCard();
}
