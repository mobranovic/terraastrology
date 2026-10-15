// Interpretation snippets for the free forecast. Edit freely – every sentence
// the visitor reads is assembled from these tables in forecast.ts.
import type { AspectName, PointKey } from './engine';

export const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export const POINT_NAME: Record<PointKey, string> = {
  Sun: 'Sun', Moon: 'Moon', Mercury: 'Mercury', Venus: 'Venus', Mars: 'Mars', Jupiter: 'Jupiter',
  Saturn: 'Saturn', Uranus: 'Uranus', Neptune: 'Neptune', Pluto: 'Pluto', ASC: 'Ascendant', MC: 'Midheaven',
};

/** What a natal point stands for – completes "… this brings X to ___". */
export const POINT_AREA: Partial<Record<PointKey, string>> = {
  Sun: 'your sense of purpose and identity',
  Moon: 'your emotional life, home and inner security',
  Mercury: 'the way you think, learn and communicate',
  Venus: 'your relationships, values and what you love',
  Mars: 'your drive and the way you go after what you want',
  Jupiter: 'your beliefs, hopes and sense of possibility',
  Saturn: 'your commitments, ambitions and boundaries',
  ASC: 'the way you meet the world and begin things',
  MC: 'your vocation, career and public direction',
};

export const ASPECT_VERB: Record<AspectName, string> = {
  conjunction: 'meets',
  opposition: 'opposes',
  square: 'squares',
  trine: 'trines',
  sextile: 'sextiles',
};

type Family = 'conj' | 'hard' | 'soft';
export const family = (a: AspectName): Family => (a === 'conjunction' ? 'conj' : a === 'trine' || a === 'sextile' ? 'soft' : 'hard');

/** What a transiting planet does – each phrase is followed by POINT_AREA. */
export const TRANSIT: Record<string, Record<Family, string>> = {
  Jupiter: {
    conj: 'brings growth and new possibilities to',
    hard: 'invites you to expand, but asks for a sense of measure in',
    soft: 'opens doors and brings support to',
  },
  Saturn: {
    conj: 'begins a new chapter of commitment and maturity in',
    hard: 'tests what is solid and asks you to restructure',
    soft: 'helps you build something lasting in',
  },
  Uranus: {
    conj: 'awakens and liberates',
    hard: 'brings sudden change and a strong need for freedom to',
    soft: 'brings fresh air and new ideas to',
  },
  Neptune: {
    conj: 'dissolves old certainties and brings inspiration to',
    hard: 'can blur the picture, and asks for honesty and trust in',
    soft: 'brings inspiration and intuition to',
  },
  Pluto: {
    conj: 'brings a deep and lasting transformation to',
    hard: 'brings pressure and a need to let go of what no longer serves in',
    soft: 'quietly empowers and deepens',
  },
};

export const HOUSE_AREA = [
  'you and your personal direction',
  'money, resources and self-worth',
  'learning, communication and your immediate surroundings',
  'home, family and your roots',
  'creativity, romance, children and joy',
  'work, daily routine and health',
  'partnership and close relationships',
  'intimacy, shared resources and deep change',
  'travel, study, beliefs and the bigger picture',
  'career, reputation and your public role',
  'friends, communities and hopes for the future',
  'solitude, your inner life and preparing for a new cycle',
];

export const PROGRESSED_MOON_SIGN = [
  'a period of new emotional beginnings, when you want to act on your own initiative',
  'a time to slow down, build security and enjoy what is tangible',
  'a curious, restless period of learning, conversations and short journeys',
  'a time when home, family and emotional roots come to the fore',
  'a period of creativity and self-expression, when you want to be seen and to enjoy life',
  'a practical period of refining your daily life, work and health',
  'a time when relationships and the search for balance take centre stage',
  'an intense period of emotional depth, honesty and inner change',
  'a period of searching for meaning — through travel, study or wider horizons',
  'a serious, constructive period of ambition and responsibility',
  'a time of freedom, friendship and looking at life in a new way',
  'a quieter, reflective period of closure and letting go before a new cycle',
];

/** Dane Rudhyar's eight phases of the progressed lunation cycle. */
export const LUNATION_PHASE = [
  ['New', 'a time when something new is seeded, often before you can name it clearly'],
  ['Crescent', 'the new impulse has to push against old patterns and prove itself'],
  ['First Quarter', 'a crisis in action — you build structures for what you have started'],
  ['Gibbous', 'a period of refining, improving and asking what it is all for'],
  ['Full', 'a time of illumination, when results and relationships show you what this cycle is about'],
  ['Disseminating', 'a time to share what you have learned and pass it on'],
  ['Last Quarter', 'a crisis in consciousness — you outgrow old forms and reorient'],
  ['Balsamic', 'the closing of a long cycle — a time to release, complete and prepare the seed of the next'],
] as const;

export const OPENING =
  'Here is a sketch of your coming year, drawn from the strongest transits and progressions in your chart.';
export const CLOSING =
  'This is only an outline from a handful of movements — in a consultation we read them together with your whole natal chart, so you can see what they mean for you and when to act.';
