import React, { type ReactNode } from "react";
import { ImageResponse } from "next/og";
import { BRAND, SHARE_LINE, SHARE_TITLE, SITE } from "@/lib/brand";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const INK = "#17191c";
const RUST = "#c2410c";
const CREAM = "#f7f3ee";
const MUTED = "#d4cdc4";
const HOST = SITE.replace("https://", "");

function shell(body: ReactNode) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          color: CREAM,
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", width: 18, height: 18, borderRadius: 4, background: RUST, marginRight: 16 }} />
            <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: 1.5 }}>{BRAND.toUpperCase()}</div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: MUTED }}>{HOST}</div>
        </div>
        {body}
      </div>
    ),
    { ...ogSize },
  );
}

export function shareCard() {
  const parts = SHARE_TITLE.match(/^(.+?\.)\s+(.+)$/);
  const lead = parts?.[1] ?? SHARE_TITLE;
  const accent = parts?.[2] ?? "";
  return shell(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1, marginTop: 36 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>{lead}</div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1, color: RUST, marginTop: 6 }}>
          {accent}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", width: 84, height: 8, background: RUST, borderRadius: 99, marginBottom: 22 }} />
        <div style={{ display: "flex", fontSize: 32, fontWeight: 600 }}>{SHARE_LINE}</div>
        <div style={{ display: "flex", fontSize: 24, color: MUTED, marginTop: 12 }}>Independent restaurants with 1–5 units.</div>
      </div>
    </div>,
  );
}

export function ogCard(kicker: string, title: string, line: string) {
  return shell(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", flexGrow: 1 }}>
      <div style={{ display: "flex", fontSize: 22, fontWeight: 700, letterSpacing: 3, color: RUST }}>{kicker}</div>
      <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1, marginTop: 16 }}>{title}</div>
      <div style={{ display: "flex", fontSize: 30, color: MUTED, marginTop: 28 }}>{line}</div>
    </div>,
  );
}
