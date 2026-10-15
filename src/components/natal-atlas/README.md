# Natal Atlas – integration slot

This folder is the reserved place for features brought in from the Natal Atlas app.

* `NatalAtlasSlot.astro` is already placed on the home page, the consultation page,
  each Sun-sign essay (compact) and on `/natal-atlas/`.
* Configuration lives in `src/lib/site.ts` → `NATAL_ATLAS`
  (`enabled`, `appUrl`, `features`).
* When a feature is chosen, add its component here (for example `ChartWheel.astro`)
  and render it inside the `enabled` branch of `NatalAtlasSlot.astro`, switching on
  the `context` prop (`home`, `consultation`, `sign`, `page`).
