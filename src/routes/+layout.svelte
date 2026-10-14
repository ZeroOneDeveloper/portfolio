<script lang="ts">
	import '../app.css';

	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { children } = $props();

	// Smooth in-page jumps only once the page has loaded and its fonts are in (see app.css):
	// a deep link opened fresh jumps, and the browser keeps it on target as the fonts swap.
	$effect(() => {
		const root = document.documentElement;
		const loaded =
			document.readyState === 'complete'
				? Promise.resolve()
				: new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
		loaded.then(() => document.fonts?.ready).then(() => root.classList.add('smooth-scroll'));
	});
</script>

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
