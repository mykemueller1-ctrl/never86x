"use client";

import { useState } from "react";
import { photoDecision, type PhotoTrust } from "@/lib/photoHonesty";
import { readPaper } from "@/lib/readPaper";

type Held = { text: string; trust: PhotoTrust; blocked: boolean };

export function usePaperSlot() {
  const [reading, setReading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [held, setHeld] = useState<Held | null>(null);

  function trustFor(text: string): PhotoTrust | null {
    if (!held || held.blocked || held.text !== text) return null;
    return held.trust;
  }

  function blocked(text: string): boolean {
    return !!held && held.blocked && held.text === text;
  }

  async function read(file: File | undefined): Promise<string | null> {
    if (!file) return null;
    setReading(true);
    setError(null);
    setNotice("Reading on this phone. Nothing is uploaded.");
    try {
      const paper = await readPaper(file, setNotice);
      if (paper.error && !paper.text) {
        setHeld(null);
        setNotice(null);
        setError(paper.error);
        return null;
      }
      if (paper.source === "photo" && paper.trust && photoDecision(paper.trust) === "refuse") {
        setHeld({ text: paper.text, trust: paper.trust, blocked: true });
        setNotice(null);
        setError(paper.error ?? paper.notice);
        return paper.text;
      }
      if (paper.source === "photo" && paper.trust) {
        setHeld({ text: paper.text, trust: paper.trust, blocked: false });
      } else {
        setHeld(null);
      }
      setNotice(paper.notice);
      setError(null);
      return paper.text;
    } catch {
      setHeld(null);
      setNotice(null);
      setError("Couldn't read that file. Paste the text. Nothing was uploaded.");
      return null;
    } finally {
      setReading(false);
    }
  }

  function reset() {
    setNotice(null);
    setError(null);
    setHeld(null);
  }

  return { reading, notice, error, read, trustFor, blocked, reset };
}
