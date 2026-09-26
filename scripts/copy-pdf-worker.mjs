import { cpSync, copyFileSync, existsSync, mkdirSync } from "node:fs";

const worker = "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs";
const fonts = "node_modules/pdfjs-dist/standard_fonts";

if (!existsSync(worker)) {
  console.warn("pdf.js legacy worker not found; PDF text reads will ask the owner to paste.");
  process.exit(0);
}

copyFileSync(worker, "public/pdf.worker.min.mjs");

if (existsSync(fonts)) {
  mkdirSync("public/pdfjs", { recursive: true });
  cpSync(fonts, "public/pdfjs/standard_fonts", { recursive: true });
}
