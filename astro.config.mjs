import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://l3benn.github.io',
	base: '/',
	integrations: [mdx(), sitemap()],
});
