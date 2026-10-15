import categories from '../data/categories.json';

export const SITE = {
  title: 'Terra Astrology',
  tagline: 'Astrology from a different perspective',
  description:
    'Essays on the zodiac, its myths, planetary cycles and mundane astrology — and personal natal chart consultations by Marko Obranović.',
  author: 'Marko Obranović',
  // Shown on the consultation page; split so simple scrapers do not pick it up.
  email: { user: 'marko.obr', domain: 'gmail.com' },
};

export const NAV = [
  { href: '/sun-signs/', label: 'Sun Signs' },
  { href: '/articles/', label: 'Articles' },
  { href: '/love-astrology/', label: 'Love' },
  { href: '/mundane-astrology/', label: 'Mundane' },
  { href: '/location-astrology/', label: 'Location' },
  { href: '/about-me/', label: 'About' },
];

/**
 * Natal Atlas integration – placeholder.
 * Flip `enabled` to true and fill `features` once you decide which parts of
 * the app to bring in. Every <NatalAtlasSlot> on the site reads from here.
 */
export const NATAL_ATLAS = {
  enabled: false,
  appUrl: '',
  features: [] as { id: string; title: string; description: string }[],
};

export const categoryName = (slug: string) => (categories as Record<string, string>)[slug] ?? slug;

export function readingTime(markdown: string) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
