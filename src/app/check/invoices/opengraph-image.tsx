import { ogCard, ogContentType, ogSize } from "@/lib/ogCard";

export const alt = "Same cheese. Same case. Different price. Paste two invoices. Free. No login.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard("INVOICES", "Same cheese. Same case. Different price.", "Paste two invoices. Free. No login.");
}
