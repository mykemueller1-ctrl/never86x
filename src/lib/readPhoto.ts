import { moneyWordConfidence, photoDecision, type PhotoTrust } from "./photoHonesty";
import type { PaperRead } from "./readPaper";

type OcrWord = { text: string; confidence: number };

type OcrBlock = {
  paragraphs?: { lines?: { words?: OcrWord[] }[] }[];
};

type OcrPage = {
  text?: string;
  confidence?: number;
  blocks?: OcrBlock[] | null;
};

export function wordsFromPage(page: OcrPage): OcrWord[] {
  const words: OcrWord[] = [];
  for (const block of page.blocks ?? []) {
    for (const paragraph of block.paragraphs ?? []) {
      for (const line of paragraph.lines ?? []) {
        for (const word of line.words ?? []) {
          if (word && typeof word.text === "string" && typeof word.confidence === "number") {
            words.push({ text: word.text, confidence: word.confidence });
          }
        }
      }
    }
  }
  return words;
}

export function paperFromOcr(page: OcrPage): PaperRead {
  const text = (page.text ?? "").trim();
  const words = wordsFromPage(page);
  const confidence = typeof page.confidence === "number" ? page.confidence : null;
  const trust: PhotoTrust = {
    confidence,
    moneyConfidence: moneyWordConfidence(words),
  };
  if (!text) {
    return {
      text: "",
      notice: "",
      source: "photo",
      trust: null,
      error: "That photo had no words. Type the lines. The picture was not uploaded.",
    };
  }
  const decision = photoDecision(trust);
  const score = trust.moneyConfidence ?? trust.confidence;
  const rounded = score == null ? null : Math.round(score);
  if (decision === "refuse") {
    const why =
      rounded == null
        ? "The photo reader returned no confidence score, so no price from it is shown."
        : `Photo confidence ${rounded}% is too low to price. Type the lines. No dollar was filled in.`;
    return {
      text,
      notice: `${why} The picture was not uploaded.`,
      source: "photo",
      trust,
      error: why,
    };
  }
  const notice =
    decision === "low"
      ? `Low confidence (${rounded}%). The photo stayed on this phone. Check every digit. Not Verified. The picture was not uploaded.`
      : `Read the photo on this phone at ${rounded}% confidence. Check the numbers. Not Verified. The picture was not uploaded.`;
  return { text, notice, source: "photo", trust, error: null };
}

let statusListener: (message: string) => void = () => {};
let workerPromise: Promise<{ recognize: Recognize; terminate: () => Promise<unknown> }> | null = null;

type Recognize = (
  image: Blob,
  options: Record<string, never>,
  output: { blocks: boolean },
) => Promise<{ data: OcrPage }>;

function workerOptions() {
  const logger = (message: { status?: string; progress?: number }) => {
    if (message.status === "recognizing text" && typeof message.progress === "number") {
      statusListener(`Reading the photo on this phone… ${Math.round(message.progress * 100)}%`);
      return;
    }
    if (message.status) statusListener("Loading the photo reader on this phone…");
  };
  if (typeof window === "undefined") return { logger };
  return {
    logger,
    workerPath: "/tesseract/worker.min.js",
    corePath: "/tesseract/core",
    langPath: "/tesseract/lang",
    gzip: true,
    workerBlobURL: false,
  };
}

async function getWorker() {
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker } = await import("tesseract.js");
      return createWorker("eng", 1, workerOptions());
    })().catch((error: unknown) => {
      workerPromise = null;
      throw error;
    });
  }
  return workerPromise;
}

/** Lazy. The tesseract chunk loads only after a photo is chosen. */
export async function readPhoto(file: Blob, onStatus?: (message: string) => void): Promise<PaperRead> {
  statusListener = onStatus ?? (() => {});
  statusListener("Loading the photo reader on this phone. The picture is not uploaded.");
  try {
    const worker = await getWorker();
    const result = await worker.recognize(file, {}, { blocks: true });
    return paperFromOcr(result.data);
  } catch {
    workerPromise = null;
    return {
      text: "",
      notice: "",
      source: "photo",
      trust: null,
      error: "Couldn't read that photo. Type the lines. The picture was not uploaded.",
    };
  }
}
