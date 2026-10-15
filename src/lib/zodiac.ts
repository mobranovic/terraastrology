// Order, glyphs and season dates of the twelve signs, plus the essays that
// belong to each. Add a `myth` slug when a new "Mythology of …" post appears.
export const SIGNS = [
  { name: 'Aries', glyph: '♈', dates: '21 Mar – 19 Apr', element: 'Fire', post: 'aries', myth: 'mythology-of-aries' },
  { name: 'Taurus', glyph: '♉', dates: '20 Apr – 20 May', element: 'Earth', post: 'taurus', myth: 'mythology-taurus' },
  { name: 'Gemini', glyph: '♊', dates: '21 May – 20 Jun', element: 'Air', post: 'gemini', myth: 'mythology-gemini' },
  { name: 'Cancer', glyph: '♋', dates: '21 Jun – 22 Jul', element: 'Water', post: 'cancer', myth: 'mythology-cancer' },
  { name: 'Leo', glyph: '♌', dates: '23 Jul – 22 Aug', element: 'Fire', post: 'leo', myth: 'mythology-leo' },
  { name: 'Virgo', glyph: '♍', dates: '23 Aug – 22 Sep', element: 'Earth', post: 'virgo', myth: 'mythology-virgo' },
  { name: 'Libra', glyph: '♎', dates: '23 Sep – 22 Oct', element: 'Air', post: 'libra', myth: 'mythology-of-libra' },
  { name: 'Scorpio', glyph: '♏', dates: '23 Oct – 21 Nov', element: 'Water', post: 'scorpio', myth: 'mythology-of-scorpio' },
  { name: 'Sagittarius', glyph: '♐', dates: '22 Nov – 21 Dec', element: 'Fire', post: 'sagittarius', myth: undefined },
  { name: 'Capricorn', glyph: '♑', dates: '22 Dec – 19 Jan', element: 'Earth', post: 'capricorn', myth: undefined },
  { name: 'Aquarius', glyph: '♒', dates: '20 Jan – 18 Feb', element: 'Air', post: 'aquarius', myth: undefined },
  { name: 'Pisces', glyph: '♓', dates: '19 Feb – 20 Mar', element: 'Water', post: 'pisces', myth: undefined },
] as const;

// Text presentation selector so the glyphs never render as emoji.
export const glyph = (g: string) => `${g}︎`;

/** Reading order for series navigation (previous / next). */
export const SERIES = {
  signs: ['12-signs-of-the-zodiac', ...SIGNS.map((s) => s.post), 'at-the-end-of-the-zodiac'],
  myths: ['12-myths-zodiac-2', ...SIGNS.flatMap((s) => (s.myth ? [s.myth] : []))],
};
