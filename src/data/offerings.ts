// Content of the service pages under /consultations/<slug>/.
// Packages and prices live in src/lib/services.ts.

export interface Offering {
  slug: string;
  title: string;
  short: string;
  lede: string;
  /** The life questions people bring – shown as "Is this for you?" */
  questions: string[];
  /** What happens in the session / what you take away. */
  includes: string[];
  /** Package ids from services.ts offered on this page. */
  packages: string[];
  /** Journal categories to recommend underneath. */
  categories: string[];
  /** Extra paragraph of context (plain text). */
  body: string;
  /** FAQ ids from faq.ts shown on the page. */
  faq: string[];
}

export const OFFERINGS: Offering[] = [
  {
    slug: 'natal-chart',
    title: 'Natal chart reading',
    short: 'Your character, your evolutionary goals and the timing of your life — read from the moment you were born.',
    lede: 'A personal reading of your birth chart: who you are, what you are here to grow into, and what the coming period asks of you.',
    questions: [
      'Why do the same patterns keep repeating in my life?',
      'What am I really meant to do — and what holds me back?',
      'What is this period of my life about, and what comes next?',
      'How can I use my strengths instead of fighting myself?',
    ],
    includes: [
      'An in-depth profile of your character, drawn from the whole chart — not only the Sun sign',
      'The main evolutionary goals of your life',
      'A personal chronology of crucial periods, from childhood to the near future',
      'Current transits and progressions, and what they invite you to do',
      'Time for your own questions',
    ],
    packages: ['standard-30', 'standard-60', 'extended'],
    categories: ['12-signs-of-the-zodiac', 'planets', 'aspects'],
    body: 'Many people today type a few details into an online program and get a horoscope. That is not astrology. A chart is not a catalogue of traits but a living picture of potential — and a reading is a conversation about how that potential is unfolding in your life right now.',
    faq: ['birth-time', 'how-session', 'prepare', 'payment'],
  },
  {
    slug: 'synastry',
    title: 'Relationship reading (synastry)',
    short: 'Two charts side by side: what draws you together, where you clash, and what the relationship asks of both of you.',
    lede: 'A reading of your relationship through both birth charts — attraction, friction, and the deeper purpose of being together.',
    questions: [
      'Why does this person affect me so strongly?',
      'Why do we keep having the same argument?',
      'Is this a relationship to build on — and how?',
      'What do I project onto my partners?',
    ],
    includes: [
      'Your natal chart reading, including the main evolutionary goals of your life',
      'Comparison of both charts: attraction, harmony and points of tension',
      'The relationship as a whole — what it is for and where it is heading',
      'Timing: the periods that test or strengthen the relationship',
    ],
    packages: ['synastry', 'extended'],
    categories: ['love-astrology'],
    body: 'Love in a horoscope is neither pure reality nor pure illusion. Synastry shows where two people genuinely meet and where they meet only their own projections — which is often exactly where a relationship can grow.',
    faq: ['partner-data', 'birth-time', 'how-session', 'payment'],
  },
  {
    slug: 'location-astrology',
    title: 'Location astrology',
    short: 'Astrocartography: how places on the map resonate with your chart — for moving, travel or understanding where you live.',
    lede: 'How different places on the map resonate with your birth chart — where love, work or inner growth find the most support.',
    questions: [
      'Should I move — and where would I thrive?',
      'Why did I feel so different in that city?',
      'Which place supports my career, love life or inner peace?',
    ],
    includes: [
      'Your planetary lines across the globe (astrocartography)',
      'How relocating — or simply travelling — shifts the emphasis of your chart',
      'The places you are considering, looked at one by one',
      'Everything from the extended natal chart analysis',
    ],
    packages: ['extended'],
    categories: [],
    body: 'Have you ever felt a deep connection to a certain place — or an inexplicable resistance to another? By mapping planetary lines across the globe, astrocartography reveals where love might blossom, career opportunities may thrive, or spiritual growth is most supported.',
    faq: ['birth-time', 'how-session', 'payment'],
  },
  {
    slug: 'gift',
    title: 'Gift a reading',
    short: 'A natal chart reading as a gift — a voucher for any consultation, sent to you or straight to the person you love.',
    lede: 'Give someone a conversation about their own life: a voucher for any consultation, valid for twelve months.',
    questions: [
      'Looking for a meaningful birthday or anniversary gift?',
      'Know someone who loves astrology — or is at a crossroads?',
    ],
    includes: [
      'A personal gift voucher (PDF) for the session of your choice',
      'Sent to you, or directly to the recipient on a date you choose',
      'The recipient books a time that suits them',
      'Valid for twelve months',
    ],
    packages: ['standard-30', 'standard-60', 'synastry', 'extended'],
    categories: [],
    body: 'Choose the session, tell me who it is for and when the voucher should arrive. You do not need the recipient’s birth data — they will send it themselves when they book.',
    faq: ['gift', 'payment'],
  },
];

export const offeringBySlug = (slug: string) => OFFERINGS.find((o) => o.slug === slug);
