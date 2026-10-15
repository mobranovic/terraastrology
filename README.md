# Terra Astrology

Nova verzija stranice [terraastrology.com](https://www.terraastrology.com) — statička stranica
izrađena u [Astru](https://astro.build), prenesena s WordPressa.

## Pokretanje

```bash
npm install
npm run dev        # lokalni pregled na http://localhost:4321
npm run build      # gotova stranica u mapi dist/
```

## Struktura stranice

| Adresa | Sadržaj |
| --- | --- |
| `/` | Naslovnica – prodajna stranica (pitanja klijenata, koraci, paketi, prognoza, o meni, FAQ) |
| `/consultations/` | Pregled usluga i paketa |
| `/consultations/natal-chart/`, `synastry/`, `location-astrology/`, `gift/` | Stranice pojedinih usluga |
| `/book/` | Rezervacija (obrazac, poklon-bon, automatsko popunjavanje iz prognoze) |
| `/free-forecast/` | Besplatna prognoza – dio Natalnog Atlasa (tranziti, progresije) |
| `/journal/` | Svi članci; stare adrese članaka (`/aries/` …) ostaju iste |
| `/about/`, `/faq/`, `/newsletter/`, `/privacy/`, `/testimonials/` | Ostale stranice |

## Gdje je što

| Što | Gdje |
| --- | --- |
| Članci (53) | `src/content/posts/*.md` |
| Paketi i cijene | `src/lib/services.ts` |
| Tekstovi stranica usluga | `src/data/offerings.ts` |
| Česta pitanja | `src/data/faq.ts` |
| Iskustva klijenata | `src/data/testimonials.ts` |
| Biografija i činjenice (About) | `src/data/about.ts` |
| Kalendar, plaćanje, analitika | `src/lib/site.ts` → `BOOKING`, `ANALYTICS` |
| Rečenice besplatne prognoze | `src/lib/forecast/texts.ts` |
| Boje, fontovi | `src/styles/global.css` |
| Preusmjeravanja starih adresa | `public/_redirects` |

## Faza 2 – što još treba od vas

Sve se upisuje na jedno mjesto; odjeljci se na stranici pojavljuju sami čim podaci postoje:

- [ ] **Iskustva klijenata** (3–5, uz dozvolu) → `src/data/testimonials.ts`
- [ ] **Fotografija** → zamijeniti `image` u `src/content/pages/about-me.md`
- [ ] **Biografija i činjenice** (godine prakse, obrazovanje) → `src/data/about.ts`
- [ ] **Kalendar** (npr. Cal.com) → `BOOKING.calUrl`
- [ ] **Plaćanje unaprijed** (Stripe/PayPal linkovi) → `BOOKING.paymentLinks`
- [ ] **Pravila** – snimka razgovora, otkazivanje, valjanost poklon-bona (sada piše 12 mjeseci) → `src/data/faq.ts`, `src/data/offerings.ts`
- [ ] **Analitika** (Plausible) → `ANALYTICS.plausibleDomain`
- [ ] **Newsletter** – prijave stižu u Netlify Forms (obrazac `newsletter`); kasnije se mogu povezati s MailerLiteom

### Novi članak

Napravite datoteku `src/content/posts/naziv-clanka.md`:

```md
---
title: "Naslov članka"
slug: "naziv-clanka"
date: "2026-11-01"
categories: ["planets", "saturn"]
excerpt: "Kratki sažetak za kartice i Google."
image: "/images/naslovna.jpg"   # slika iz mape public/
featured: false                 # true = prikaz među istaknutima na naslovnici
---

Tekst članka u Markdownu…
```

Adresa članka bit će `https://www.terraastrology.com/naziv-clanka/`.

## Slike sa stare stranice

Slike se još učitavaju sa starog WordPress servera. Da se prenesu u repozitorij
(potrebno **prije** gašenja WordPressa):

```bash
npm run fetch:media
```

Skripta preuzima svih 214 datoteka u `public/wp-content/uploads/`, na iste putanje
kao prije, pa i stare poveznice na slike nastavljaju raditi.

## Objava (Netlify)

1. Na [netlify.com](https://www.netlify.com) se prijavite GitHub računom → **Add new site → Import from Git** → odaberite `terraastrology`.
   Postavke se čitaju iz `netlify.toml`, ne treba ništa mijenjati.
2. Provjerite stranicu na privremenoj adresi `*.netlify.app`.
3. **Forms → Enable form detection**, zatim pod *Form notifications* dodajte e-mail za obavijesti. Obrasci: `natal-chart-order` (narudžbe i poklon-bonovi) i `newsletter`.
4. **Domain management → Add a domain** → `terraastrology.com`. Netlify će dati DNS zapise koje upisujete kod registrara domene.
5. Tek kad nova stranica radi na domeni, ugasite WordPress hosting.

## Besplatna prognoza (Natal Atlas)

`/free-forecast/` računa tranzite Jupitera–Plutona, Jupiter i Saturn kroz kuće, progresivni
Mjesec, Rudhyarovu progresivnu lunacijsku fazu i progresivno Sunce za sljedećih 12 mjeseci i
sastavlja sažetak od 5–10 rečenica. Izračun je prenesen iz Natalnog Atlasa i radi u pregledniku
posjetitelja – podaci o rođenju nikamo se ne šalju. Popis mjesta: `public/data/cities.json`
(GeoNames, CC BY 4.0), obnavlja se s `npm run build:cities`. Detalji:
`src/components/natal-atlas/README.md`.

## Slike

`npm run build` prije izgradnje sam izrađuje umanjene WebP kopije slika (`public/thumbs/`,
nisu u gitu) – kartice i članci tako učitavaju ~40 KB umjesto ~1 MB po slici.

## Ponovni uvoz iz WordPressa

```bash
node scripts/import-wordpress.mjs putanja/do/exporta.xml          # samo nove datoteke
node scripts/import-wordpress.mjs putanja/do/exporta.xml --force  # prepiše sve
```

## Napomene o prijenosu

- Na staroj stranici *About me* bila je ubačena **spam poveznica** ("kerberos market" → darknetpages.com),
  što upućuje na kompromitiranu WordPress instalaciju. U novoj verziji je uklonjena.
- Stranica *Location astrology* (stara adresa `/edge-of-science/`) sadržavala je demo tekst
  WordPress teme. Zadržan je samo pravi uvod, a nova adresa je `/consultations/location-astrology/` (uz 301 preusmjeravanje).
- Prazne stranice *Love astrology*, *Mundane astrology* i *12 Myths of the Zodiac* sada su
  tematske stranice s popisom pripadajućih članaka.
