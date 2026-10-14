<script lang="ts">
	interface Props {
		/** Up-right leaves the page; up and down move within it. */
		name: 'arrow-up-right' | 'arrow-up' | 'arrow-down';
		class?: string;
	}

	let { name, class: className = 'size-4' }: Props = $props();
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="square"
	aria-hidden="true"
	class="shrink-0 {className}"
>
	{#if name === 'arrow-up-right'}
		<path d="M7 17 17 7M8.5 7H17v8.5" />
	{:else if name === 'arrow-up'}
		<path d="M12 20V5M5.5 11.5 12 5l6.5 6.5" />
	{:else}
		<path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" />
	{/if}
</svg>
