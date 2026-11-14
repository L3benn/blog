import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All writeups, newest first. */
export async function getPosts(): Promise<Post[]> {
	return (await getCollection('blog')).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getPostType(tags: string[] = []): { label: string; badgeClass: string } {
	if (tags.includes('cert-journey')) return { label: 'Journey', badgeClass: 'badge-cert' };
	if (tags.includes('ctf')) return { label: 'CTF', badgeClass: '' };
	if (tags.includes('htb')) return { label: 'HTB', badgeClass: '' };
	return { label: 'Writeup', badgeClass: 'badge-article' };
}

/** Tags ordered by how many posts use them. */
export function countTags(posts: Post[]): [string, number][] {
	const counts = new Map<string, number>();
	for (const p of posts) for (const t of p.data.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
	return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
