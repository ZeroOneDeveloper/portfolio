#!/usr/bin/env node
// Brings his Medium posts into the blog, as data: for each post, the text and its markup as
// blocks (src/lib/blog/posts/<slug>.json), its images downloaded to static/blog/<slug>/ (an
// animated GIF becomes a muted MP4 with a poster), and a line in src/lib/blog/medium-map.json,
// which keeps each Medium post's id, URL and slug together.
//
//   node scripts/import-medium.mjs                       every published post
//   node scripts/import-medium.mjs --id <mediumId>       one post (repeat --id for more)
//   node scripts/import-medium.mjs --id <mediumId> --slug 2026-10-21-some-title
//   --force                                              download images again
//
// A post already in medium-map.json keeps its slug; a new one takes --slug, or else
// <YYYY-MM-DD>-<mediumId> (the date it was first published, in Korea). The text is kept
// exactly as published: Medium redirect and Facebook tracking links are unwrapped, and
// links to his other Medium posts point to their pages on the blog.
//
// Needs Node 22 and ffmpeg (for the GIFs). Medium's JSON endpoints need no login.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = path.join(ROOT, 'src/lib/blog/posts');
const MAP_FILE = path.join(ROOT, 'src/lib/blog/medium-map.json');
const STATIC_DIR = path.join(ROOT, 'static/blog');

const USERNAME = 'zeroone-dev';
const USER_AGENT =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
/** Images are kept at this width at most: sharp on a retina screen at the article's width. */
const IMAGE_WIDTH = 1600;
const THUMB_WIDTH = 720;

// --- arguments -------------------------------------------------------------------------

const args = process.argv.slice(2);
const ids = [];
let slugArg;
let force = false;
for (let i = 0; i < args.length; i++) {
	if (args[i] === '--id') ids.push(args[++i]);
	else if (args[i] === '--slug') slugArg = args[++i];
	else if (args[i] === '--force') force = true;
	else {
		console.error(`Unknown argument: ${args[i]}`);
		process.exit(1);
	}
}
if (slugArg && ids.length !== 1) {
	console.error('--slug goes with exactly one --id');
	process.exit(1);
}

// --- Medium ----------------------------------------------------------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Medium's JSON, which it serves behind a guard against being run as a script. */
async function mediumJson(url) {
	for (let attempt = 1; ; attempt++) {
		const response = await fetch(url, {
			headers: { 'user-agent': USER_AGENT, accept: 'application/json' }
		});
		const text = await response.text();
		if (response.ok) return JSON.parse(text.replace(/^\]\)\}while\(1\);<\/x>/, ''));
		if (attempt >= 3) {
			throw new Error(
				`${response.status} from ${url}. If Medium keeps refusing, read the post in a ` +
					'logged-in browser instead.'
			);
		}
		await sleep(2000 * attempt);
	}
}

/** Every post he has published, newest first, from his profile's stream. */
async function listPublished() {
	let page = await mediumJson(`https://medium.com/@${USERNAME}/latest?format=json&limit=100`);
	const userId = page.payload.user.userId;
	const posts = new Map();
	for (let pages = 0; pages < 100; pages++) {
		for (const post of Object.values(page.payload.references?.Post ?? {})) {
			if (post.creatorId === userId && post.firstPublishedAt) posts.set(post.id, post);
		}
		const next = page.payload.paging?.next;
		if (!next || Object.keys(next).length === 0) break;
		const query = new URLSearchParams({ format: 'json', limit: '100' });
		for (const [key, value] of Object.entries(next)) {
			if (!Array.isArray(value)) query.set(key, String(value));
		}
		page = await mediumJson(`${page.payload.paging.path}?${query}`);
	}
	return [...posts.values()].sort((a, b) => b.firstPublishedAt - a.firstPublishedAt);
}

// --- dates -----------------------------------------------------------------------------

/** 1791960738512 → 2026-10-14T15:52:18+09:00, the time in Korea, where he writes. */
function kst(ms) {
	return new Date(ms + 9 * 3600e3).toISOString().replace(/\.\d+Z$/, '+09:00');
}

// --- links -----------------------------------------------------------------------------

/** Medium post id → blog slug, for links between his own posts. */
const slugById = new Map();

/** The real address behind a link, without tracking, or the blog's page for his own post. */
function cleanHref(href) {
	let url;
	try {
		url = new URL(href);
	} catch {
		return href;
	}
	const host = url.hostname.replace(/^www\./, '');
	if (host === 'medium.com' && url.pathname === '/r/' && url.searchParams.get('url')) {
		return cleanHref(url.searchParams.get('url'));
	}
	if (host.endsWith('facebook.com') && url.pathname === '/l.php' && url.searchParams.get('u')) {
		return cleanHref(url.searchParams.get('u'));
	}
	if (host === 'medium.com' || host.endsWith('.medium.com')) {
		const last = url.pathname.split('/').filter(Boolean).pop() ?? '';
		const id = last.match(/(?:^|-)([0-9a-f]{8,12})$/)?.[1];
		if (id && slugById.has(id)) return `/blog/${slugById.get(id)}`;
		if (id) console.warn(`  ! links to a Medium post that is not on the blog: ${href}`);
	}
	// Drop Facebook's click id, leaving the rest of the address as it was written.
	return href.replace(/([?&])fbclid=[^&#]*&?/, '$1').replace(/[?&](#|$)/, '$1');
}

function markupHref(markup) {
	if (markup.anchorType === 2 && markup.userId) return `https://medium.com/u/${markup.userId}`;
	if (markup.href) return cleanHref(markup.href);
	return undefined;
}

// --- text ------------------------------------------------------------------------------

/**
 * A paragraph's text and markups as spans: runs of text that share their formatting
 * (bold, italic, code, a link). An address written out in full but not linked, as in many
 * captions, becomes a link to itself.
 */
function spansOf(text = '', markups = []) {
	const marks = markups.map((markup) => ({
		start: Math.max(0, Math.min(text.length, markup.start)),
		end: Math.max(0, Math.min(text.length, markup.end)),
		type: markup.type,
		href: markup.type === 3 ? markupHref(markup) : undefined
	}));
	for (const match of text.matchAll(/https?:\/\/[^\s<>"'“”‘’]+[^\s<>"'“”‘’.,;:!?)\]]/g)) {
		const start = match.index;
		const end = start + match[0].length;
		const linked = marks.some((mark) => mark.type === 3 && mark.start < end && mark.end > start);
		if (!linked) marks.push({ start, end, type: 3, href: cleanHref(match[0]) });
	}

	const points = [...new Set([0, text.length, ...marks.flatMap((m) => [m.start, m.end])])].sort(
		(a, b) => a - b
	);
	const spans = [];
	for (let i = 0; i < points.length - 1; i++) {
		const [start, end] = [points[i], points[i + 1]];
		if (start === end) continue;
		const span = { text: text.slice(start, end) };
		for (const mark of marks) {
			if (mark.start > start || mark.end < end) continue;
			if (mark.type === 1) span.bold = true;
			else if (mark.type === 2) span.italic = true;
			else if (mark.type === 10) span.code = true;
			else if (mark.type === 3 && mark.href) span.href = mark.href;
		}
		const last = spans.at(-1);
		const same = (a, b) =>
			a.bold === b.bold && a.italic === b.italic && a.code === b.code && a.href === b.href;
		if (last && same(last, span)) last.text += span.text;
		else spans.push(span);
	}
	return spans;
}

const plain = (spans) => spans.map((span) => span.text).join('');

// --- files -----------------------------------------------------------------------------

const EXTENSIONS = {
	'image/jpeg': 'jpeg',
	'image/png': 'png',
	'image/gif': 'gif',
	'image/webp': 'webp'
};

/** Width and height read from a PNG, GIF, JPEG or WebP file's header. */
function imageSize(file) {
	const b = fs.readFileSync(file);
	if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
	if (b.toString('ascii', 0, 3) === 'GIF') return [b.readUInt16LE(6), b.readUInt16LE(8)];
	if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
		const chunk = b.toString('ascii', 12, 16);
		if (chunk === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
		if (chunk === 'VP8L') {
			const bits = b.readUInt32LE(21);
			return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
		}
		return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
	}
	if (b[0] === 0xff && b[1] === 0xd8) {
		let offset = 2;
		while (offset < b.length) {
			const marker = b[offset + 1];
			const length = b.readUInt16BE(offset + 2);
			if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
				return [b.readUInt16BE(offset + 7), b.readUInt16BE(offset + 5)];
			}
			offset += 2 + length;
		}
	}
	throw new Error(`Unknown image format: ${file}`);
}

async function download(url, file) {
	for (let attempt = 1; ; attempt++) {
		const response = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
		if (response.ok) {
			fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()));
			return response.headers.get('content-type')?.split(';')[0];
		}
		if (attempt >= 3) throw new Error(`${response.status} from ${url}`);
		await sleep(1500 * attempt);
	}
}

/**
 * Runs ffmpeg on one picture or clip, laying each frame over white first, so a transparent
 * GIF or PNG never turns black, then scaling it if asked.
 */
const ffmpeg = (input, output, { scale, options = '' }) =>
	execFileSync('ffmpeg', [
		...['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-filter_complex'],
		`[0]split[a][b];[a]drawbox=c=white:t=fill[bg];[bg][b]overlay${scale ? `,scale=${scale}` : ''}`,
		...options.split(' ').filter(Boolean),
		output
	]);

/** A Medium image id as a file name: 1*LORHaJ_3pmA8uaR5Gyf6tg.jpeg → 1-LORHaJ_3pmA8uaR5Gyf6tg */
const baseName = (imageId) => imageId.replace(/\.[a-z]+$/i, '').replace(/[^A-Za-z0-9_-]/g, '-');

/**
 * Downloads one of the post's images into its folder, once, and returns where it is and how
 * large. An animated GIF (5 MB or more on Medium) becomes an MP4 a tenth its size, with its
 * first frame as a poster.
 */
async function saveImage(slug, imageId) {
	const dir = path.join(STATIC_DIR, slug);
	fs.mkdirSync(dir, { recursive: true });
	const base = baseName(imageId);
	const existing = fs.readdirSync(dir).filter((name) => name.startsWith(`${base}.`));

	if (/\.gif$/i.test(imageId)) {
		const video = path.join(dir, `${base}.mp4`);
		const poster = path.join(dir, `${base}.jpg`);
		if (force || !fs.existsSync(video) || !fs.existsSync(poster)) {
			const gif = path.join(os.tmpdir(), `medium-${base}.gif`);
			await download(`https://miro.medium.com/v2/${imageId}`, gif);
			// Even sides for H.264; frames as the GIF times them; no sound track.
			ffmpeg(gif, video, {
				scale: 'trunc(iw/2)*2:trunc(ih/2)*2',
				options: '-movflags +faststart -pix_fmt yuv420p -c:v libx264 -crf 23 -preset slow -an'
			});
			ffmpeg(gif, poster, { options: '-frames:v 1 -q:v 3' });
			fs.rmSync(gif);
		}
		const [width, height] = imageSize(poster);
		return {
			video: `/blog/${slug}/${base}.mp4`,
			poster: `/blog/${slug}/${base}.jpg`,
			width,
			height
		};
	}

	let file = existing.find((name) => !name.endsWith('.thumb.jpg'));
	if (force || !file) {
		const temp = path.join(dir, `${base}.download`);
		const type = await download(
			`https://miro.medium.com/v2/resize:fit:${IMAGE_WIDTH}/${imageId}`,
			temp
		);
		const extension = EXTENSIONS[type] ?? imageId.match(/\.([a-z]+)$/i)?.[1] ?? 'jpeg';
		file = `${base}.${extension}`;
		fs.renameSync(temp, path.join(dir, file));
	}
	const [width, height] = imageSize(path.join(dir, file));
	return { src: `/blog/${slug}/${file}`, width, height };
}

/**
 * A YouTube video's thumbnail, kept with the post: the page shows it, with a play button,
 * until the video is played. The largest YouTube has, else the one every video has.
 */
async function saveYoutubeThumbnail(slug, videoId) {
	const file = path.join(STATIC_DIR, slug, `youtube-${videoId}.jpg`);
	if (force || !fs.existsSync(file)) {
		fs.mkdirSync(path.dirname(file), { recursive: true });
		try {
			await download(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`, file);
		} catch {
			await download(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, file);
		}
	}
	const [width, height] = imageSize(file);
	return { src: `/blog/${slug}/${path.basename(file)}`, width, height };
}

/** The cover, smaller, for the list on /blog: a JPEG on white. */
function saveThumb(slug, cover) {
	const source = path.join(ROOT, 'static', cover);
	const thumb = source.replace(/\.[a-z]+$/i, '.thumb.jpg');
	if (force || !fs.existsSync(thumb)) {
		ffmpeg(source, thumb, {
			scale: `'min(${THUMB_WIDTH},iw)':-2`,
			options: '-frames:v 1 -q:v 3'
		});
	}
	const [width, height] = imageSize(thumb);
	return { src: `/blog/${slug}/${path.basename(thumb)}`, width, height };
}

// --- blocks ----------------------------------------------------------------------------

const warnings = [];

async function blocksOf(slug, post) {
	const { paragraphs, sections = [] } = post.content.bodyModel;
	const breaks = new Set(
		sections.map((section) => section.startIndex).filter((index) => index > 0)
	);
	const blocks = [];
	const images = new Map();

	for (const [index, paragraph] of paragraphs.entries()) {
		// The first paragraph is the title, shown above the article.
		if (index === 0 && paragraph.type === 3) continue;
		if (breaks.has(index) && blocks.length > 0) blocks.push({ type: 'hr' });

		const spans = spansOf(paragraph.text, paragraph.markups);
		const last = blocks.at(-1);
		switch (paragraph.type) {
			case 1:
				if (paragraph.text.trim()) blocks.push({ type: 'p', spans });
				break;
			case 3:
				blocks.push({ type: 'h2', spans });
				break;
			case 13:
				blocks.push({ type: 'h3', spans });
				break;
			case 6:
				// Consecutive quote paragraphs read as one quote, as on Medium.
				if (last?.type === 'quote' && !breaks.has(index)) last.paragraphs.push(spans);
				else blocks.push({ type: 'quote', paragraphs: [spans] });
				break;
			case 7:
				blocks.push({ type: 'pullquote', spans });
				break;
			case 8:
				blocks.push({
					type: 'code',
					text: paragraph.text,
					lang: paragraph.codeBlockMetadata?.lang
				});
				break;
			case 9:
			case 10: {
				const type = paragraph.type === 9 ? 'ul' : 'ol';
				if (last?.type === type && !breaks.has(index)) last.items.push(spans);
				else blocks.push({ type, items: [spans] });
				break;
			}
			case 4: {
				const { id, originalWidth, originalHeight } = paragraph.metadata;
				const saved = await saveImage(slug, id);
				images.set(id, saved);
				const caption = paragraph.text ? spans : undefined;
				// The caption says what the picture shows, unless it is only the address it came from.
				const words = plain(spans).trim();
				const alt = paragraph.metadata.alt || (/^https?:\/\/\S+$/.test(words) ? '' : words);
				if (saved.video) {
					blocks.push({
						type: 'video',
						src: saved.video,
						poster: saved.poster,
						width: saved.width,
						height: saved.height,
						alt,
						caption
					});
				} else {
					blocks.push({
						type: 'image',
						src: saved.src,
						width: saved.width || originalWidth,
						height: saved.height || originalHeight,
						alt,
						caption
					});
				}
				break;
			}
			case 11: {
				const thumbnail = decodeURIComponent(paragraph.iframe?.thumbnailUrl ?? '');
				const youtube = thumbnail.match(/ytimg\.com\/vi\/([\w-]{11})\//)?.[1];
				const caption = paragraph.text ? spans : undefined;
				if (youtube) {
					blocks.push({
						type: 'youtube',
						id: youtube,
						title: plain(spans) || 'YouTube 동영상',
						thumbnail: await saveYoutubeThumbnail(slug, youtube),
						caption
					});
				} else {
					warnings.push(
						`${slug}: an embed that is not YouTube (${paragraph.iframe?.mediaResourceId}) is shown as its caption only`
					);
					if (caption) blocks.push({ type: 'p', spans: caption });
				}
				break;
			}
			case 14: {
				// A link card: its title is the bold run, its description the italic one, and the
				// rest the site's name.
				const meta = paragraph.mixtapeMetadata ?? {};
				const href = cleanHref(meta.href ?? spans.find((span) => span.href)?.href ?? '');
				const title = spans
					.filter((span) => span.bold)
					.map((span) => span.text)
					.join('')
					.trim();
				const description = spans
					.filter((span) => span.italic && !span.bold)
					.map((span) => span.text)
					.join('')
					.trim();
				const site = spans
					.filter((span) => !span.bold && !span.italic)
					.map((span) => span.text)
					.join('')
					.trim();
				const image = meta.thumbnailImageId
					? (await saveImage(slug, meta.thumbnailImageId)).src
					: undefined;
				blocks.push({ type: 'bookmark', href, title: title || href, description, site, image });
				break;
			}
			default:
				warnings.push(`${slug}: paragraph ${index} has type ${paragraph.type}, kept as text`);
				if (paragraph.text.trim()) blocks.push({ type: 'p', spans });
		}
	}
	return { blocks, images };
}

// --- one post --------------------------------------------------------------------------

async function importPost(mediumId, map) {
	const post = (await mediumJson(`https://medium.com/p/${mediumId}?format=json`)).payload.value;
	if (!post.firstPublishedAt) throw new Error(`${mediumId} is not published`);
	const entry = map.find((item) => item.mediumId === mediumId);
	const slug = entry?.slug ?? slugById.get(mediumId);
	console.log(`${slug}  ${post.title}`);

	const { blocks, images } = await blocksOf(slug, post);
	const [first] = post.content.bodyModel.paragraphs;
	// The title as it reads at the top of the post on Medium.
	const title = first?.type === 3 && first.text.trim() ? first.text.trim() : post.title;
	const firstText =
		post.content.bodyModel.paragraphs.find((p) => p.type === 1 && p.text.trim())?.text ?? '';
	const description = (post.content.subtitle || firstText).trim();

	let cover;
	const previewId = post.virtuals?.previewImage?.imageId;
	if (previewId) {
		const saved = images.get(previewId) ?? (await saveImage(slug, previewId));
		const src = saved.src ?? saved.poster;
		cover = { src, width: saved.width, height: saved.height, thumb: saveThumb(slug, src) };
	}

	const data = {
		slug,
		title,
		description,
		publishedAt: kst(post.firstPublishedAt),
		updatedAt: kst(post.latestPublishedAt || post.firstPublishedAt),
		readingMinutes: Math.max(1, Math.ceil(post.virtuals?.readingTime ?? 1)),
		tags: (post.virtuals?.tags ?? []).map((tag) => tag.name),
		mediumId,
		mediumUrl: post.mediumUrl,
		cover,
		blocks
	};
	fs.writeFileSync(path.join(POSTS_DIR, `${slug}.json`), JSON.stringify(data, null, '\t') + '\n');

	// The dashboard's id for the post, where it has one, stays with it.
	const line = { mediumId, mediumUrl: post.mediumUrl, slug, title, publishedAt: data.publishedAt };
	if (entry?.dashboardId) line.dashboardId = entry.dashboardId;
	if (entry) map[map.indexOf(entry)] = line;
	else map.push(line);
}

// --- all of it -------------------------------------------------------------------------

const map = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, 'utf8')) : [];
for (const item of map) slugById.set(item.mediumId, item.slug);

const published = await listPublished();
const targets = ids.length > 0 ? ids : published.map((post) => post.id);
for (const id of targets) {
	if (slugById.has(id)) continue;
	const known = published.find((post) => post.id === id);
	const date = known ? kst(known.firstPublishedAt).slice(0, 10) : kst(Date.now()).slice(0, 10);
	slugById.set(id, slugArg ?? `${date}-${id}`);
}

fs.mkdirSync(POSTS_DIR, { recursive: true });
for (const id of targets) {
	await importPost(id, map);
	await sleep(300);
}

map.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, '\t') + '\n');

const missing = published.filter((post) => !map.some((item) => item.mediumId === post.id));
console.log(
	`\n${targets.length} imported; ${map.length} on the blog, ${published.length} published on Medium.`
);
if (missing.length)
	console.log(`Not on the blog yet: ${missing.map((post) => post.id).join(', ')}`);
for (const warning of warnings) console.warn(`! ${warning}`);
