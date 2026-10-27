import { articleData } from '$lib/server/blog-pages';
import { visibleEnglishPosts as posts } from '$lib/server/blog';
import type { EntryGenerator, PageServerLoad } from './$types';
export const entries: EntryGenerator = () => posts.map((post) => ({ slug: post.slug }));
export const load: PageServerLoad = ({ params }) => articleData(params.slug, 'en');

// An empty approved set is valid; unlisted siblings reach the loader's 404.
export const prerender = 'auto';
