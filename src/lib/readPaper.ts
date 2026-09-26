"use client";

export type PaperRead = {
  text: string;
  notice: string;
};

const PHOTO =
  "This photo stayed on this phone. Type the lines. We don't read pictures, so we won't guess a price.";

export async function readPaper(file: File): Promise<PaperRead> {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|heic|heif)$/.test(name)) {
    return { text: "", notice: PHOTO };
  }

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    try {
      const text = await pdfText(file);
      if (!text.trim()) {
        return {
          text: "",
          notice:
            "That PDF has no text we can read. It may be a picture of a page. Type the lines. The file was not uploaded.",
        };
      }
      return { text, notice: "Read the PDF text on this phone. The file was not uploaded." };
    } catch {
      return {
        text: "",
        notice: "Couldn't read that PDF here. Paste the text. The file was not uploaded.",
      };
    }
  }

  const text = await file.text();
  return { text, notice: "Read the file on this phone. It was not uploaded." };
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
