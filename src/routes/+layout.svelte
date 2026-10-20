<script lang="ts">
	import '../app.css';

	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { blog } from '$lib/content';
	import { revealOnScroll } from '$lib/reveal';

	let { children } = $props();

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
	<link rel="alternate" type="application/rss+xml" title={blog.name} href="{blog.path}/rss.xml" />
</svelte:head>

<a
	href="#main"
	class="sr-only z-50 bg-ink text-small font-semibold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:px-4 focus:py-2"
>
	본문 바로가기
</a>

<SiteHeader />

<main id="main" tabindex="-1" class="focus:outline-none">
	{@render children()}
</main>

<SiteFooter />
