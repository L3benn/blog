import { getCollection } from 'astro:content';

// Lightweight index for the Ctrl+K command palette.
export async function GET() {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	const sheets = await getCollection('cheatsheets');
	const certs = await getCollection('certs');

	const items = [
		{ title: 'Home', url: '/', type: 'Page', extra: '' },
		{ title: 'Writeups', url: '/writeups/', type: 'Page', extra: 'ctf htb' },
		{ title: 'Cheatsheets', url: '/cheatsheets/', type: 'Page', extra: '' },
		{ title: 'Certifications', url: '/certs/', type: 'Page', extra: 'certs' },
		{ title: 'About', url: '/about/', type: 'Page', extra: 'cv contact' },
		{ title: 'Full-text search', url: '/search/', type: 'Page', extra: '' },
		...posts.map((p) => ({
			title: p.data.title,
			url: `/blog/${p.id}/`,
			type: 'Writeup',
			extra: `${p.data.description} ${p.data.tags.join(' ')}`,
		})),
		...sheets.map((s) => ({
			title: s.data.title,
			url: `/cheatsheets/${s.id}/`,
			type: 'Cheatsheet',
			extra: `${s.data.description} ${s.data.category}`,
		})),
		...certs.map((c) => ({
			title: c.data.title,
			url: '/certs/',
			type: 'Cert',
			extra: `${c.data.issuer} ${c.data.skills.join(' ')}`,
		})),
	];

	return new Response(JSON.stringify(items), {
		headers: { 'Content-Type': 'application/json' },
	});
}
