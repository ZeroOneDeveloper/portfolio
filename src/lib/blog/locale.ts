export type Language = 'ko' | 'en';
export const languageForPath = (path: string): Language =>
	/^\/en(?:\/|$)/.test(path) ? 'en' : 'ko';
export const blogPath = (language: Language = 'ko') => (language === 'en' ? '/en/blog' : '/blog');
export const labels = {
	ko: {
		blog: '블로그',
		title: 'ZerOne 블로그',
		description: 'ZerOne의 글',
		count: '편',
		reading: '분 분량',
		others: '다른 글',
		older: '이전 글',
		newer: '다음 글',
		skip: '본문 바로가기'
	},
	en: {
		blog: 'Blog',
		title: 'ZerOne Blog',
		description: 'Articles by ZerOne',
		count: 'articles',
		reading: 'min read',
		others: 'More articles',
		older: 'Previous article',
		newer: 'Next article',
		skip: 'Skip to content'
	}
} as const;
