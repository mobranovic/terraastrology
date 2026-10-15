// Builds public/data/cities.json for the birth-place search on /free-forecast/.
//
//   node scripts/build-cities.mjs
//
// Source: GeoNames (CC BY 4.0) via the `all-the-cities` package; time zones
// from coordinates via `@photostructure/tz-lookup`. Worldwide we keep places
// with 15 000+ inhabitants, in Croatia and the neighbouring countries every
// place from 1 000 inhabitants.
// Output: { tz: [zone names], c: [[name, country, lat, lon, tzIndex]] }, largest places first.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cities = require('all-the-cities');
const tzlookup = require('@photostructure/tz-lookup');

const REGION = new Set(['HR', 'BA', 'RS', 'SI', 'ME', 'MK', 'AT', 'HU']);
const zones = [];
const zoneIndex = new Map();
const rows = [];

for (const c of cities) {
  if (c.population < (REGION.has(c.country) ? 1000 : 15000)) continue;
  const [lon, lat] = c.loc.coordinates;
  const tz = tzlookup(lat, lon);
  if (!zoneIndex.has(tz)) {
    zoneIndex.set(tz, zones.length);
    zones.push(tz);
  }
  rows.push([c.name, c.country, +lat.toFixed(3), +lon.toFixed(3), zoneIndex.get(tz), c.population]);
}
rows.sort((a, b) => b[5] - a[5]);
rows.forEach((r) => r.pop());

const out = path.resolve(import.meta.dirname, '../public/data/cities.json');
fs.writeFileSync(out, JSON.stringify({ tz: zones, c: rows }));
console.log(`${rows.length} places, ${zones.length} time zones → ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
