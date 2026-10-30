import { articleData } from '$lib/server/blog-pages';
import { posts as posts } from '$lib/server/blog';
import type { EntryGenerator, PageServerLoad } from './$types';
export const entries: EntryGenerator = () => posts.map((post) => ({ slug: post.slug }));
export const load: PageServerLoad = ({ params }) => articleData(params.slug, 'ko');
