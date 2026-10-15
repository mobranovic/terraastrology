// Frequently asked questions – shown on /faq/ and (by id) on the service pages.
// Answers are plain text; keep them short.

export interface Faq { id: string; q: string; a: string }

export const FAQ: Faq[] = [
  {
    id: 'how-session',
    q: 'How does a consultation work?',
    a: 'Consultations are live conversations over Zoom, WhatsApp or Skype. After you send your birth data I prepare your chart in advance, so our time together is spent on what matters to you.',
  },
  {
    id: 'prepare',
    q: 'How should I prepare?',
    a: 'Send your date, exact time and place of birth when you book, and think about the areas of life or periods you are curious about. Reading a few of the essays in the journal will also show you how I approach astrology.',
  },
  {
    id: 'birth-time',
    q: 'What if I don’t know my exact time of birth?',
    a: 'The more precise the time, the more precise the reading — a birth certificate or hospital record is the best source. If the time is unknown, tell me when you book: a reading is still possible, but the houses and the Ascendant are less certain.',
  },
  {
    id: 'partner-data',
    q: 'What do I need for a relationship reading?',
    a: 'The date, time and place of birth for both of you. If your partner’s birth time is unknown, the comparison is still meaningful, with fewer details about houses and angles.',
  },
  {
    id: 'which',
    q: 'Which session should I choose?',
    a: 'The 30-minute session is a focused overview. The one-hour session goes deeper into your character, life chronology and specific questions. Choose synastry if a relationship is your main question, and the extended analysis if you also want to look at family charts or places to live.',
  },
  {
    id: 'payment',
    q: 'How do I pay?',
    a: 'After you send your order you receive a reply with a proposed time and payment details. Fees are payable via PayPal, Revolut or bank transfer.',
  },
  {
    id: 'gift',
    q: 'How does a gift voucher work?',
    a: 'Choose the session and tell me who the gift is for. After payment you receive a personal voucher (PDF), or I send it directly to the recipient on the date you choose. The recipient books a time and sends their birth data themselves.',
  },
  {
    id: 'predict',
    q: 'Can astrology predict my future?',
    a: 'Astrology describes the quality of time — the themes and cycles that are active — not a fixed fate. A good reading helps you understand what a period is asking of you, so you can meet it consciously.',
  },
  {
    id: 'privacy',
    q: 'What happens to my birth data?',
    a: 'Your data is used only to prepare your consultation and is never shared. The free forecast on this site is calculated entirely in your own browser — your birth data is not sent anywhere.',
  },
];

export const faqByIds = (ids: string[]) => ids.map((id) => FAQ.find((f) => f.id === id)!).filter(Boolean);
