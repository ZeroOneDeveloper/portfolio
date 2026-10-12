<script lang="ts">
	import '../app.css';

	import GlobalNav from '$lib/components/GlobalNav.svelte';
	import SubNav from '$lib/components/SubNav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<GlobalNav />
<SubNav />

<main>
	{@render children()}
</main>

<Footer />
