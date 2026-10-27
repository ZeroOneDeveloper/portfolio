// /blog/rss.xml: the posts as an RSS 2.0 feed, each with its full text, for feed readers and
// for anyone who follows the blog. Built from the posts at deploy time.
import { renderBlocks } from '$lib/blog/render';
import { blog, profile } from '$lib/content';
import { absolute, postPath } from '$lib/seo';
import { posts as koreanPosts, publicEnglishPosts } from '$lib/server/blog';
import { blogPath, labels, type Language } from '$lib/blog/locale';

const escape = (text: string) =>
	text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** HTML inside CDATA, which ends only at "]]>". */
const cdata = (html: string) => `<![CDATA[${html.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;

/** RSS dates are RFC 822: Tue, 20 Oct 2026 03:03:45 GMT. */
const rfc822 = (iso: string) => new Date(iso).toUTCString();

export function rss(language: Language = 'ko'): Response {
	const posts = language === 'en' ? publicEnglishPosts : koreanPosts;
	const path = blogPath(language);
	const feed = absolute(`${path}/rss.xml`);
	const items = posts.map((post) => {
		const url = absolute(postPath(post.slug, language));
		return [
			'<item>',
			`<title>${escape(post.title)}</title>`,
			`<link>${url}</link>`,
			`<guid isPermaLink="true">${url}</guid>`,
			`<pubDate>${rfc822(post.publishedAt)}</pubDate>`,
			`<dc:creator>${escape(language === 'en' ? profile.nameEn : profile.name)}</dc:creator>`,
			...post.tags.map((tag) => `<category>${escape(tag)}</category>`),
			`<description>${escape(post.description)}</description>`,
			`<content:encoded>${cdata(renderBlocks(post.blocks, { base: profile.url, language }))}</content:encoded>`,
			'</item>'
		].join('\n');
	});

	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">',
		'<channel>',
		`<title>${escape(language === 'en' ? labels.en.title : blog.name)}</title>`,
		`<link>${absolute(path)}</link>`,
		`<atom:link href="${feed}" rel="self" type="application/rss+xml"/>`,
		`<description>${escape(language === 'en' ? labels.en.description : blog.description)}</description>`,
		`<language>${language}</language>`,
		posts[0] ? `<lastBuildDate>${rfc822(posts[0].updatedAt)}</lastBuildDate>` : '',
		...items,
		'</channel>',
		'</rss>',
		''
	].join('\n');

	return new Response(body, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
