// Renders public/og.png (1200×630) and public/apple-touch-icon.png (180×180).
// Needs Playwright with Chromium (not a project dependency):  node scripts/make-brand-images.mjs
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
const root = path.resolve(import.meta.dirname, '..');
const logo = fs.readFileSync(`${root}/public/logo-light.svg`, 'utf8');
const fontCss = (pkg, file) => {
  const dir = `${root}/node_modules/@fontsource-variable/${pkg}/files/`;
  const f = fs.readdirSync(dir).find((x) => x.includes(file));
  return `url(data:font/woff2;base64,${fs.readFileSync(dir + f).toString('base64')})`;
};
const css = `@font-face{font-family:F;src:${fontCss('fraunces', 'latin-opsz-normal')}}@font-face{font-family:FI;src:${fontCss('fraunces', 'latin-opsz-italic')}}@font-face{font-family:I;src:${fontCss('inter', 'latin-wght-normal')}}`;
const og = `<html><head><style>${css}
body{margin:0;width:1200px;height:630px;display:flex;align-items:center;gap:64px;padding:0 90px;box-sizing:border-box;
background:radial-gradient(70% 90% at 85% 10%,#1a3a2a,#0b1410 70%);color:#e9f1ea;font-family:F}
.l{width:330px;height:330px;flex:none;border-radius:50%;box-shadow:0 0 0 2px rgb(127 220 174/.3);display:grid;place-items:center;background:rgb(127 220 174/.05)}
h1{font-size:92px;font-weight:400;line-height:1;margin:0 0 22px;letter-spacing:-2px}h1 em{font-family:FI;color:#7fdcae}
p{font-size:34px;color:#a3c9b3;margin:0 0 34px;line-height:1.3}
small{font-family:I;font-size:22px;letter-spacing:4px;text-transform:uppercase;color:#7fdcae}</style></head><body>
<div class="l">${logo.replace('<svg ', '<svg width="220" height="220" ')}</div>
<div><h1>Terra <em>Astrology</em></h1><p>Astrology from a different perspective</p><small>Readings · Journal · Free forecast</small></div></body></html>`;
const b = await chromium.launch();
let p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(og);
await p.waitForTimeout(300);
await p.screenshot({ path: `${root}/public/og.png` });
p = await b.newPage({ viewport: { width: 180, height: 180 } });
await p.setContent(`<body style="margin:0;background:#0f2219;display:grid;place-items:center;height:180px">${logo.replace('<svg ', '<svg width="132" height="132" ')}</body>`);
await p.screenshot({ path: `${root}/public/apple-touch-icon.png` });
await b.close();
