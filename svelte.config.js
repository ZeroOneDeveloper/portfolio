import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// The site deploys on Vercel. The adapter is a pinned dependency instead of
		// adapter-auto, so builds never install packages on the fly.
		adapter: adapter()
	}
};

export default config;
