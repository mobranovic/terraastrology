// Builds the free "year ahead" summary: the strongest transits of the slow
// planets, the progressed Moon, the progressed lunation phase (Rudhyar) and
// the progressed Sun – composed into 5–10 sentences from texts.ts.
import {
  ASPECTS, DAY, YEAR, houseOf, lonAt, localToUT, natalChart, norm, progressed, transitHits, w180,
  type BodyKey, type Hit, type Natal, type PointKey,
} from './engine';
import {
  ASPECT_VERB, CLOSING, HOUSE_AREA, LUNATION_PHASE, OPENING, POINT_AREA, POINT_NAME,
  PROGRESSED_MOON_SIGN, SIGN_NAMES, TRANSIT, family,
} from './texts';

export interface BirthInput {
  date: string; // YYYY-MM-DD
  time: string | null; // HH:MM, null when unknown
  lat: number;
  lon: number;
  tz: string;
}

export interface Forecast {
  timeKnown: boolean;
  sun: string;
  moon: string;
  asc: string | null;
  sentences: string[];
  /** The same sentences grouped for display: intro, transits, cycles, closing. */
  paragraphs: string[][];
  keyDates: { label: string; when: string; ms: number }[];
}

const sign = (lon: number) => SIGN_NAMES[Math.floor(norm(lon) / 30)];
const ord = (n: number) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`;
const month = (ms: number) => new Date(ms).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const year = (ms: number) => new Date(ms).getUTCFullYear();

const BODY_WEIGHT: Partial<Record<BodyKey, number>> = { Pluto: 5, Neptune: 4.5, Uranus: 4.5, Saturn: 4, Jupiter: 3 };
const TARGET_WEIGHT: Partial<Record<PointKey, number>> = { Sun: 3, Moon: 3, ASC: 3, MC: 3, Venus: 2, Mars: 2, Mercury: 1.5, Jupiter: 1, Saturn: 1.5 };
const ASPECT_WEIGHT = { conjunction: 3, opposition: 2.5, square: 2.5, trine: 1.8, sextile: 1.2 };

function describeWhen(list: Hit[], now: number) {
  const months = [...new Set(list.map((h) => month(h.ms)))];
  const started = list[0].ms < now;
  if (months.length === 1) return started ? `exact in ${months[0]} and still active` : `exact in ${months[0]}`;
  const sameYear = new Set(list.map((h) => year(h.ms))).size === 1;
  if (sameYear) {
    const names = months.map((m) => m.replace(/ \d{4}$/, ''));
    return `exact in ${names.slice(0, -1).join(', ')} and ${names.at(-1)} ${year(list[0].ms)}`;
  }
  return `between ${months[0]} and ${months.at(-1)}`;
}

function strongestTransits(nat: Natal, now: number) {
  const hits = transitHits(nat, now - 45 * DAY, 410, ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']).filter(
    (h) => h.ms <= now + 365 * DAY && POINT_AREA[h.target.k],
  );
  const groups = new Map<string, Hit[]>();
  for (const h of hits) {
    const key = `${h.body}|${h.target.k}|${h.aspect}`;
    groups.set(key, [...(groups.get(key) ?? []), h]);
  }
  return [...groups.values()]
    .map((list) => {
      const h = list[0];
      const score = (BODY_WEIGHT[h.body] ?? 1) * (TARGET_WEIGHT[h.target.k] ?? 1) * ASPECT_WEIGHT[h.aspect];
      return { list, h, score };
    })
    .sort((a, b) => b.score - a.score);
}

/** Month when a slow planet next crosses into another natal house (within ~13 months). */
function houseExit(body: BodyKey, houses: number[], now: number) {
  const start = houseOf(lonAt(body, now), houses);
  for (let d = 7; d <= 400; d += 7) {
    if (houseOf(lonAt(body, now + d * DAY), houses) !== start) return now + d * DAY;
  }
  return null;
}

function lunationPhase(nat: Natal, now: number) {
  const elong = (ms: number) => {
    const p = progressed(nat, ms).planets;
    return norm(p[1].lon - p[0].lon);
  };
  const e = elong(now);
  const idx = Math.floor(e / 45);
  const inPhase = (ms: number) => Math.floor(elong(ms) / 45) === idx;
  let from = now, to = now;
  for (let i = 0; i < 72 && inPhase(from - 30 * DAY); i++) from -= 30 * DAY;
  for (let i = 0; i < 72 && inPhase(to + 30 * DAY); i++) to += 30 * DAY;
  return { idx, from, to };
}

export function computeForecast(input: BirthInput, now = Date.now()): Forecast {
  const [y, m, d] = input.date.split('-').map(Number);
  const timeKnown = !!input.time;
  const [hh, mi] = (input.time ?? '12:00').split(':').map(Number);
  const ut = localToUT(y, m, d, hh, mi, input.tz);
  const nat = natalChart(ut, input.lat, input.lon, timeKnown);
  // [priority, sentence] – lower priority numbers are dropped first when there are too many.
  const body: [number, string, number][] = [];
  let group = 0;
  const say = (priority: number, text: string) => body.push([priority, text, group]);
  const keyDates: Forecast['keyDates'] = [];

  // Sun, Moon, Ascendant
  const sun = sign(nat.planets[0].lon);
  let moon = sign(nat.planets[1].lon);
  if (!timeKnown) {
    const early = sign(lonAt('Moon', localToUT(y, m, d, 0, 0, input.tz)));
    const late = sign(lonAt('Moon', localToUT(y, m, d, 23, 59, input.tz)));
    if (early !== late) moon = `${early} or ${late}`;
  }
  const asc = nat.asc != null ? sign(nat.asc) : null;
  say(9,
    `Your Sun is in ${sun}, your Moon in ${moon}${asc ? ` and your Ascendant in ${asc}` : ''}${
      moon.includes(' or ') ? ' — the exact birth time decides the Moon' : ''
    }.`,
  );

  // Transits
  group = 1;
  // The three strongest, each touching a different natal point, in date order.
  const transits: ReturnType<typeof strongestTransits> = [];
  for (const t of strongestTransits(nat, now)) {
    if (transits.length < 3 && !transits.some((x) => x.h.target.k === t.h.target.k)) transits.push(t);
  }
  transits.sort((a, b) => a.list[0].ms - b.list[0].ms);
  for (const { list, h } of transits) {
    const when = describeWhen(list, now);
    say(8,
      `${h.body} ${ASPECT_VERB[h.aspect]} your natal ${POINT_NAME[h.target.k]} (${when}) — this ${TRANSIT[h.body][family(h.aspect)]} ${POINT_AREA[h.target.k]}.`,
    );
    keyDates.push({ label: `${h.body} ${h.aspect} natal ${POINT_NAME[h.target.k]}`, when: when.replace(/^exact in /, ''), ms: list[0].ms });
  }

  // Jupiter (and Saturn, if not already among the transits) through the houses
  if (nat.houses) {
    const jh = houseOf(lonAt('Jupiter', now), nat.houses)!;
    const exit = houseExit('Jupiter', nat.houses, now);
    say(5,
      `Jupiter's passage through your ${ord(jh)} house${exit ? ` (until about ${month(exit)})` : ''} favours growth in ${HOUSE_AREA[jh - 1]}.`,
    );
    if (!transits.some((t) => t.h.body === 'Saturn')) {
      const sh = houseOf(lonAt('Saturn', now), nat.houses)!;
      say(2, `Saturn in your ${ord(sh)} house asks for patience and steady work in ${HOUSE_AREA[sh - 1]}.`);
    }
  }

  // Progressed Moon
  group = 2;
  const pNow = progressed(nat, now);
  const pm = pNow.planets[1].lon;
  const pmSign = Math.floor(pm / 30);
  const pmHouse = houseOf(pm, nat.houses);
  say(7,
    `Your progressed Moon — the inner clock of your emotional life — is ${timeKnown ? '' : 'roughly '}in ${SIGN_NAMES[pmSign]}${
      pmHouse ? ` and your ${ord(pmHouse)} house` : ''
    }: ${PROGRESSED_MOON_SIGN[pmSign]}${pmHouse ? `, with the focus on ${HOUSE_AREA[pmHouse - 1]}` : ''}.`,
  );
  for (let i = 1; i <= 12 && timeKnown; i++) {
    const ms = now + i * 30.44 * DAY;
    const s = Math.floor(progressed(nat, ms).planets[1].lon / 30);
    if (s !== pmSign) {
      say(4, `Around ${month(ms)} it moves into ${SIGN_NAMES[s]}, opening ${PROGRESSED_MOON_SIGN[s]}.`);
      keyDates.push({ label: `Progressed Moon enters ${SIGN_NAMES[s]}`, when: month(ms), ms });
      break;
    }
  }

  // Progressed lunation phase
  const ph = lunationPhase(nat, now);
  const [phaseName, phaseText] = LUNATION_PHASE[ph.idx];
  if (ph.to - now < 365 * DAY) {
    const [nextName, nextText] = LUNATION_PHASE[(ph.idx + 1) % 8];
    say(6,
      `Your progressed lunation cycle is closing its ${phaseName} phase, and around ${month(ph.to)} the ${nextName} phase begins: ${nextText}.`,
    );
    keyDates.push({ label: `${nextName} phase of the progressed lunation cycle`, when: month(ph.to), ms: ph.to });
  } else {
    say(6,
      `You are in the ${phaseName} phase of your progressed lunation cycle (about ${year(ph.from)}–${year(ph.to)}): ${phaseText}.`,
    );
  }

  // Progressed Sun: change of sign within two years, or a close aspect to a natal point
  const ps = pNow.planets[0].lon;
  const psNext = progressed(nat, now + 2 * YEAR * DAY).planets[0].lon;
  if (Math.floor(psNext / 30) !== Math.floor(ps / 30)) {
    const deg = 30 - (ps % 30);
    const ms = now + (deg / 0.9856) * YEAR * DAY;
    say(3,
      `In ${year(ms)} your progressed Sun moves into ${sign(psNext)}, a shift of emphasis that will colour the next thirty years.`,
    );
  } else {
    const targets = [...nat.planets.slice(1), ...(nat.asc != null ? [{ k: 'ASC' as const, lon: nat.asc }, { k: 'MC' as const, lon: nat.mc! }] : [])];
    let best: { k: PointKey; aspect: (typeof ASPECTS)[number]['name']; orb: number } | null = null;
    for (const t of targets) {
      if (!POINT_AREA[t.k]) continue;
      for (const a of ASPECTS) {
        const orb = Math.abs(Math.abs(w180(ps - t.lon)) - a.angle);
        if (orb <= 1 && (!best || orb < best.orb)) best = { k: t.k, aspect: a.name, orb };
      }
    }
    if (best) {
      say(3,
        `Your progressed Sun ${ASPECT_VERB[best.aspect]} your natal ${POINT_NAME[best.k]}, a theme that unfolds over a couple of years and touches ${POINT_AREA[best.k]}.`,
      );
    }
  }

  // At most 8 sentences between the opening and the closing line (10 in total).
  while (body.length > 8) {
    const lowest = body.reduce((iMin, x, i) => (x[0] < body[iMin][0] ? i : iMin), 0);
    body.splice(lowest, 1);
  }
  const sentences = [OPENING, ...body.map(([, text]) => text), CLOSING];
  const paragraphs = [
    [OPENING, ...body.filter((b) => b[2] === 0).map((b) => b[1])],
    body.filter((b) => b[2] === 1).map((b) => b[1]),
    body.filter((b) => b[2] === 2).map((b) => b[1]),
    [CLOSING],
  ].filter((p) => p.length);
  keyDates.sort((a, b) => a.ms - b.ms);
  return { timeKnown, sun, moon, asc, sentences, paragraphs, keyDates };
}
