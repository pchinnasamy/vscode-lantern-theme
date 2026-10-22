/*
 * Draws icon.png (256x256): a gold lantern glowing on a Nightshade tile.
 * Pure Node (zlib only). Run `node scripts/make-icon.js` after changing it.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZE = 256;
const SS = 4; // supersampling per axis

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const TOP = hex('#1d2045');
const BOTTOM = hex('#070c18');
const GOLD = hex('#ffd75f');
const GOLD_CORE = hex('#fff1c2');
const FRAME = hex('#8a9cff');

// Signed-distance helpers (negative = inside).
const roundRect = (x, y, cx, cy, hw, hh, r) => {
  const qx = Math.abs(x - cx) - hw + r;
  const qy = Math.abs(y - cy) - hh + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
};
const ring = (x, y, cx, cy, r, w) => Math.abs(Math.hypot(x - cx, y - cy) - r) - w / 2;

const blend = (dst, src, a) => dst.map((v, i) => v + (src[i] - v) * a);

// Returns [r, g, b, a] for a point in 0..256 space.
function shade(x, y) {
  // Rounded tile with a vertical gradient
  if (roundRect(x, y, 128, 128, 128, 128, 56) > 0) return [0, 0, 0, 0];
  let c = blend(TOP, BOTTOM, y / SIZE);

  // Warm glow around the lantern
  const d = Math.hypot(x - 128, y - 146) / 112;
  if (d < 1) c = blend(c, GOLD, 0.42 * Math.pow(1 - d, 2.2));

  // Handle (upper half of a ring)
  if (y < 74 && ring(x, y, 128, 74, 20, 7) < 0) c = FRAME;
  // Cap
  if (roundRect(x, y, 128, 90, 34, 9, 5) < 0) c = FRAME;
  // Glass body with a bright core
  if (roundRect(x, y, 128, 146, 28, 46, 14) < 0) {
    const core = Math.max(0, 1 - Math.hypot((x - 128) / 22, (y - 146) / 36));
    c = blend(GOLD, GOLD_CORE, Math.pow(core, 1.4));
  }
  // Frame bars across the glass
  if (roundRect(x, y, 128, 146, 3, 46, 1) < 0) c = blend(c, FRAME, 0.55);
  // Base
  if (roundRect(x, y, 128, 200, 38, 9, 5) < 0) c = FRAME;

  return [...c, 255];
}

const raw = Buffer.alloc((SIZE * 4 + 1) * SIZE);
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0; // filter: none
  for (let x = 0; x < SIZE; x++) {
    const acc = [0, 0, 0, 0];
    for (let sy = 0; sy < SS; sy++) {
      for (let sx = 0; sx < SS; sx++) {
        const [r, g, b, a] = shade(x + (sx + 0.5) / SS, y + (sy + 0.5) / SS);
        acc[0] += r * a; acc[1] += g * a; acc[2] += b * a; acc[3] += a;
      }
    }
    const o = y * (SIZE * 4 + 1) + 1 + x * 4;
    const a = acc[3] / (SS * SS);
    raw[o] = a ? acc[0] / acc[3] : 0;
    raw[o + 1] = a ? acc[1] / acc[3] : 0;
    raw[o + 2] = a ? acc[2] / acc[3] : 0;
    raw[o + 3] = Math.round(a);
  }
}

// Minimal PNG writer
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // RGBA
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);

const dest = path.join(__dirname, '..', 'icon.png');
fs.writeFileSync(dest, png);
console.log(`wrote icon.png (${png.length} bytes)`);
