// Cuts the round emblem out of brand/emblem-source.jpg (white background
// removed, staff tip kept) and writes the logo files used by the site:
//   public/brand/logo-{96,192,256,512}.webp, brand/logo-512.png (for og.png),
//   public/favicon-32.png, public/favicon-64.png, public/apple-touch-icon.png
//
//   node scripts/make-logo.mjs [source.jpg]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = process.argv[2] ?? path.join(ROOT, 'brand/emblem-source.jpg');

// 1. find the emblem: bounding box of everything that is not near-white
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 3;
  if (data[i] + data[i + 1] + data[i + 2] < 690) {
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
}
const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
const R = Math.max(maxX - minX, maxY - minY) / 2; // radius of the gold ring
const S = Math.ceil(R * 2 + 8); // square crop with a little margin
const x0 = Math.round(cx - S / 2), y0 = Math.round(cy - S / 2);

// 2. alpha: inside the ring everything stays; outside it only what is not white
const out = Buffer.alloc(S * S * 4);
for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
  const sx = x0 + x, sy = y0 + y, o = (y * S + x) * 4;
  if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
  const i = (sy * W + sx) * 3;
  let [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  const d = Math.hypot(sx - cx, sy - cy);
  let a = 255;
  if (d > R - 2) {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    a = Math.max(0, Math.min(255, Math.round(((250 - lum) / 70) * 255)));
    if (a > 0 && a < 255) {
      // remove the white matte from anti-aliased edge pixels
      const f = a / 255;
      [r, g, b] = [r, g, b].map((c) => Math.max(0, Math.min(255, Math.round((c - 255 * (1 - f)) / f))));
    }
  }
  out[o] = r; out[o + 1] = g; out[o + 2] = b; out[o + 3] = a;
}
const master = sharp(out, { raw: { width: S, height: S, channels: 4 } });
const png = await master.png().toBuffer();

fs.mkdirSync(path.join(ROOT, 'public/brand'), { recursive: true });
for (const w of [96, 192, 256, 512]) {
  await sharp(png).resize(w, w).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(ROOT, `public/brand/logo-${w}.webp`));
}
await sharp(png).resize(512, 512).png().toFile(path.join(ROOT, 'brand/logo-512.png'));
for (const w of [32, 64]) await sharp(png).resize(w, w).png().toFile(path.join(ROOT, `public/favicon-${w}.png`));
// Apple touch icon: emblem on the cream tone of its own background
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#f7f3e6' } })
  .composite([{ input: await sharp(png).resize(164, 164).png().toBuffer(), top: 8, left: 8 }])
  .png().toFile(path.join(ROOT, 'public/apple-touch-icon.png'));
console.log(`Emblem: centre ${cx.toFixed(0)},${cy.toFixed(0)}  radius ${R.toFixed(0)}  →  ${S}px master`);
