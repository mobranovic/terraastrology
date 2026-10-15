// Creates resized WebP copies of the uploaded images for cards, covers and
// articles: public/thumbs/<width>/<original path>.webp. Runs before every
// build (see package.json); existing files are skipped, so it is fast.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const WIDTHS = [640, 1280];
const list = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/media-manifest.json'), 'utf8'));

let made = 0;
for (const p of list) {
  if (!/\.(jpe?g|png|webp)$/i.test(p)) continue;
  const src = path.join(PUBLIC, decodeURI(p));
  if (!fs.existsSync(src)) continue;
  for (const w of WIDTHS) {
    const dest = path.join(PUBLIC, 'thumbs', String(w), decodeURI(p) + '.webp');
    if (fs.existsSync(dest)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest);
    made++;
  }
}
console.log(`Thumbnails: ${made} created.`);
