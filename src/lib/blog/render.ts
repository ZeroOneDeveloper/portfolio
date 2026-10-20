// A post's blocks as HTML, for its page and for the RSS feed. Every piece of text and every
// address is escaped here, so the result is safe to place as it is.
import type { Block, Span } from './types';

const escape = (text: string): string =>
	text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

interface Options {
	/** The site's address, for HTML read away from it (RSS); left out, paths stay relative. */
	base?: string;
}

/** An address to use in href or src: only http(s), mailto and paths on this site. */
function address(href: string, { base }: Options): string | undefined {
	if (href.startsWith('/')) return base ? new URL(href, base).href : href;
	if (/^(https?:|mailto:)/i.test(href)) return href;
	return undefined;
}

function inline(spans: Span[], options: Options): string {
	// Runs that share a link go in one <a>, whatever their formatting.
	const groups: { href?: string; spans: Span[] }[] = [];
	for (const span of spans) {
		const last = groups.at(-1);
		if (last && last.href === span.href) last.spans.push(span);
		else groups.push({ href: span.href, spans: [span] });
	}

	return groups
		.map((group) => {
			const html = group.spans
				.map((span) => {
					let text = escape(span.text).replaceAll('\n', '<br>');
					if (span.code) text = `<code>${text}</code>`;
					if (span.italic) text = `<em>${text}</em>`;
					if (span.bold) text = `<strong>${text}</strong>`;
					return text;
				})
				.join('');
			const href = group.href && address(group.href, options);
			return href ? `<a href="${escape(href)}">${html}</a>` : html;
		})
		.join('');
}

const caption = (spans: Span[] | undefined, options: Options) =>
	spans?.length ? `<figcaption>${inline(spans, options)}</figcaption>` : '';

function block(entry: Block, options: Options, index: number): string {
	switch (entry.type) {
		case 'p':
			return `<p>${inline(entry.spans, options)}</p>`;
		case 'h2':
		case 'h3':
			return `<${entry.type}>${inline(entry.spans, options)}</${entry.type}>`;
		case 'pullquote':
			return `<blockquote class="pullquote"><p>${inline(entry.spans, options)}</p></blockquote>`;
		case 'quote':
			return `<blockquote>${entry.paragraphs.map((spans) => `<p>${inline(spans, options)}</p>`).join('')}</blockquote>`;
		case 'ul':
		case 'ol':
			return `<${entry.type}>${entry.items.map((spans) => `<li>${inline(spans, options)}</li>`).join('')}</${entry.type}>`;
		case 'code':
			return `<pre><code${entry.lang ? ` class="language-${escape(entry.lang)}"` : ''}>${escape(entry.text)}</code></pre>`;
		case 'image': {
			// The first picture may be in the first view: it loads at once, the rest as they near.
			const loading = index < 3 ? '' : ' loading="lazy"';
			return `<figure><img src="${escape(address(entry.src, options) ?? '')}" width="${entry.width}" height="${entry.height}" alt="${escape(entry.alt)}"${loading} decoding="async">${caption(entry.caption, options)}</figure>`;
		}
		case 'video': {
			const src = escape(address(entry.src, options) ?? '');
			const poster = escape(address(entry.poster, options) ?? '');
			if (options.base) {
				// Feed readers seldom play video: the first frame, linking to the clip.
				return `<figure><a href="${src}"><img src="${poster}" width="${entry.width}" height="${entry.height}" alt="${escape(entry.alt)}"></a>${caption(entry.caption, options)}</figure>`;
			}
			const label = entry.alt ? ` aria-label="${escape(entry.alt)}"` : '';
			return `<figure><video src="${src}" poster="${poster}" width="${entry.width}" height="${entry.height}" autoplay muted loop playsinline preload="metadata"${label}></video>${caption(entry.caption, options)}</figure>`;
		}
		case 'youtube': {
			// The thumbnail, linking to the video on YouTube. On the page, a click plays it in
			// place instead (src/routes/blog/[slug]/+page.svelte); nothing loads from YouTube
			// before that.
			const watch = escape(`https://www.youtube.com/watch?v=${entry.id}`);
			const thumbnail = escape(address(entry.thumbnail.src, options) ?? '');
			const image = `<img src="${thumbnail}" width="${entry.thumbnail.width}" height="${entry.thumbnail.height}" alt="" loading="lazy" decoding="async">`;
			if (options.base) {
				return `<figure><a href="${watch}">${image}</a>${caption(entry.caption, options)}</figure>`;
			}
			return `<figure class="embed"><a class="embed-frame" href="${watch}" data-youtube="${escape(entry.id)}" aria-label="${escape(entry.title)}, YouTube 동영상 재생">${image}<span class="embed-play" aria-hidden="true"></span></a>${caption(entry.caption, options)}</figure>`;
		}
		case 'bookmark': {
			const href = escape(address(entry.href, options) ?? '#');
			const image = entry.image
				? `<img src="${escape(address(entry.image, options) ?? '')}" alt="" loading="lazy" decoding="async">`
				: '';
			const description = entry.description
				? `<span class="bookmark-description">${escape(entry.description)}</span>`
				: '';
			const site = entry.site ? `<span class="bookmark-site">${escape(entry.site)}</span>` : '';
			return `<a class="bookmark" href="${href}"><span class="bookmark-text"><span class="bookmark-title">${escape(entry.title)}</span>${description}${site}</span>${image}</a>`;
		}
		case 'hr':
			return '<hr>';
	}
}

export function renderBlocks(blocks: Block[], options: Options = {}): string {
	return blocks.map((entry, index) => block(entry, options, index)).join('\n');
}
