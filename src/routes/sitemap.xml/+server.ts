// /sitemap.xml: the home page, the blog and every post, each post with the time it last
// changed. Built at deploy time, so a new post is in it as soon as it is on the site.
import { blog, profile } from '$lib/content';
import { absolute, postPath } from '$lib/seo';
import { posts, publicEnglishPosts } from '$lib/server/blog';

export const prerender = true;

const url = (loc: string, lastmod?: string, pair?: string) =>
	`\t<url>\n\t\t<loc>${loc}</loc>\n${pair ? `<xhtml:link rel="alternate" hreflang="ko" href="${absolute('/blog' + (pair === '/' ? '' : pair))}"/><xhtml:link rel="alternate" hreflang="en" href="${absolute('/en/blog' + (pair === '/' ? '' : pair))}"/>` : ''}${lastmod ? `\t\t<lastmod>${lastmod}</lastmod>\n` : ''}\t</url>`;

export function GET(): Response {
	const latest = posts
		.map((post) => post.updatedAt)
		.sort()
		.at(-1);
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		url(profile.url),
		url(absolute(blog.path), latest, publicEnglishPosts.length ? '/' : undefined),
		url(absolute('/en/blog'), undefined, publicEnglishPosts.length ? '/' : undefined),
		...publicEnglishPosts.map((post) =>
			url(absolute(postPath(post.slug, 'en')), post.updatedAt, '/' + post.slug)
		),
		...posts.map((post) =>
			url(
				absolute(postPath(post.slug)),
				post.updatedAt,
				publicEnglishPosts.some((en) => en.slug === post.slug) ? '/' + post.slug : undefined
			)
		),
		'</urlset>',
		''
	].join('\n');

	return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
