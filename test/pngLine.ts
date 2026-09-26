import { deflateSync } from "node:zlib";

const FONT: Record<string, string[]> = {
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  $: ["00100", "01111", "10100", "01110", "00101", "11110", "00100"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "4": ["00100", "01100", "10100", "10100", "11111", "00100", "00100"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  o: ["00000", "00000", "01110", "10001", "10001", "10001", "01110"],
  z: ["00000", "00000", "11111", "00010", "00100", "01000", "11111"],
};

const CRC = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const body = Buffer.concat([Buffer.from(type), data]);
  const out = Buffer.alloc(8 + body.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), 4 + body.length);
  return out;
}

/** Black text on white, large enough for a photo reader. */
export function pngOf(text: string): Buffer {
  const scale = 14;
  const pad = 36;
  const glyphW = 5 * scale;
  const gap = 8;
  const height = pad * 2 + 7 * scale;
  const width = pad * 2 + text.length * glyphW + Math.max(0, text.length - 1) * gap;
  const raw = Buffer.alloc((width * 4 + 1) * height, 255);
  for (let y = 0; y < height; y += 1) raw[y * (width * 4 + 1)] = 0;

  let x0 = pad;
  for (const ch of text) {
    const rows = FONT[ch] ?? FONT[" "];
    rows.forEach((bits, row) => {
      for (let col = 0; col < bits.length; col += 1) {
        if (bits[col] !== "1") continue;
        for (let dy = 0; dy < scale; dy += 1) {
          for (let dx = 0; dx < scale; dx += 1) {
            const x = x0 + col * scale + dx;
            const y = pad + row * scale + dy;
            const i = y * (width * 4 + 1) + 1 + x * 4;
            raw[i] = 0;
            raw[i + 1] = 0;
            raw[i + 2] = 0;
            raw[i + 3] = 255;
          }
        }
      }
    });
    x0 += glyphW + gap;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  return png;
}
