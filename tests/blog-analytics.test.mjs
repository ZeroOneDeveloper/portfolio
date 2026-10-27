import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterBlogEvent } from '../src/lib/blog/analytics.ts';
const paths = ['/blog/published'];
const filter = (url, type = 'pageview') => filterBlogEvent({ url, type }, paths);
test('only production published paths; strips all query and hash', () => {
	assert.deepEqual(filter('https://www.zero0ne.dev/blog/published?email=a@b.c#private'), {
		type: 'pageview',
		url: 'https://www.zero0ne.dev/blog/published'
	});
	assert.equal(filter('https://zero0ne.dev/blog/')?.url, 'https://zero0ne.dev/blog');
	for (const p of [
		'/',
		'/dash',
		'/admin',
		'/blog/rss.xml',
		'/blog/unpublished',
		'/blog/published/preview',
		'/blog/%70ublished'
	])
		assert.equal(filter('https://www.zero0ne.dev' + p), null);
	for (const host of ['localhost', 'preview.vercel.app', 'dash.zero0ne.dev'])
		assert.equal(filter('https://' + host + '/blog'), null);
	assert.equal(filter('http://www.zero0ne.dev/blog'), null);
	assert.equal(filter('https://www.zero0ne.dev/blog', 'event'), null);
});

test('English analytics registry accepts approved paths but excludes review drafts', () => {
	const paths = ['/en/blog', '/en/blog/approved'];
	for (const path of paths)
		assert.equal(
			filterBlogEvent(
				{ type: 'pageview', url: 'https://www.zero0ne.dev' + path + '?private=x' },
				paths
			)?.url,
			'https://www.zero0ne.dev' + path
		);
	for (const path of ['/en/blog/draft', '/en/blog/rss.xml'])
		assert.equal(
			filterBlogEvent({ type: 'pageview', url: 'https://www.zero0ne.dev' + path }, paths),
			null
		);
	assert.equal(
		filterBlogEvent({ type: 'pageview', url: 'https://review.vercel.app/en/blog/approved' }, paths),
		null
	);
});
