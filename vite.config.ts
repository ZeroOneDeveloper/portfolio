import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { previewEnabled } from './src/lib/blog/translation-policy';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__BLOG_DRAFT_PREVIEW__: JSON.stringify(
			previewEnabled(process.env.VERCEL_ENV, process.env.BLOG_TRANSLATION_PREVIEW)
		)
	}
});
