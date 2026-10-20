// The posts of the blog, read from src/lib/blog/posts/ at build time. Every page of the blog
// is prerendered, so none of this ever reaches the browser except as the pages themselves.
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
	cover: post.cover
});

export const summaries: PostSummary[] = posts.map(summarize);

export const findPost = (slug: string): Post | undefined =>
	posts.find((post) => post.slug === slug);
