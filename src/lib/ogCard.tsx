import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function ogCard(kicker: string, title: string, line: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1a1f2e",
          color: "#ffffff",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#e85d04" }}>NEVER86</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#ffd7c2" }}>{kicker}</div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05, marginTop: 18 }}>
            {title}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#d7dbe6" }}>{line}</div>
      </div>
    ),
    { ...ogSize },
  );
}
