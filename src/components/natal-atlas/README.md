# Natal Atlas on the website

The free forecast on `/free-forecast/` is the prognostic part of
[Natalni Atlas](https://github.com/mobranovic/natalni-atlas), rebuilt for the public site:

* `src/lib/forecast/engine.ts` – astronomy ported from Natalni Atlas (`localToUT`,
  `planetsAt`, Placidus `housesFrom`, secondary `progress`, `transitHits`).
* `src/lib/forecast/forecast.ts` – picks the strongest themes for the next 12 months:
  the three strongest transits of Jupiter–Pluto to the personal points, Jupiter/Saturn
  through the houses, the progressed Moon, Rudhyar's progressed lunation phase and
  the progressed Sun – and composes 5–10 sentences.
* `src/lib/forecast/texts.ts` – every sentence fragment; edit the wording here.
* `ForecastTool.astro` – the form and result; `ForecastTeaser.astro` – the invitation
  used on other pages.

Everything runs in the visitor's browser; birth data is never sent anywhere.
The place search uses `public/data/cities.json` (GeoNames, CC BY 4.0), rebuilt with
`npm run build:cities`.
