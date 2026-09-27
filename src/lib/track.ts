"use client";

const CLIENT_EVENTS = new Set(["link_open", "check_start", "check_complete"]);

/** One first-party note per browser session. The server folds duplicates again. */
export function trackSeat(name: "link_open" | "check_start" | "check_complete", detail?: "sample" | "own") {
  if (!CLIENT_EVENTS.has(name)) return;
  const key = `n86-track:${name}:${detail || ""}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    /* Private mode can block storage. The post still runs. */
  }
  const params = new URLSearchParams(window.location.search);
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      detail: detail || null,
      source: params.get("utm_source") || params.get("ref") || "x",
    }),
  }).catch(() => undefined);
}
