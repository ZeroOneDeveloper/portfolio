import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import {
	eligibleTranslation,
	translationDisplayCover,
	englishReadingMinutes,
	previewEnabled
} from '../src/lib/blog/translation-policy.ts';
import { languageForPath } from '../src/lib/blog/locale.ts';

const slug = '2026-07-25-ax-for-good-session';
const raw = readFileSync(new URL(`../src/lib/blog/posts/${slug}.json`, import.meta.url));
const source = JSON.parse(raw);
const draft = JSON.parse(
	readFileSync(new URL(`../src/lib/blog/translations/en/${slug}.json`, import.meta.url))
);
const hash = createHash('sha256').update(raw).digest('hex');
const copy = () => structuredClone(draft);

test('draft gate is explicit and production cannot be overridden locally', () => {
	assert.equal(previewEnabled(undefined, undefined), false);
	assert.equal(previewEnabled('production', '1'), false);
	assert.equal(previewEnabled('development', '1'), false);
	assert.equal(previewEnabled(undefined, '1'), true);
	assert.equal(previewEnabled('preview', undefined), true);
	assert.equal(eligibleTranslation(draft, source, hash), false);
	assert.equal(eligibleTranslation(draft, source, hash, true), true);
});
test('approval is independent; source drift, dates and media changes fail closed', () => {
	const approved = copy();
	approved.review = {
		status: 'approved',
		approvedBy: 'test fixture only',
		approvedAt: '2026-10-27T00:00:00Z'
	};
	assert.equal(eligibleTranslation(approved, source, hash), true);
	for (const change of [
		(p) => (p.sourceSha256 = 'stale'),
		(p) => (p.sourceUpdatedAt = 'stale'),
		(p) => (p.publishedAt = 'today'),
		(p) => (p.translationOf = 'missing'),
		(p) => p.blocks.reverse(),
		(p) => (p.blocks[3].src = '/changed.jpg'),
		(p) => (p.cover.thumb.src = '/changed.jpg'),
		(p) => delete p.review.approvedBy
	]) {
		const invalid = structuredClone(approved);
		change(invalid);
		assert.equal(eligibleTranslation(invalid, source, hash), false);
	}
	assert.equal(eligibleTranslation(approved, undefined, hash), false);
});
test('exact sample preserves 15 blocks, six image paths/dimensions/order and historical date', () => {
	assert.equal(source.blocks.length, 15);
	assert.equal(draft.blocks.length, 15);
	const media = (p) =>
		p.blocks
			.filter((b) => b.type === 'image')
			.map(({ src, width, height }) => ({ src, width, height }));
	assert.equal(media(source).length, 6);
	assert.deepEqual(media(draft), media(source));
	assert.deepEqual(draft.cover, source.cover);
	assert.equal(draft.publishedAt, source.publishedAt);
	assert.notEqual(draft.title, source.title);
	assert.equal(draft.review.status, 'draft');
});
test('English reading time uses words, and path language has a segment boundary', () => {
	assert.equal(
		englishReadingMinutes({ blocks: [{ type: 'p', spans: [{ text: 'word '.repeat(401) }] }] }),
		3
	);
	assert.equal(languageForPath('/en/blog'), 'en');
	for (const path of ['/', '/blog/test', '/english']) assert.equal(languageForPath(path), 'ko');
});

test('localized cover is opt-in and requires full approval, source binding and verified assets', () => {
	const slug = '2026-10-29-axit-multi-agent-part-2';
	const raw = readFileSync(new URL(`../src/lib/blog/posts/${slug}.json`, import.meta.url));
	const source = JSON.parse(raw);
	const hash = createHash('sha256').update(raw).digest('hex');
	const translation = JSON.parse(
		readFileSync(new URL(`../src/lib/blog/translations/en/${slug}.json`, import.meta.url))
	);
	for (const entry of translation.localizedMedia.images) {
		for (const [path, digest] of [
			['source', 'sourceSha256'],
			['translated', 'translatedSha256']
		]) {
			assert.equal(
				createHash('sha256')
					.update(readFileSync(new URL(`../static${entry[path]}`, import.meta.url)))
					.digest('hex'),
				entry[digest]
			);
		}
	}
	assert.equal(eligibleTranslation(translation, source, hash, false, true), true);
	assert.equal(
		translationDisplayCover(translation, source, hash, true).src,
		translation.blocks[0].src
	);
	assert.deepEqual(translation.cover, source.cover);
	assert.deepEqual(translationDisplayCover(translation, source, hash, false), source.cover);
	for (const change of [
		(p) => delete p.useLocalizedCover,
		(p) => (p.review.status = 'draft'),
		(p) => (p.localizedMedia.review.status = 'draft'),
		(p) => (p.localizedMedia.images[0].source = '/wrong.png'),
		(p) => (p.localizedMedia.images[0].translated = '/wrong.png'),
		(p) => (p.sourceSha256 = 'stale'),
		(p) => (p.cover.src = '/unreviewed.png')
	]) {
		const invalid = structuredClone(translation);
		change(invalid);
		assert.deepEqual(translationDisplayCover(invalid, source, hash, true), invalid.cover);
	}
});
