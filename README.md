# Terra Astrology

Nova verzija stranice [terraastrology.com](https://www.terraastrology.com) — statička stranica
izrađena u [Astru](https://astro.build), prenesena s WordPressa.

## Pokretanje

```bash
npm install
npm run dev        # lokalni pregled na http://localhost:4321
npm run build      # gotova stranica u mapi dist/
```

## Gdje je što

| Što | Gdje |
| --- | --- |
| Članci (53) | `src/content/posts/*.md` |
| Stranice (About, Sun Signs …) | `src/content/pages/*.md` |
| Paketi i cijene konzultacija | `src/lib/services.ts` |
| Izbornik, naslov, e-mail | `src/lib/site.ts` |
| Znakovi, datumi, redoslijed serija | `src/lib/zodiac.ts` |
| Boje, fontovi, tipografija | `src/styles/global.css` |
| Mjesto za Natal Atlas | `src/components/natal-atlas/` |
| Preusmjeravanja starih adresa | `public/_redirects` |

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
3. **Forms → Enable form detection**, zatim pod *Form notifications* dodajte e-mail za obavijesti o narudžbama natalne karte.
4. **Domain management → Add a domain** → `terraastrology.com`. Netlify će dati DNS zapise koje upisujete kod registrara domene.
5. Tek kad nova stranica radi na domeni, ugasite WordPress hosting.

## Natal Atlas

Mjesto je pripremljeno na naslovnici, na stranici konzultacija, na svakom članku o znaku
i na `/natal-atlas/` (stranica je skrivena od Googlea dok integracija nije uključena).
Uključuje se u `src/lib/site.ts` → `NATAL_ATLAS`. Detalji su u
`src/components/natal-atlas/README.md`.

## Ponovni uvoz iz WordPressa

```bash
node scripts/import-wordpress.mjs putanja/do/exporta.xml          # samo nove datoteke
node scripts/import-wordpress.mjs putanja/do/exporta.xml --force  # prepiše sve
```

## Napomene o prijenosu

- Na staroj stranici *About me* bila je ubačena **spam poveznica** ("kerberos market" → darknetpages.com),
  što upućuje na kompromitiranu WordPress instalaciju. U novoj verziji je uklonjena.
- Stranica *Location astrology* (stara adresa `/edge-of-science/`) sadržavala je demo tekst
  WordPress teme. Zadržan je samo pravi uvod, a nova adresa je `/location-astrology/` (uz 301 preusmjeravanje).
- Prazne stranice *Love astrology*, *Mundane astrology* i *12 Myths of the Zodiac* sada su
  tematske stranice s popisom pripadajućih članaka.
