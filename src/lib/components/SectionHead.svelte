<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		title: string;
		lead?: string;
		/** Heading level: sections use h2, sub-sections h3. */
		level?: 2 | 3;
		aside?: Snippet;
	}

	let { id, title, lead, level = 2, aside }: Props = $props();
</script>

<div
	class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10 {level === 2
		? 'mb-8 sm:mb-10'
		: 'mb-6 sm:mb-8'}"
>
	<div class="max-w-[40rem]">
		<svelte:element
			this={level === 2 ? 'h2' : 'h3'}
			{id}
			class="font-bold {level === 2 ? 'text-section' : 'text-card-title'}"
		>
			{title}
		</svelte:element>
		{#if lead}
			<p class="mt-2 text-small text-muted sm:text-body">{lead}</p>
		{/if}
	</div>
	{#if aside}
		<div class="shrink-0">{@render aside()}</div>
	{/if}
</div>
