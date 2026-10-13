import type { Config } from 'tailwindcss';

// "연구 노트" design tokens: warm paper, near-black ink and a single oxblood accent.
// Components use these names only — no hex values in markup.
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		screens: {
			xs: '420px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px'
		},

		extend: {
			colors: {
				paper: '#f3efe6',
				'paper-deep': '#e9e3d6',
				ink: '#1c1915',
				'ink-soft': '#46413a',
				'ink-muted': '#675f54',
				rule: '#c9c0af',
				accent: '#8a2a1e',
				'accent-deep': '#6c1f15'
			},

			fontFamily: {
				// Hangul (and body Latin) — a Korean serif.
				serif: ['Hahmlet', '"Noto Serif KR"', 'serif'],
				// Latin display, italics, venues and figure labels.
				latin: ['Newsreader', 'Hahmlet', 'serif'],
				// Metadata: issue lines, dates, folios, stacks.
				mono: ['"IBM Plex Mono"', 'Hahmlet', 'ui-monospace', 'monospace']
			},

			fontSize: {
				nameplate: [
					'clamp(4.25rem, 2.4rem + 7.6vw, 9.75rem)',
					{ lineHeight: '0.86', letterSpacing: '-0.03em' }
				],
				stat: [
					'clamp(8.5rem, 4.6rem + 15vw, 17.5rem)',
					{ lineHeight: '0.78', letterSpacing: '-0.045em' }
				],
				display: ['clamp(3.25rem, 2.2rem + 3.6vw, 5.5rem)', { lineHeight: '1.2' }],
				headline: [
					'clamp(1.75rem, 1.25rem + 1.6vw, 2.625rem)',
					{ lineHeight: '1.32', letterSpacing: '-0.01em' }
				],
				feature: [
					'clamp(2rem, 1.3rem + 2.2vw, 3.25rem)',
					{ lineHeight: '1.28', letterSpacing: '-0.015em' }
				],
				quote: ['clamp(1.5rem, 1.08rem + 1.55vw, 2.375rem)', { lineHeight: '1.55' }],
				epigraph: ['clamp(1.375rem, 1.15rem + 0.8vw, 1.75rem)', { lineHeight: '1.55' }],
				title: ['1.3125rem', { lineHeight: '1.5' }],
				lede: ['1.1875rem', { lineHeight: '1.8' }],
				body: ['1.0625rem', { lineHeight: '1.8' }],
				note: ['1rem', { lineHeight: '1.72' }],
				cite: ['0.9375rem', { lineHeight: '1.65' }],
				meta: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
				'meta-ko': ['0.8125rem', { lineHeight: '1.55' }]
			},

			maxWidth: {
				page: '1320px',
				measure: '40rem'
			},

			borderWidth: {
				3: '3px'
			}
		}
	},

	plugins: []
} satisfies Config;
