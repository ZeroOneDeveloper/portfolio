import { summaries } from '$lib/server/blog';

// Generated from the same published files as the prerendered article routes/RSS.
export const load = () => ({ analyticsPaths: summaries.map(post => `/blog/${post.slug}`) });
