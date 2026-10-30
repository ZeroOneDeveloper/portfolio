import { error } from '@sveltejs/kit';
import { renderBlocks } from '$lib/blog/render';
import { blogPath, type Language } from '$lib/blog/locale';
import { posts, summarize, visibleEnglishPosts, publicEnglishPosts } from './blog';

export function listData(language: Language) {
	const selected = language === 'en' ? visibleEnglishPosts : posts;
	const noindex = language === 'en' && selected.some((post) => post.draft);
	const paired = publicEnglishPosts.length > 0;
	return {
		language,
		posts: selected.map(summarize),
		noindex,
		sibling: blogPath(language === 'en' ? 'ko' : 'en'),
		previewSibling: language === 'ko' && !paired && visibleEnglishPosts.length > 0,
		alternate: paired ? { ko: '/blog', en: '/en/blog' } : null
	};
}
export function articleData(slug: string, language: Language) {
	const selected = language === 'en' ? visibleEnglishPosts : posts;
	const post = selected.find((post) => post.slug === slug);
	if (!post) error(404, language === 'en' ? 'Article not found' : '글을 찾을 수 없습니다');
	const index = selected.indexOf(post);
	const link = (other: typeof post | undefined) =>
		other && { slug: other.slug, title: other.title };
	const translated = visibleEnglishPosts.find((post) => post.slug === slug);
	const publicPair = publicEnglishPosts.some((post) => post.slug === slug);
	return {
		language,
		post: summarize(post),
		html: renderBlocks(post.blocks, { language }),
		newer: link(selected[index - 1]),
		older: link(selected[index + 1]),
		noindex: !!post.draft,
		sibling: language === 'en' ? `/blog/${slug}` : translated ? `/en/blog/${slug}` : null,
		previewSibling: language === 'ko' && !!translated?.draft,
		alternate: publicPair ? { ko: `/blog/${slug}`, en: `/en/blog/${slug}` } : null
	};
}
