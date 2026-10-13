<script lang="ts">
	interface Props {
		name: 'arrow-up-right' | 'arrow-down' | 'arrow-right' | 'github';
		class?: string;
	}

	let { name, class: className = 'size-4' }: Props = $props();
</script>

{#if name === 'github'}
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="shrink-0 {className}">
		<path
			d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
		/>
	</svg>
{:else}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.8"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class="shrink-0 {className}"
	>
		{#if name === 'arrow-up-right'}
			<path d="M7 17 17 7M8 7h9v9" />
		{:else if name === 'arrow-down'}
			<path d="M12 5v14M6 13l6 6 6-6" />
		{:else}
			<path d="M5 12h14M13 6l6 6-6 6" />
		{/if}
	</svg>
{/if}
