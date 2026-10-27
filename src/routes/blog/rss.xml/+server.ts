import { rss } from '$lib/server/blog-rss';
export const prerender = true;
export const GET = () => rss('ko');
