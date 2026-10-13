<script lang="ts">
	import '../app.css';

	import Masthead from '$lib/components/Masthead.svelte';
	import Colophon from '$lib/components/Colophon.svelte';

	let { children } = $props();
</script>

<a
	href="#main"
	class="sr-only z-50 bg-ink px-4 py-2 text-note text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
>
	본문 바로가기
</a>

<Masthead />

<main id="main" tabindex="-1" class="focus:outline-none">
	{@render children()}
</main>

<Colophon />
