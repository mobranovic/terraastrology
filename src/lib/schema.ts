// schema.org helpers (structured data for search engines).
import { SITE } from './site';
import type { Faq } from '../data/faq';

const ORIGIN = 'https://www.terraastrology.com';

export const person = () => ({
  '@type': 'Person',
  '@id': `${ORIGIN}/about/#marko`,
  name: SITE.author,
  url: `${ORIGIN}/about/`,
  jobTitle: 'Astrologer',
});

export const website = () => ({
  '@type': 'WebSite',
  name: SITE.title,
  url: `${ORIGIN}/`,
  description: SITE.description,
  author: { '@id': `${ORIGIN}/about/#marko` },
});

export const faqPage = (items: Faq[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const service = (name: string, description: string, path: string, offers: { name: string; price: number }[]) => ({
  '@type': 'Service',
  name,
  description,
  url: ORIGIN + path,
  serviceType: 'Astrological consultation',
  areaServed: 'Worldwide',
  provider: { '@id': `${ORIGIN}/about/#marko` },
  offers: offers.map((o) => ({ '@type': 'Offer', name: o.name, price: o.price, priceCurrency: 'EUR' })),
});

export const article = (title: string, description: string, path: string, date: Date, image?: string) => ({
  '@type': 'BlogPosting',
  headline: title,
  description,
  url: ORIGIN + path,
  datePublished: date.toISOString(),
  author: { '@type': 'Person', name: SITE.author, url: `${ORIGIN}/about/` },
  ...(image ? { image: image.startsWith('http') ? image : ORIGIN + image } : {}),
});
