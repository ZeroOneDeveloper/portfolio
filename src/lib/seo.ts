// What search engines and AI assistants read about him beyond the page itself: the
// structured data (schema.org JSON-LD) that says whose site this is and who he is. Google
// uses it to tell him apart from others of the same name and to tie his profiles together,
// the groundwork of a knowledge panel. Everything comes from content.ts, so it always
// agrees with the page.
import { blogPath, labels, type Language } from './blog/locale';
import type { PostSummary } from './blog/types';
import {
	blog,
	focusAreas,
	hero,
	meta,
	namedArticles,
	otherProfiles,
	portrait,
	profile,
	profileLinks
} from './content';

const site = profile.url;

/** An absolute URL on the site: structured data is read out of the page's context. */
export const absolute = (path: string): string => new URL(path, site).href;

/** A node of the graph, named by a fragment of the site's URL. */
const node = (name: string) => ({ '@id': `${site}#${name}` });

/** 2026.10.08 → 2026-10-08 */
const isoDate = (date: string) => date.replaceAll('.', '-');

const person = {
	'@type': 'Person',
	...node('person'),
	name: profile.name,
	alternateName: [profile.nameEn, profile.handle],
	familyName: profile.familyName,
	givenName: profile.givenName,
	url: site,
	...(profile.photo
		? {
				image: {
					'@type': 'ImageObject',
					url: absolute(profile.photo),
					width: portrait.width,
					height: portrait.height,
					caption: portrait.alt
				}
			}
		: {}),
	description: hero.intro.join(' '),
	jobTitle: profile.role,
	worksFor: {
		'@type': 'Organization',
		name: profile.company.name,
		alternateName: profile.company.nameEn,
		url: profile.company.url
	},
	affiliation: {
		'@type': 'CollegeOrUniversity',
		name: profile.school.name,
		alternateName: profile.school.alternateNames,
		url: profile.school.url
	},
	alumniOf: {
		'@type': 'HighSchool',
		name: profile.highSchool.name,
		url: profile.highSchool.url
	},
	knowsAbout: focusAreas.map((area) => area.title),
	identifier: {
		'@type': 'PropertyValue',
		propertyID: 'ORCID',
		value: profile.orcid,
		url: `https://orcid.org/${profile.orcid}`
	},
	sameAs: [...profileLinks.map((link) => link.href), ...otherProfiles],
	// The coverage that names him, as listed in 기사.
	subjectOf: namedArticles.map((article) => ({
		'@type': 'NewsArticle',
		headline: article.headline,
		url: article.href,
		datePublished: isoDate(article.date),
		publisher: { '@type': 'Organization', name: article.outlet }
	}))
};

/** The page is his profile, on his own site. */
export const jsonLd = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'ProfilePage',
			'@id': site,
			url: site,
			name: meta.title,
			description: meta.description,
			inLanguage: 'ko-KR',
			isPartOf: node('website'),
			mainEntity: node('person')
		},
		{
			'@type': 'WebSite',
			...node('website'),
			url: site,
			name: profile.handle,
			alternateName: [profile.name, new URL(site).hostname.replace(/^www\./, '')],
			inLanguage: 'ko-KR',
			publisher: node('person')
		},
		person
	]
};

// --- The blog ------------------------------------------------------------------------------

/** A post's page: /blog/<slug>. */
export const postPath = (slug: string, language: Language = 'ko'): string =>
	`${blogPath(language)}/${slug}`;

/**
 * He wrote every post and publishes the blog himself: the same node as the home page's
 * Person, by its @id, with his name and site for readers that do not follow the reference.
 */
const author = { '@type': 'Person', ...node('person'), name: profile.name, url: site };

const blogId = (language: Language) => `${absolute(blogPath(language))}#blog`;

/** The post's own picture, or the site's card when it has none. */
export const postImage = (post: PostSummary) =>
	post.cover
		? { src: absolute(post.cover.src), width: post.cover.width, height: post.cover.height }
		: { src: absolute(meta.image.src), width: meta.image.width, height: meta.image.height };

function posting(post: PostSummary, language: Language = 'ko') {
	const url = absolute(postPath(post.slug, language));
	return {
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		url,
		headline: post.title,
		description: post.description,
		datePublished: post.publishedAt,
		dateModified: post.updatedAt,
		image: postImage(post).src,
		inLanguage: language === 'en' ? 'en' : 'ko-KR',
		author: language === 'en' ? { ...author, name: profile.nameEn } : author,
		publisher: author
	};
}

/** /blog: a page listing the posts of his blog. */
export function blogJsonLd(posts: PostSummary[], language: Language = 'ko') {
	const url = absolute(blogPath(language));
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				'@id': url,
				url,
				name: language === 'en' ? labels.en.title : blog.title,
				description: language === 'en' ? labels.en.description : blog.description,
				inLanguage: language === 'en' ? 'en' : 'ko-KR',
				isPartOf: node('website'),
				mainEntity: { '@id': blogId(language) }
			},
			{
				'@type': 'Blog',
				'@id': blogId(language),
				url,
				name: language === 'en' ? labels.en.title : blog.name,
				description: language === 'en' ? labels.en.description : blog.description,
				inLanguage: language === 'en' ? 'en' : 'ko-KR',
				author,
				publisher: author,
				blogPost: posts.map((post) => posting(post, language))
			}
		]
	};
}

/** A post's page: the post, by him, on his blog. */
export function postJsonLd(post: PostSummary, language: Language = 'ko') {
	const url = absolute(postPath(post.slug, language));
	return {
		'@context': 'https://schema.org',
		...posting(post, language),
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		isPartOf: {
			'@type': 'Blog',
			'@id': blogId(language),
			name: language === 'en' ? labels.en.title : blog.name,
			url: absolute(blogPath(language))
		},
		...(post.tags.length ? { keywords: post.tags.join(', ') } : {})
	};
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so it never closes early. */
export const scriptJson = (data: unknown): string =>
	'<script type="application/ld+json">' +
	JSON.stringify(data).replaceAll('<', '\\u003c') +
	'</' +
	'script>';

/** 2026-10-14T15:52:18+09:00 → 2026.10.14, as dates are written across the site. */
export const displayDate = (iso: string): string => iso.slice(0, 10).replaceAll('-', '.');
