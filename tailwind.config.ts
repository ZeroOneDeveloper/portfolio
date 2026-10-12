import type { Config } from 'tailwindcss';

// Apple-style design tokens. Every color, radius and type size used in markup
// comes from here — components never inline hex values.
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		screens: {
			xs: '420px',
			sm: '641px',
			md: '736px',
			lg: '834px',
			xl: '1069px',
			'2xl': '1441px'
		},

		extend: {
			colors: {
				primary: '#0066cc',
				'primary-focus': '#0071e3',
				'primary-on-dark': '#2997ff',

				canvas: '#ffffff',
				parchment: '#f5f5f7',
				pearl: '#fafafc',
				'tile-1': '#272729',
				'tile-2': '#2a2a2c',
				'tile-3': '#252527',
				void: '#000000',
				chip: 'rgba(210, 210, 215, 0.64)',

				ink: '#1d1d1f',
				'body-muted': '#cccccc',
				'ink-80': '#333333',
				'ink-48': '#7a7a7a',

				'divider-soft': '#f0f0f0',
				hairline: '#e0e0e0'
			},

			fontFamily: {
				display: [
					'"SF Pro Display"',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Apple SD Gothic Neo"',
					'"Pretendard Variable"',
					'Pretendard',
					'Inter',
					'system-ui',
					'sans-serif'
				],
				text: [
					'"SF Pro Text"',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Apple SD Gothic Neo"',
					'"Pretendard Variable"',
					'Pretendard',
					'Inter',
					'system-ui',
					'sans-serif'
				]
			},

			fontSize: {
				'hero-display': [
					'56px',
					{ lineHeight: '1.07', letterSpacing: '-0.28px', fontWeight: '600' }
				],
				'display-lg': ['40px', { lineHeight: '1.1', letterSpacing: '0', fontWeight: '600' }],
				'display-md': [
					'34px',
					{ lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '600' }
				],
				lead: ['28px', { lineHeight: '1.14', letterSpacing: '0.196px', fontWeight: '400' }],
				'lead-airy': ['24px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '300' }],
				tagline: ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '600' }],
				'body-strong': [
					'17px',
					{ lineHeight: '1.24', letterSpacing: '-0.374px', fontWeight: '600' }
				],
				body: ['17px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '400' }],
				'dense-link': ['17px', { lineHeight: '2.41', letterSpacing: '0', fontWeight: '400' }],
				caption: ['14px', { lineHeight: '1.43', letterSpacing: '-0.224px', fontWeight: '400' }],
				'caption-strong': [
					'14px',
					{ lineHeight: '1.29', letterSpacing: '-0.224px', fontWeight: '600' }
				],
				'button-large': ['18px', { lineHeight: '1', letterSpacing: '0', fontWeight: '300' }],
				'button-utility': [
					'14px',
					{ lineHeight: '1.29', letterSpacing: '-0.224px', fontWeight: '400' }
				],
				'fine-print': ['12px', { lineHeight: '1.33', letterSpacing: '-0.12px', fontWeight: '400' }],
				'micro-legal': ['10px', { lineHeight: '1.3', letterSpacing: '-0.08px', fontWeight: '400' }],
				'nav-link': ['12px', { lineHeight: '1', letterSpacing: '-0.12px', fontWeight: '400' }]
			},

			spacing: {
				section: '80px'
			},

			maxWidth: {
				text: '980px',
				grid: '1440px'
			},

			borderRadius: {
				xs: '5px',
				sm: '8px',
				md: '11px',
				lg: '18px',
				pill: '9999px'
			},

			boxShadow: {
				// The only shadow in the system: reserved for imagery resting on a surface.
				product: 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0'
			}
		}
	},

	plugins: []
} satisfies Config;
