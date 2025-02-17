<script>
	export let title;
	export let dark = false;
</script>

<div class="p-1">
	{#if dark}
		<img src={`/projects/${title}/white.png`} alt={title} class="block dark:hidden">
		<img src={`/projects/${title}/dark.png`} alt={title} class="hidden dark:block">
	{:else}
		<img src={`/projects/${title}.png`} alt={title}>
	{/if}
</div>
