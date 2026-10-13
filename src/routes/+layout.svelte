<script lang="ts">
	import '../app.css';

	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { children } = $props();
</script>

<a
	href="#main"
	class="sr-only z-50 rounded-full bg-ink text-small text-surface focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:px-4 focus:py-2"
>
	본문 바로가기
</a>

<SiteHeader />

<main id="main" tabindex="-1" class="focus:outline-none">
	{@render children()}
</main>

<SiteFooter />
