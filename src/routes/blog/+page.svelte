<script lang="ts">
	import BlogList from '$lib/components/BlogList.svelte';
	let { data } = $props();
</script>

<BlogList {data} />
