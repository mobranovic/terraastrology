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
  { href: '/consultations/', label: 'Consultations' },
  { href: '/free-forecast/', label: 'Free forecast' },
  { href: '/journal/', label: 'Journal' },
  { href: '/about/', label: 'About' },
  { href: '/faq/', label: 'FAQ' },
];

/**
 * Online booking and payment – fill these in when the accounts exist.
 * calUrl:       public scheduling link (e.g. https://cal.com/terra-astrology).
 *               When set, /book/ shows a "Pick a time" step.
 * paymentLinks: Stripe / PayPal payment links per service id from services.ts.
 *               When set, the service cards show a "Pay now" button.
 */
export const BOOKING = {
  calUrl: '',
  paymentLinks: {} as Record<string, string>,
};

/** Privacy-friendly analytics (Plausible). Empty = no analytics script at all. */
export const ANALYTICS = { plausibleDomain: '' };

export const categoryName = (slug: string) => (categories as Record<string, string>)[slug] ?? slug;

export function readingTime(markdown: string) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
