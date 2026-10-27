// Run against a completed build served by pnpm preview. No external browser needed.
// BLOG_TEST_ORIGIN=http://127.0.0.1:4178 BLOG_TEST_MODE=production node --test tests/blog-routes.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
const origin = process.env.BLOG_TEST_ORIGIN;
const mode = process.env.BLOG_TEST_MODE ?? 'production';
const slug = '2026-07-25-ax-for-good-session';
const get = async (path) => {
	const response = await fetch(origin + path);
	return { response, text: await response.text() };
};

test(
	'locale routes, missing siblings, discovery and draft boundary',
	{ skip: !origin },
	async () => {
		const korean = await get('/blog/' + slug);
		assert.equal(korean.response.status, 200);
		assert.match(korean.text, /<html lang="ko"/);
		assert.match(korean.text, /AX for Good 세션 마무리/);
		const list = await get('/en/blog');
		assert.equal(list.response.status, 200);
		assert.match(list.text, /<html lang="en"/);
		assert.match(list.text, /rel="canonical" href="https:\/\/www.zero0ne.dev\/en\/blog"/);
		const english = await get('/en/blog/' + slug);
		if (mode === 'production') {
			assert.equal(english.response.status, 404);
			assert.doesNotMatch(list.text, /Wrapping up the AX for Good session/);
			assert.doesNotMatch(korean.text, /hreflang="en"/);
			assert.doesNotMatch(korean.text, new RegExp('href="/en/blog/' + slug + '"'));
		} else {
			assert.equal(english.response.status, 200);
			assert.match(english.text, /<html lang="en"/);
			assert.match(english.text, /Wrapping up the AX for Good session/);
			assert.match(english.text, /"inLanguage":"en"/);
			assert.match(
				english.text,
				new RegExp('rel="canonical" href="https://www.zero0ne.dev/en/blog/' + slug + '"')
			);
			assert.equal((english.text.match(/<figure><img/g) ?? []).length, 6);
			assert.doesNotMatch(english.text, /aria-label="다른 글"/);
			assert.doesNotMatch(english.text, /href="\/en\/blog\/2026-10/);
			if (mode === 'preview') {
				for (const page of [english, list, korean])
					assert.match(page.text, /name="robots" content="noindex, nofollow"/);
				assert.match(english.text, /Review draft/);
				assert.doesNotMatch(english.text, /hreflang="en"/);
			} else {
				for (const page of [english, korean]) {
					assert.match(page.text, /hreflang="ko"/);
					assert.match(page.text, /hreflang="en"/);
				}
				assert.doesNotMatch(english.text, /name="robots" content="noindex/);
			}
		}
		assert.equal((await get('/en/blog/2026-10-27-eth-false')).response.status, 404);
		const feed = await get('/en/blog/rss.xml');
		assert.equal(feed.response.status, 200);
		assert.match(feed.response.headers.get('content-type'), /(?:application\/rss\+xml|text\/xml)/);
		assert.match(feed.text, /<language>en<\/language>/);
		const sitemap = await get('/sitemap.xml');
		const llms = await get('/llms.txt');
		if (mode === 'approved-fixture') {
			assert.match(feed.text, /<guid isPermaLink="true">https:\/\/www.zero0ne.dev\/en\/blog\//);
			assert.match(feed.text, /<content:encoded><!\[CDATA\[/);
			assert.match(feed.text, /This Friday evening/);
			assert.match(sitemap.text, /xhtml:link rel="alternate" hreflang="en"/);
			assert.match(llms.text, new RegExp('/en/blog/' + slug));
		} else {
			assert.doesNotMatch(feed.text, /<item>/);
			for (const document of [sitemap, llms])
				assert.doesNotMatch(document.text, new RegExp('/en/blog/' + slug));
		}
		const koFeed = await get('/blog/rss.xml');
		assert.match(koFeed.text, /<language>ko<\/language>/);
		assert.match(koFeed.text, /2026-10-27-eth-false/);
		assert.match(list.text, /data-sveltekit-reload/);
	}
);
