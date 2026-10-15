import fs from 'node:fs';
import path from 'node:path';

// Old uploads live in public/wp-content/uploads/ once `npm run fetch:media`
// has run. Until then (or for any file that failed to download) we keep
// pointing at the old WordPress server so nothing appears broken.
const PUBLIC = path.resolve('public');
const OLD_SITE = 'https://www.terraastrology.com';

export function mediaUrl(src) {
  if (!src || !src.startsWith('/wp-content/')) return src;
  return fs.existsSync(path.join(PUBLIC, decodeURI(src))) ? src : OLD_SITE + src;
}

/** Resized WebP copy made by scripts/make-thumbs.mjs (falls back to the original). */
export function thumbUrl(src, width = 640) {
  if (!src || !src.startsWith('/wp-content/')) return src;
  const thumb = `/thumbs/${width}${src}.webp`;
  return fs.existsSync(path.join(PUBLIC, decodeURI(thumb))) ? thumb : mediaUrl(src);
}
