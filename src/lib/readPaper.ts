"use client";

import type { PhotoTrust } from "./photoHonesty";

export type PaperSource = "text" | "pdf" | "photo";

export type PaperRead = {
  text: string;
  notice: string;
  source: PaperSource;
  trust: PhotoTrust | null;
  error: string | null;
};

function plain(text: string, notice: string, source: PaperSource): PaperRead {
  return { text, notice, source, trust: null, error: null };
}

function failed(error: string, source: PaperSource): PaperRead {
  return { text: "", notice: "", source, trust: null, error };
}

export function isPhotoFile(file: { type: string; name: string }): boolean {
  const name = file.name.toLowerCase();
  return file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|heic|heif)$/.test(name);
}

export async function readPaper(
  file: File,
  onStatus?: (message: string) => void,
): Promise<PaperRead> {
  if (isPhotoFile(file)) {
    const { readPhoto } = await import("./readPhoto");
    return readPhoto(file, onStatus);
  }

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    try {
      const text = await pdfText(file);
      if (!text.trim()) {
        return failed(
          "That PDF has no text we can read. It may be a picture of a page. Type the lines. The file was not uploaded.",
          "pdf",
        );
      }
      return plain(text, "Read the PDF text on this phone. The file was not uploaded.", "pdf");
    } catch {
      return failed("Couldn't read that PDF here. Paste the text. The file was not uploaded.", "pdf");
    }
  }

  try {
    const text = await file.text();
    return plain(text, "Read the file on this phone. It was not uploaded.", "text");
  } catch {
    return failed("Couldn't read that file. Paste the text. Nothing was uploaded.", "text");
  }
}

async function pdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs
    .getDocument({ data, standardFontDataUrl: "/pdfjs/standard_fonts/" })
    .promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => {
        if (item && typeof item === "object" && "str" in item && typeof item.str === "string") {
          return item.str;
        }
        return "";
      })
      .join(" ");
    parts.push(line);
  }
  return parts.join("\n");
}
