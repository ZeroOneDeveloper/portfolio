import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { eligibleTranslation } from '../src/lib/blog/translation-policy.ts';
const root = new URL('..', import.meta.url).pathname;
const slug = '2026-10-29-axit-multi-agent-part-1';
const raw = readFileSync(`${root}/src/lib/blog/posts/${slug}.json`);
const source = JSON.parse(raw);
const t = JSON.parse(readFileSync(`${root}/src/lib/blog/translations/en/${slug}.json`));
const hash = createHash('sha256').update(raw).digest('hex');
assert.equal(eligibleTranslation(t, source, hash, false, true), true);
assert.equal(eligibleTranslation(t, source, hash), false);
for (const alter of [
	(x) => x.localizedMedia.images.reverse(),
	(x) => (x.blocks.find((b) => b.type === 'image').src = '/wrong.png'),
	(x) => (x.sourceSha256 = 'wrong'),
	(x) => (x.review.status = 'draft'),
	(x) => delete x.localizedMedia.review.approvedAt
]) {
	const bad = structuredClone(t);
	alter(bad);
	assert.equal(eligibleTranslation(bad, source, hash, false, true), false);
}
console.log('Localized approval, source drift, media order and fail-closed verification passed');
