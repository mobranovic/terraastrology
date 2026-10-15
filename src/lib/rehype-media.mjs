import { mediaUrl, thumbUrl } from './media.mjs';

// Resolves WordPress upload paths in Markdown and makes images lazy.
export default function rehypeMedia() {
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'img') {
      node.properties.src = thumbUrl(String(node.properties.src || ''), 1280);
      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';
    }
    if (node.type === 'element' && node.tagName === 'a' && typeof node.properties.href === 'string') {
      node.properties.href = mediaUrl(node.properties.href);
      if (/^https?:/.test(node.properties.href) && !node.properties.href.includes('terraastrology.com')) {
        node.properties.rel = 'noopener';
      }
    }
    node.children?.forEach(walk);
  };
  return walk;
}
