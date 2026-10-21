// A post as scripts/import-medium.mjs writes it to src/lib/blog/posts/<slug>.json: his text
// exactly as published on Medium, in blocks, with its images on this site.

/** A run of text that shares its formatting. */
export interface Span {
	text: string;
	bold?: boolean;
	italic?: boolean;
	code?: boolean;
	/** An address on another site, or /blog/<slug> for another of his posts. */
	href?: string;
}

export type Block =
	| { type: 'p' | 'h2' | 'h3' | 'pullquote'; spans: Span[] }
	| { type: 'quote'; paragraphs: Span[][] }
	| { type: 'ul' | 'ol'; items: Span[][] }
	| { type: 'code'; text: string; lang?: string }
	| {
			type: 'image';
			src: string;
			width: number;
			height: number;
			alt: string;
			caption?: Span[];
	  }
	| {
			/** An animated GIF on Medium, here a muted, looping MP4. */
			type: 'video';
			src: string;
			poster: string;
			width: number;
			height: number;
			alt: string;
			caption?: Span[];
	  }
	| {
			/** A YouTube video: its thumbnail, kept on this site, until it is played. */
			type: 'youtube';
			id: string;
			title: string;
			thumbnail: Picture;
			caption?: Span[];
	  }
	| {
			/** A link card. */
			type: 'bookmark';
			href: string;
			title: string;
			description?: string;
			site?: string;
			image?: string;
	  }
	/** Where Medium starts a new section. */
	| { type: 'hr' };

export interface Picture {
	src: string;
	width: number;
	height: number;
}

export interface Post {
	slug: string;
	title: string;
	/** Medium's subtitle for the post: its first lines, as he wrote them. */
	description: string;
	/** ISO 8601 in Korean time, e.g. 2026-10-14T15:52:18+09:00. */
	publishedAt: string;
	updatedAt: string;
	readingMinutes: number;
	tags: string[];
	mediumId: string;
	mediumUrl: string;
	/** The post's preview image on Medium, with a smaller copy for the list. */
	cover?: Picture & { thumb: Picture };
	blocks: Block[];
}

/** What the pages show of a post besides its text. */
export type PostSummary = Omit<Post, 'blocks' | 'mediumId' | 'mediumUrl'>;
