import type { Post } from './types';

export interface Translation extends Post {
	localizedMedia?: {
		review: { status: string; approvedBy?: string; approvedAt?: string };
		images: {
			source: string;
			translated: string;
			sourceSha256: string;
			translatedSha256: string;
		}[];
	};
	translationPublishedAt?: string;
	language: 'en';
	translationOf: string;
	sourceSha256: string;
	sourceUpdatedAt: string;
	review: { status: 'draft' | 'approved'; approvedBy?: string; approvedAt?: string };
	provenance: { writer: string; artifact: string };
}

// Production wins over the explicit local switch. This is a build-time decision.
export function previewEnabled(environment: string | undefined, localFlag: string | undefined) {
	return environment === 'preview' || (!environment && localFlag === '1');
}

// Keep all non-text media fields, order, block kinds and links bound to the source.
function stableLink(href: string) {
	try {
		const url = new URL(href);
		if (url.hostname === 'www.facebook.com') {
			for (const key of [...url.searchParams.keys()])
				if (key === '__tn__' || key.startsWith('__cft__')) url.searchParams.delete(key);
		}
		return url.href;
	} catch {
		return href;
	}
}
function structure(post: Post) {
	return {
		cover: post.cover,
		blocks: post.blocks.map((block) => {
			const copy = JSON.parse(JSON.stringify(block));
			const scrub = (value: unknown): unknown => {
				if (Array.isArray(value)) return value.map(scrub);
				if (value && typeof value === 'object')
					return Object.fromEntries(
						Object.entries(value)
							.filter(([key]) => !['text', 'alt', 'title', 'description', 'site'].includes(key))
							.map(([key, value]) => [
								key,
								key === 'href' && typeof value === 'string' ? stableLink(value) : scrub(value)
							])
					);
				return value;
			};
			return scrub(copy);
		})
	};
}

export function eligibleTranslation(
	translation: Translation,
	source: Post | undefined,
	hash: string,
	preview = false,
	localizedAssetsVerified = false
) {
	if (
		!source ||
		translation.language !== 'en' ||
		translation.slug !== source.slug ||
		translation.translationOf !== source.slug ||
		translation.sourceSha256 !== hash ||
		translation.sourceUpdatedAt !== source.updatedAt ||
		translation.publishedAt !== source.publishedAt
	)
		return false;
	const comparable = structuredClone(translation);
	if (translation.localizedMedia) {
		const mapping = translation.localizedMedia;
		if (
			!localizedAssetsVerified ||
			mapping.review.status !== 'approved' ||
			!mapping.review.approvedBy ||
			!mapping.review.approvedAt
		)
			return false;
		const sourceImages = source.blocks.filter((b) => b.type === 'image');
		const images = comparable.blocks.filter((b) => b.type === 'image');
		if (images.length !== mapping.images.length || images.length !== sourceImages.length)
			return false;
		for (let i = 0; i < images.length; i++) {
			const entry = mapping.images[i];
			if (
				entry.source !== sourceImages[i].src ||
				entry.translated !== images[i].src ||
				!/^\w{64}$/.test(entry.sourceSha256) ||
				!/^\w{64}$/.test(entry.translatedSha256)
			)
				return false;
			images[i].src = entry.source;
		}
	}
	if (JSON.stringify(structure(comparable)) !== JSON.stringify(structure(source))) return false;
	if (!translation.provenance?.writer || !translation.provenance?.artifact) return false;
	return (
		(translation.review?.status === 'approved' &&
			!!translation.review.approvedBy &&
			!!translation.review.approvedAt) ||
		(preview && translation.review?.status === 'draft')
	);
}

export function englishReadingMinutes(post: Post) {
	const text: string[] = [];
	const visit = (value: unknown): void => {
		if (Array.isArray(value)) value.forEach(visit);
		else if (value && typeof value === 'object')
			for (const [key, entry] of Object.entries(value)) {
				if (key === 'text' && typeof entry === 'string') text.push(entry);
				else if (typeof entry === 'object') visit(entry);
			}
	};
	visit(post.blocks);
	return Math.max(1, Math.ceil((text.join(' ').match(/\b[\w’'-]+\b/g) ?? []).length / 200));
}
