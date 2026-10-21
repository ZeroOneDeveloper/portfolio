// /llms.txt: the page as plain Markdown for AI assistants (https://llmstxt.org), who he is
// first, then his links, work, papers, coverage and the posts of his blog. Built from
// content.ts and the posts at deploy time.
import {
	articles,
	axit,
	blog,
	hero,
	namedArticles,
	otherProfiles,
	papers,
	profile,
	profileLinks,
	projects,
	type Article
} from '$lib/content';
import { absolute, displayDate, postPath } from '$lib/seo';
import { summaries } from '$lib/server/blog';

export const prerender = true;

const item = (label: string, href: string | undefined, note: string) =>
	`- ${href ? `[${label}](${href})` : label}: ${note}`;

const article = (entry: Article) =>
	item(entry.headline, entry.href, `${entry.outlet}, ${entry.date}. ${entry.summary}`);

const body = [
	`# ${profile.name} (${profile.nameEn})`,
	'',
	`> ${hero.intro.join(' ')}`,
	'',
	`- 이름: ${profile.name} (${profile.nameEn}), 활동명 ${profile.handle}`,
	`- 소속: ${profile.company.name} ${profile.role}, AXIT 개발 총괄 (${profile.company.url})`,
	`- 학교: ${profile.school.name} ${profile.school.department} ${profile.school.cohort}`,
	`- 고등학교: ${profile.highSchool.name} ${profile.highSchool.cohort}`,
	`- ORCID: ${profile.orcid}`,
	`- 웹사이트: ${profile.url}`,
	'',
	'## 프로필',
	'',
	...profileLinks.map((link) => `- [${link.label}](${link.href})`),
	...otherProfiles.map((href) => `- ${href}`),
	'',
	'## AXIT',
	'',
	`${axit.tagline}. ${axit.summary} ${axit.role}`,
	'',
	...axit.stores.map((store) => `- [${store.label}](${store.href})`),
	'',
	'## 프로젝트',
	'',
	...projects.map((project) =>
		item(
			project.name,
			project.links[0]?.href,
			`${project.year}, ${project.role}. ${project.summary} (${project.stack})`
		)
	),
	'',
	'## 논문',
	'',
	...papers.map((paper) =>
		item(
			paper.title,
			paper.href,
			`${paper.authors.join(', ')}. ${paper.venue}, ${paper.locator}, ${paper.date}.`
		)
	),
	'',
	// As on the page, the articles that name him apart from the company's coverage, so that
	// nothing the company did is read as his.
	`## ${profile.name} 관련 기사`,
	'',
	...namedArticles.map(article),
	'',
	`## ${profile.company.name} · 리얼월드 소식`,
	'',
	...articles.map(article),
	'',
	// What he writes, newest first: every post is his own, on his own site.
	`## ${blog.name}`,
	'',
	`${blog.description} (${absolute(blog.path)}, RSS: ${absolute(`${blog.path}/rss.xml`)})`,
	'',
	...summaries.map((post) =>
		item(
			post.title,
			absolute(postPath(post.slug)),
			`${displayDate(post.publishedAt)}. ${post.description.replaceAll(/\s+/g, ' ')}`
		)
	),
	''
].join('\n');

export function GET(): Response {
	return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
