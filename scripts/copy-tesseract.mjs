import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";

const worker = "node_modules/tesseract.js/dist/worker.min.js";
const coreDir = "public/tesseract/core";
const langDir = "public/tesseract/lang";
const langFile = `${langDir}/eng.traineddata.gz`;
const langUrl = "https://tessdata.projectnaptha.com/4.0.0/eng.traineddata.gz";

if (!existsSync(worker)) {
  console.warn("tesseract.js worker not found; photo reads will ask the owner to type.");
  process.exit(0);
}

mkdirSync(coreDir, { recursive: true });
copyFileSync(worker, "public/tesseract/worker.min.js");
const coreNames = readdirSync("node_modules/tesseract.js-core").filter((name) =>
  name.startsWith("tesseract-core"),
);
if (coreNames.length < 4) {
  console.warn("tesseract core builds are missing; photo reads will ask the owner to type.");
  process.exit(0);
}
for (const name of coreNames) {
  copyFileSync(`node_modules/tesseract.js-core/${name}`, `${coreDir}/${name}`);
}

mkdirSync(langDir, { recursive: true });
if (!existsSync(langFile) || statSync(langFile).size < 100_000) {
  const response = await fetch(langUrl);
  if (!response.ok) {
    console.warn("photo reader language file did not download; photos will ask the owner to type.");
    process.exit(0);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 100_000) {
    console.warn("photo reader language file was too small; photos will ask the owner to type.");
    process.exit(0);
  }
  writeFileSync(langFile, bytes);
}
