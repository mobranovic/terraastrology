import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPosts() {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postUrl = (p: Post) => `/${p.data.slug}/`;

export async function postsInCategory(category: string) {
  return (await getPosts()).filter((p) => p.data.categories.includes(category));
}

/** Categories that are actually used, most-populated first. */
export async function usedCategories() {
  const counts = new Map<string, number>();
  for (const p of await getPosts()) for (const c of p.data.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1]);
}
