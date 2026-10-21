import { error } from '@sveltejs/kit';

import { renderBlocks } from '$lib/blog/render';
import { findPost, posts, summarize } from '$lib/server/blog';

import type { EntryGenerator, PageServerLoad } from './$types';

/** Every post is built at deploy time, linked from /blog or not. */
export const entries: EntryGenerator = () => posts.map((post) => ({ slug: post.slug }));

export const load: PageServerLoad = ({ params }) => {
	const post = findPost(params.slug);
	if (!post) error(404, '글을 찾을 수 없습니다');

	const index = posts.indexOf(post);
	const link = (other: (typeof posts)[number] | undefined) =>
		other && { slug: other.slug, title: other.title };

	return {
		post: summarize(post),
		html: renderBlocks(post.blocks),
		newer: link(posts[index - 1]),
		older: link(posts[index + 1])
	};
};
