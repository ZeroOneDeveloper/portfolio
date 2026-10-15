// What search engines and AI assistants read about him beyond the page itself: the
// structured data (schema.org JSON-LD) that says whose site this is and who he is. Google
// uses it to tell him apart from others of the same name and to tie his profiles together,
// the groundwork of a knowledge panel. Everything comes from content.ts, so it always
// agrees with the page.
import {
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
