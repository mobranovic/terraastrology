// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeMedia from './src/lib/rehype-media.mjs';

export default defineConfig({
  site: 'https://www.terraastrology.com',
  // Same URL shape as the old WordPress site (/aries/, /about-me/ …).
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({ filter: (page) => !/\/(thank-you|newsletter\/thanks|testimonials)\/$/.test(page) }),
  ],
  markdown: {
    processor: unified({ rehypePlugins: [rehypeMedia] }),
  },
});
