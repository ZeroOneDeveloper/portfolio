<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { languageForPath, blogPath, labels } from '$lib/blog/locale';
	const language = $derived(languageForPath(page.url.pathname));
	$effect(() => {
		document.documentElement.lang = language;
	});
	import { browser, dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { filterBlogEvent } from '$lib/blog/analytics';

	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import BlogHeader from '$lib/components/BlogHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { blog } from '$lib/content';
	import { revealOnScroll } from '$lib/reveal';

	let { children, data } = $props();

	// Official SvelteKit SDK owns SPA pageviews; beforeSend gates every later route too.
	if (browser && !dev && ['www.zero0ne.dev', 'zero0ne.dev'].includes(location.hostname)) {
		injectAnalytics({
			mode: 'production',
			beforeSend: (event) => filterBlogEvent(event, data.analyticsPaths)
		});
	}

	// Sections, rows and items come into view as the page scrolls (see app.css): on the
	// first page, and again on each page reached from it, whose elements are new.
	let stopReveal: (() => void) | undefined;
	afterNavigate(() => {
		stopReveal?.();
		stopReveal = revealOnScroll();
	});
	$effect(() => () => stopReveal?.());

	// Smooth in-page jumps only once the page has loaded and its fonts are in (see app.css):
	// a deep link opened fresh jumps, and the browser keeps it on target as the fonts swap.
	let smooth = false;
	$effect(() => {
		const root = document.documentElement;
		const loaded =
			document.readyState === 'complete'
				? Promise.resolve()
				: new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
		loaded
			.then(() => document.fonts?.ready)
			.then(() => {
				smooth = true;
				root.classList.add('smooth-scroll');
			});
	});

	// Going to another page jumps too, to its top or to the section it links to, rather than
	// gliding there from where the last page was left.
	beforeNavigate(({ from, to }) => {
		if (to && to.url.pathname !== from?.url.pathname) {
			document.documentElement.classList.remove('smooth-scroll');
		}
	});
	afterNavigate(() => {
		if (smooth)
			requestAnimationFrame(() => document.documentElement.classList.add('smooth-scroll'));
	});
</script>

<svelte:head>
	{#if data.translationPreview}<meta name="robots" content="noindex, nofollow" />{/if}
	<link
		rel="alternate"
		type="application/rss+xml"
		title={language === 'en' ? 'ZerOne Blog (English)' : blog.name}
		href="{blogPath(language)}/rss.xml"
	/>
</svelte:head>

<a
	href="#main"
	class="sr-only z-50 bg-ink text-small font-semibold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:px-4 focus:py-2"
>
	{labels[language].skip}
</a>

{#if /^\/(?:en\/)?blog(?:\/|$)/.test(page.url.pathname)}
	<BlogHeader {language} pathname={page.url.pathname} sibling={page.data.sibling} />
{:else}<SiteHeader />{/if}

<main id="main" tabindex="-1" class="focus:outline-none">
	{@render children()}
</main>

{#if language === 'en'}<footer class="page mt-28 flex justify-between py-12">
		<p>© 2026 Chanwoo Song</p>
		<a href="#main">Back to top</a>
	</footer>{:else}<SiteFooter />{/if}
