// Downloads every image listed in src/data/media-manifest.json from the old
// WordPress site into public/wp-content/uploads/ (same paths as before, so old
// image links keep working). Safe to re-run: existing files are skipped.
//
//   npm run fetch:media

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OLD_SITE = 'https://www.terraastrology.com';
const list = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/media-manifest.json'), 'utf8'));

let ok = 0, skipped = 0;
const failed = [];
const queue = [...list];

async function worker() {
  for (let p; (p = queue.shift()); ) {
    const dest = path.join(ROOT, 'public', decodeURI(p));
    if (fs.existsSync(dest)) { skipped++; continue; }
    try {
      const res = await fetch(OLD_SITE + p);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      ok++;
    } catch (e) {
      failed.push(`${p} (${e.message})`);
    }
  }
}

await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Downloaded ${ok}, already present ${skipped}, failed ${failed.length}.`);
if (failed.length) console.log(failed.map((f) => '  ' + f).join('\n'));
