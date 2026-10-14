import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import { FINE_POINTER } from './src/lib/media';

// White minimal: a pure white page, near-black ink and three greys. There is no accent:
// colour comes only from the pictures (AXIT's screen, project images, posters). The
// palette replaces Tailwind's own, so markup can use these names and nothing else.
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px'
		},

		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			paper: '#ffffff',
			ink: '#0b0b0b',
			// Secondary text: summaries and descriptions (8.9:1 on paper).
			soft: '#4a4a4a',
			// Metadata: dates, roles, stacks, captions (5.3:1 on paper).
			muted: '#6b6b6b',
			// Hairlines between sections and rows.
			line: '#e6e6e6',
			// The 0s and 1s behind the opening: at rest a shade lighter than a hairline, and
			// at their darkest, under the pointer. Read by BinaryField through app.css.
			field: {
				DEFAULT: '#ebebeb',
				peak: '#9a9a9a'
			}
		},

		extend: {
			fontFamily: {
				sans: [
					'"Pretendard Variable"',
					'Pretendard',
					'-apple-system',
					'BlinkMacSystemFont',
					'system-ui',
					'"Apple SD Gothic Neo"',
					'"Noto Sans KR"',
					'sans-serif'
				]
			},

			// One steep scale: a huge opening, large titles, small calm metadata. Hangul
			// sets a little looser than Latin, so even the largest sizes keep 1.05 or more.
			fontSize: {
				// His name, opening the page. On a wide but short screen the height caps it too.
				display: [
					'clamp(3rem, min(1.2rem + 7vw, 14vh), 7.5rem)',
					{ lineHeight: '1.08', letterSpacing: '-0.045em' }
				],
				// The motto that signs the page off.
				motto: [
					'clamp(2.25rem, 1rem + 4.6vw, 5.5rem)',
					{ lineHeight: '1.12', letterSpacing: '-0.04em' }
				],
				// Section titles in the label column.
				section: [
					'clamp(2rem, 1.3rem + 2vw, 3rem)',
					{ lineHeight: '1.1', letterSpacing: '-0.04em' }
				],
				// Project names, AXIT's included.
				project: [
					'clamp(1.625rem, 1.3rem + 0.9vw, 2.125rem)',
					{ lineHeight: '1.2', letterSpacing: '-0.035em' }
				],
				// Project names in the index a mouse can browse (the fine variant).
				index: [
					'clamp(2.625rem, 1.2rem + 2.6vw, 3.75rem)',
					{ lineHeight: '1.04', letterSpacing: '-0.05em' }
				],
				// The introduction under his name.
				intro: [
					'clamp(1.125rem, 0.92rem + 0.7vw, 1.4375rem)',
					{ lineHeight: '1.72', letterSpacing: '-0.02em' }
				],
				// Paper titles, headlines and other list items.
				title: [
					'clamp(1.0625rem, 0.98rem + 0.3vw, 1.25rem)',
					{ lineHeight: '1.5', letterSpacing: '-0.015em' }
				],
				lede: [
					'clamp(1.0625rem, 0.96rem + 0.4vw, 1.3125rem)',
					{ lineHeight: '1.65', letterSpacing: '-0.015em' }
				],
				body: ['1.0625rem', { lineHeight: '1.72', letterSpacing: '-0.005em' }],
				small: ['0.9375rem', { lineHeight: '1.6' }],
				meta: ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }]
			},

			maxWidth: {
				page: '90rem',
				// Reading measure for summaries and descriptions.
				measure: '40rem'
			}
		}
	},

	plugins: [
		// fine: a wide screen driven by a mouse or trackpad (src/lib/media.ts), where 작업
		// becomes an index with a floating preview. A variant rather than a screen, which
		// would switch off the min-* and max-* variants. Tailwind writes plugin variants
		// before the screens, so :root raises it above lg and xl, which it refines.
		plugin(({ addVariant }) => addVariant('fine', `@media ${FINE_POINTER} { :root & }`))
	]
} satisfies Config;
