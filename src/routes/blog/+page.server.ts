import { summaries } from '$lib/server/blog';

export const load = () => ({ posts: summaries });
