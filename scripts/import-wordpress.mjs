// Converts a WordPress WXR export into Markdown content for the Astro site.
//
//   node scripts/import-wordpress.mjs path/to/export.xml [--force]
//
// Writes src/content/posts/*.md, src/content/pages/*.md and
// src/data/media-manifest.json (list of every upload to download with
// `npm run fetch:media`). Existing Markdown files are kept, so hand edits are
// safe; pass --force to overwrite them.

import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';

const SRC = process.argv[2];
const FORCE = process.argv.includes('--force');
if (!SRC) {
  console.error('Usage: node scripts/import-wordpress.mjs <export.xml>');
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_POSTS = path.join(ROOT, 'src/content/posts');
const OUT_PAGES = path.join(ROOT, 'src/content/pages');
const SITE_RE = /https?:\/\/(?:www\.)?terraastrology\.com/gi;

// Injected SEO-spam link found in the old site's "About me" page.
const SPAM_PATTERNS = [/\s*with\s*<a[^>]*darknetpages\.com[^>]*>.*?<\/a>/gi];

const parser = new XMLParser({
  ignoreAttributes: false,
  cdataPropName: false,
  isArray: (name) => ['item', 'category', 'wp:postmeta', 'wp:category', 'wp:tag'].includes(name),
});
const xml = parser.parse(fs.readFileSync(SRC, 'utf8'));
const channel = xml.rss.channel;
const items = channel.item;

const text = (v) => (v == null ? '' : typeof v === 'object' ? String(v['#text'] ?? '') : String(v));
const meta = (it) =>
  Object.fromEntries((it['wp:postmeta'] || []).map((m) => [text(m['wp:meta_key']), text(m['wp:meta_value'])]));

// ---- attachments -----------------------------------------------------------
const attachments = new Map(); // id -> { url, alt }
for (const it of items) {
  if (text(it['wp:post_type']) !== 'attachment') continue;
  const m = meta(it);
  attachments.set(text(it['wp:post_id']), {
    url: text(it['wp:attachment_url']),
    alt: m._wp_attachment_image_alt || '',
  });
}
const originals = new Set([...attachments.values()].map((a) => localPath(a.url)));
const media = new Set(originals);

function localPath(url) {
  return url.replace(SITE_RE, '').replace(/^http:\/\//, '');
}

// Prefer the full-size original over WordPress' resized copies (foo-300x200.jpg).
function bestImage(src) {
  const p = localPath(src);
  const orig = p.replace(/-\d+x\d+(\.\w+)$/, '$1');
  const chosen = originals.has(orig) ? orig : p;
  if (chosen.startsWith('/wp-content/uploads/')) media.add(chosen);
  return chosen;
}

// ---- HTML clean-up -----------------------------------------------------------
function autop(html) {
  if (/<p[\s>]/i.test(html)) return html;
  return html
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((c) => (/^<(h\d|ul|ol|blockquote|table|div|figure|iframe)/i.test(c) ? c : `<p>${c.replace(/\n/g, '<br>')}</p>`))
    .join('\n');
}

function clean(html) {
  let h = html;
  for (const re of SPAM_PATTERNS) h = h.replace(re, '');
  h = h.replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '');
  h = h.replace(/\[embed\](.*?)\[\/embed\]/g, (_, url) => youtube(url) ?? `<p><a href="${url}">${url}</a></p>`);
  // Unwrap Google-Translate form wrapper and other layout-only tags.
  h = h.replace(/<\/?(form|div|span|font|u)\b[^>]*>/gi, '');
  h = h.replace(/\s(style|class|id|dir|data-[\w-]+)="[^"]*"/gi, '');
  h = h.replace(/&nbsp;| /g, ' ');
  // Image links that just open the same image (or an attachment page) are dropped.
  h = h.replace(/<a[^>]*>\s*(<img[^>]*>)\s*<\/a>/gi, '$1');
  h = h.replace(/<img([^>]*?)src="([^"]+)"([^>]*)>/gi, (_, a, src, b) => {
    const alt = (`${a} ${b}`.match(/alt="([^"]*)"/) || [])[1] || '';
    return `<img src="${bestImage(src)}" alt="${alt}">`;
  });
  h = h.replace(/(href)="([^"]+)"/gi, (_, attr, url) => `${attr}="${internal(url)}"`);
  h = h.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '');
  // Markdown cannot express a line break inside bold/italic, or bold punctuation.
  h = h.replace(/(\s*<br\s*\/?>\s*)+<\/(strong|b|em|i)>/gi, '</$2><br>');
  h = h.replace(/<(strong|b|em|i)>\s*<\/\1>/gi, ' ');
  h = h.replace(/<(strong|b|em|i)>\s*([.,;:!?])\s*<\/\1>/gi, '$2');
  return autop(h);
}

function internal(url) {
  if (!/terraastrology\.com/i.test(url)) return url;
  const p = localPath(url) || '/';
  if (p.startsWith('/wp-content/uploads/')) return bestImage(p);
  return p;
}

function youtube(url) {
  const id = (url.match(/(?:v=|youtu\.be\/)([\w-]{11})/) || [])[1];
  if (!id) return null;
  return `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy" allowfullscreen></iframe></div>`;
}

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*' });
td.keep(['iframe', 'table']);
td.addRule('video', {
  filter: (node) => node.nodeName === 'DIV' && node.getAttribute('class') === 'video',
  replacement: (_c, node) => `\n\n${node.outerHTML}\n\n`,
});

function toMarkdown(html) {
  return td
    .turndown(html)
    .replace(/\*\*\s+\*\*/g, ' ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function excerpt(html) {
  const more = html.split('<!--more-->')[0];
  const plain = clean(more === html ? html : more)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, (e) => ({ '&amp;': '&', '&#8217;': '’', '&quot;': '"' })[e] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= 220) return plain;
  return plain.slice(0, 217).replace(/\s+\S*$/, '') + '…';
}

const yaml = (v) => JSON.stringify(v);

// ---- write ---------------------------------------------------------------------
fs.mkdirSync(OUT_POSTS, { recursive: true });
fs.mkdirSync(OUT_PAGES, { recursive: true });

const catName = Object.fromEntries(
  (channel['wp:category'] || []).map((c) => [text(c['wp:category_nicename']), text(c['wp:cat_name'])]),
);

let count = { post: 0, page: 0 };
for (const it of items) {
  const type = text(it['wp:post_type']);
  if (!['post', 'page'].includes(type) || text(it['wp:status']) !== 'publish') continue;
  const m = meta(it);
  const raw = text(it['content:encoded']);
  const slug = decodeURIComponent(text(it['wp:post_name']));
  const cats = (it.category || []).filter((c) => c['@_domain'] === 'category').map((c) => c['@_nicename']);
  const tags = (it.category || []).filter((c) => c['@_domain'] === 'post_tag').map((c) => text(c));
  const thumb = attachments.get(m._thumbnail_id);
  const fm = {
    title: text(it.title).trim(),
    slug,
    date: text(it['wp:post_date']).slice(0, 10),
    wpId: Number(text(it['wp:post_id'])),
  };
  if (type === 'post') {
    fm.categories = [...new Set(cats.filter((c) => c !== 'slider' && c !== 'uncategorized'))];
    fm.tags = [...new Set(tags.map((t) => t.trim()).filter((t) => !/^slider$/i.test(t)))];
    fm.featured = cats.includes('slider') || tags.some((t) => /^slider$/i.test(t));
  }
  fm.excerpt = excerpt(raw);
  if (thumb) {
    fm.image = bestImage(thumb.url);
    fm.imageAlt = thumb.alt;
  }
  const body = toMarkdown(clean(raw));
  const front = Object.entries(fm)
    .map(([k, v]) => `${k}: ${yaml(v)}`)
    .join('\n');
  const file = path.join(type === 'post' ? OUT_POSTS : OUT_PAGES, `${slug}.md`);
  if (fs.existsSync(file) && !FORCE) continue;
  fs.writeFileSync(file, `---\n${front}\n---\n\n${body}\n`);
  count[type]++;
}

fs.mkdirSync(path.join(ROOT, 'src/data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src/data/media-manifest.json'), JSON.stringify([...media].sort(), null, 2) + '\n');
fs.writeFileSync(path.join(ROOT, 'src/data/categories.json'), JSON.stringify(catName, null, 2) + '\n');
console.log(`Imported ${count.post} posts, ${count.page} pages, ${media.size} media files listed.`);
