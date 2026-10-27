// The posts of the blog, read from src/lib/blog/posts/ at build time. Every page of the blog
// is prerendered, so none of this ever reaches the browser except as the pages themselves.
import { createHash } from 'node:crypto';
import {
	eligibleTranslation,
	englishReadingMinutes,
	type Translation
} from '$lib/blog/translation-policy';
import type { Post, PostSummary } from '$lib/blog/types';

const files = import.meta.glob<Post>('/src/lib/blog/posts/*.json', {
	eager: true,
	import: 'default'
});

/** Every post, newest first. */
export const posts: Post[] = Object.values(files).sort((a, b) =>
	a.publishedAt < b.publishedAt ? 1 : -1
);

/** What a page shows of a post: its text aside, and nothing of where it came from. */
export const summarize = (post: Post): PostSummary => ({
	slug: post.slug,
	title: post.title,
	description: post.description,
	publishedAt: post.publishedAt,
	updatedAt: post.updatedAt,
	readingMinutes: post.readingMinutes,
	tags: post.tags,
	cover: post.cover,
	language: post.language ?? 'ko',
	draft: post.draft ?? false
});

export const summaries: PostSummary[] = posts.map(summarize);

export const findPost = (slug: string): Post | undefined =>
	posts.find((post) => post.slug === slug);

const rawSources = import.meta.glob<string>('/src/lib/blog/posts/*.json', {
	eager: true,
	query: '?raw',
	import: 'default'
});
const translations = import.meta.glob<Translation>('/src/lib/blog/translations/en/*.json', {
	eager: true,
	import: 'default'
});
// Vite embeds only this boolean, never the build environment or its secrets.
declare const __BLOG_DRAFT_PREVIEW__: boolean;
export const draftPreview = __BLOG_DRAFT_PREVIEW__;
export const englishPosts = (preview = false): Post[] =>
	Object.values(translations)
		.filter((translation) => {
			const source = findPost(translation.translationOf);
			const raw = rawSources[`/src/lib/blog/posts/${translation.translationOf}.json`] ?? '';
			return eligibleTranslation(
				translation,
				source,
				createHash('sha256').update(raw).digest('hex'),
				preview
			);
		})
		.map((translation) => ({
			...translation,
			draft: translation.review.status !== 'approved',
			readingMinutes: englishReadingMinutes(translation)
		}))
		.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
export const publicEnglishPosts = englishPosts();
export const visibleEnglishPosts = englishPosts(draftPreview);
