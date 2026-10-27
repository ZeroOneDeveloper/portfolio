import type { Handle } from '@sveltejs/kit';
import { languageForPath } from '$lib/blog/locale';
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('%blog.lang%', languageForPath(event.url.pathname))
	});
