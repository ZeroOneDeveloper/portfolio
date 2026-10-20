// /sitemap.xml: the home page, the blog and every post, each post with the time it last
// changed. Built at deploy time, so a new post is in it as soon as it is on the site.
import { blog, profile } from '$lib/content';
import { absolute, postPath } from '$lib/seo';
import { posts } from '$lib/server/blog';

export const prerender = true;

const url = (loc: string, lastmod?: string) =>
	`\t<url>\n\t\t<loc>${loc}</loc>\n${lastmod ? `\t\t<lastmod>${lastmod}</lastmod>\n` : ''}\t</url>`;

export function GET(): Response {
	const latest = posts
		.map((post) => post.updatedAt)
		.sort()
		.at(-1);
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		url(profile.url),
		url(absolute(blog.path), latest),
		...posts.map((post) => url(absolute(postPath(post.slug)), post.updatedAt)),
		'</urlset>',
		''
	].join('\n');

	return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
