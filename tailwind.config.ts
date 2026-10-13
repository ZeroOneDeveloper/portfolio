import type { Config } from 'tailwindcss';

// Work-showcase tokens: a warm-neutral ground, white work cards, near-black ink
// and one pine-green accent. Components use these names only — no hex values in markup.
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px'
		},

		extend: {
			colors: {
				// Page ground and the surfaces that sit on it.
				canvas: '#f3f2ee',
				surface: '#ffffff',
				sunken: '#e9e7e1',
				line: '#dcdad2',
				'line-strong': '#bfbcb2',

				ink: '#171715',
				'ink-soft': '#45443f',
				muted: '#64625b',

				// The one accent: pine green.
				accent: '#17694b',
				'accent-deep': '#0e4f37',
				'accent-tint': '#e2eee7',

				// The lead case card.
				night: '#191a18',
				'night-raised': '#242522',
				'night-line': '#3a3b36',
				'night-muted': '#aeaca4',
				'accent-glow': '#8ed6b2'
			},

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
				],
				// Years, dates and stacks only.
				mono: ['"JetBrains Mono"', '"Pretendard Variable"', 'ui-monospace', 'monospace']
			},

			fontSize: {
				name: [
					'clamp(2.25rem, 1.55rem + 2.6vw, 3.5rem)',
					{ lineHeight: '1.1', letterSpacing: '-0.03em' }
				],
				stat: ['clamp(3rem, 2rem + 3.6vw, 4.75rem)', { lineHeight: '1', letterSpacing: '-0.04em' }],
				'stat-sm': [
					'clamp(1.75rem, 1.3rem + 1.4vw, 2.5rem)',
					{ lineHeight: '1.1', letterSpacing: '-0.03em' }
				],
				section: [
					'clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem)',
					{ lineHeight: '1.3', letterSpacing: '-0.025em' }
				],
				'case-title': [
					'clamp(1.375rem, 1.15rem + 0.8vw, 1.75rem)',
					{ lineHeight: '1.4', letterSpacing: '-0.02em' }
				],
				'card-title': ['1.375rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
				'item-title': ['1.0625rem', { lineHeight: '1.55', letterSpacing: '-0.01em' }],
				lede: ['clamp(1.0625rem, 0.98rem + 0.35vw, 1.25rem)', { lineHeight: '1.65' }],
				body: ['1rem', { lineHeight: '1.75' }],
				small: ['0.9375rem', { lineHeight: '1.7' }],
				meta: ['0.8125rem', { lineHeight: '1.55' }],
				micro: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }]
			},

			maxWidth: {
				page: '1200px'
			},

			borderRadius: {
				card: '20px',
				media: '14px'
			},

			boxShadow: {
				lift: '0 1px 2px rgb(23 23 21 / 0.04), 0 8px 24px -12px rgb(23 23 21 / 0.16)',
				shot: '0 1px 2px rgb(23 23 21 / 0.06), 0 12px 32px -16px rgb(23 23 21 / 0.28)'
			}
		}
	},

	plugins: []
} satisfies Config;
