<script lang="ts">
	import BlogArticle from '$lib/components/BlogArticle.svelte';
	let { data } = $props();
</script>

<BlogArticle {data} />
