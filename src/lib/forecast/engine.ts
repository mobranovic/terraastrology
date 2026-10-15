// Astronomy for the free forecast, ported from Natalni Atlas (index.html):
// local time → UT with historical time zones, geocentric tropical longitudes,
// Placidus houses, secondary progressions and exact transit hits.
import * as A from 'astronomy-engine';

export const rad = Math.PI / 180;
export const DAY = 864e5;
export const YEAR = 365.24219;
export const norm = (x: number) => ((x % 360) + 360) % 360;
export const w180 = (x: number) => {
  x = norm(x);
  return x > 180 ? x - 360 : x;
};

export const BODIES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'] as const;
export type BodyKey = (typeof BODIES)[number];
export type PointKey = BodyKey | 'ASC' | 'MC';
export interface Point { k: PointKey; lon: number; house?: number | null }

/* ---------- time ---------- */
export function tzOffsetMin(tz: string, ms: number) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p: Record<string, string> = {};
  for (const x of f.formatToParts(new Date(ms))) p[x.type] = x.value;
  return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - ms) / 60000);
}

export function localToUT(y: number, mo: number, d: number, h: number, mi: number, tz: string) {
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  let off = tzOffsetMin(tz, guess);
  let ut = guess - off * 60000;
  const off2 = tzOffsetMin(tz, ut);
  if (off2 !== off) {
    off = off2;
    ut = guess - off * 60000;
  }
  return ut;
}

/* ---------- positions ---------- */
const mkT = (ms: number) => A.MakeTime(new Date(ms));
const oblOf = (t: A.AstroTime) => A.e_tilt(t).tobl * rad;

function lonOf(body: BodyKey, t: A.AstroTime, eps: number) {
  const v = A.RotateVector(A.Rotation_EQJ_EQD(t), A.GeoVector(body as A.Body, t, true));
  return norm(Math.atan2(v.y * Math.cos(eps) + v.z * Math.sin(eps), v.x) / rad);
}

export const lonAt = (body: BodyKey, ms: number) => {
  const t = mkT(ms);
  return lonOf(body, t, oblOf(t));
};

export function planetsAt(ms: number): Point[] {
  const t = mkT(ms);
  const eps = oblOf(t);
  return BODIES.map((k) => ({ k, lon: lonOf(k, t, eps) }));
}

const raOf = (l: number, eps: number) => norm(Math.atan2(Math.sin(l * rad) * Math.cos(eps), Math.cos(l * rad)) / rad);

/** Placidus houses (equal houses above 66° latitude, as in Natalni Atlas). */
export function housesFrom(ramcDeg: number, lat: number, eps: number) {
  const ramc = ramcDeg * rad;
  const phi = lat * rad;
  const asc = norm(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) / rad);
  const mc = norm(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)) / rad);
  if (Math.abs(lat) > 66) return { asc, mc, houses: [...Array(12)].map((_, i) => norm(asc + 30 * i)) };
  const cusp = (f: number, below: boolean) => {
    let ra = ramc + (below ? Math.PI : 0) + (below ? -1 : 1) * (f * Math.PI) / 2;
    let lam = 0;
    for (let i = 0; i < 30; i++) {
      lam = Math.atan2(Math.sin(ra), Math.cos(ra) * Math.cos(eps));
      const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
      const ad = Math.asin(Math.max(-1, Math.min(1, Math.tan(phi) * Math.tan(dec))));
      ra = below ? ramc + Math.PI - f * (Math.PI / 2 - ad) : ramc + f * (Math.PI / 2 + ad);
    }
    return norm(lam / rad);
  };
  const h11 = cusp(1 / 3, false), h12 = cusp(2 / 3, false), h2 = cusp(2 / 3, true), h3 = cusp(1 / 3, true);
  const houses = [asc, h2, h3, norm(mc + 180), norm(h11 + 180), norm(h12 + 180), norm(asc + 180), norm(h2 + 180), norm(h3 + 180), mc, h11, h12];
  return { asc, mc, houses };
}

export function houseOf(lon: number, houses: number[] | null) {
  if (!houses) return null;
  for (let i = 0; i < 12; i++) {
    const a = houses[i], b = houses[(i + 1) % 12];
    if (norm(lon - a) < norm(b - a)) return i + 1;
  }
  return null;
}

export interface Natal {
  ut: number;
  lat: number;
  eps: number;
  ramc: number | null;
  planets: Point[];
  asc: number | null;
  mc: number | null;
  houses: number[] | null;
}

export function natalChart(ut: number, lat: number, lon: number, timeKnown: boolean): Natal {
  const t = mkT(ut);
  const eps = oblOf(t);
  const planets = planetsAt(ut);
  if (!timeKnown) return { ut, lat, eps, ramc: null, planets, asc: null, mc: null, houses: null };
  const ramc = norm(A.SiderealTime(t) * 15 + lon);
  const H = housesFrom(ramc, lat, eps);
  planets.forEach((p) => (p.house = houseOf(p.lon, H.houses)));
  return { ut, lat, eps, ramc, planets, ...H };
}

/** Secondary progressions (a day for a year); angles by solar arc in RA. */
export function progressed(nat: Natal, ms: number) {
  const pms = nat.ut + ((ms - nat.ut) / DAY / YEAR) * DAY;
  const planets = planetsAt(pms);
  let angles: { asc: number; mc: number } | null = null;
  if (nat.ramc != null) {
    const arc = norm(raOf(planets[0].lon, nat.eps) - raOf(nat.planets[0].lon, nat.eps));
    const H = housesFrom(norm(nat.ramc + arc), nat.lat, nat.eps);
    angles = { asc: H.asc, mc: H.mc };
  }
  return { planets, angles };
}

export const ASPECTS = [
  { angle: 0, name: 'conjunction' },
  { angle: 60, name: 'sextile' },
  { angle: 90, name: 'square' },
  { angle: 120, name: 'trine' },
  { angle: 180, name: 'opposition' },
] as const;
export type AspectName = (typeof ASPECTS)[number]['name'];

export interface Hit { ms: number; body: BodyKey; target: Point; aspect: AspectName }

/** Exact transit hits of the slow planets to natal points (daily scan, as in Natalni Atlas). */
export function transitHits(nat: Natal, startMs: number, days: number, bodies: BodyKey[]): Hit[] {
  const targets: Point[] = [...nat.planets];
  if (nat.asc != null && nat.mc != null) targets.push({ k: 'ASC', lon: nat.asc }, { k: 'MC', lon: nat.mc });
  const t0 = mkT(startMs);
  const eps = oblOf(t0);
  const out: Hit[] = [];
  const signed: [number, number][] = [[0, 1], [60, 1], [60, -1], [90, 1], [90, -1], [120, 1], [120, -1], [180, 1]];
  for (const body of bodies) {
    const L: number[] = [];
    for (let i = 0; i <= days; i++) L.push(lonOf(body, mkT(startMs + i * DAY), eps));
    for (const tg of targets) {
      if (tg.k === body) continue;
      for (const [a, sg] of signed) {
        const pt = norm(tg.lon + sg * a);
        let prev = w180(L[0] - pt);
        for (let i = 1; i <= days; i++) {
          const cur = w180(L[i] - pt);
          if (Math.abs(prev) < 15 && Math.abs(cur) < 15 && ((prev <= 0 && cur > 0) || (prev >= 0 && cur < 0))) {
            const fr = prev / (prev - cur);
            out.push({ ms: startMs + (i - 1 + fr) * DAY, body, target: tg, aspect: ASPECTS.find((x) => x.angle === a)!.name });
          }
          prev = cur;
        }
      }
    }
  }
  return out.sort((x, y) => x.ms - y.ms);
}
