import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).optional().default([]),
			thumbnail: z.string().optional(),
			externalUrl: z.string().url().optional(),
		}),
});

const certs = defineCollection({
	loader: glob({ base: './src/content/certs', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		issuer: z.string(),
		dateEarned: z.coerce.date(),
		badgeImage: z.string().optional(),
		verifyUrl: z.string().url().optional(),
		skills: z.array(z.string()).optional().default([]),
		description: z.string().optional(),
	}),
});

const cheatsheets = defineCollection({
	loader: glob({ base: './src/content/cheatsheets', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.string().optional().default('general'),
		pubDate: z.coerce.date().optional(),
	}),
});

export const collections = { blog, certs, cheatsheets };
