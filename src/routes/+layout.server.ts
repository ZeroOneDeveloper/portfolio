import { draftPreview, publicEnglishPosts, summaries } from '$lib/server/blog';

// Generated from the same published files as the prerendered article routes/RSS.
export const load = () => ({
	translationPreview: draftPreview,
	analyticsPaths: [
		...summaries.map((post) => `/blog/${post.slug}`),
		'/en/blog',
		...publicEnglishPosts.map((post) => `/en/blog/${post.slug}`)
	]
});
