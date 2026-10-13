<script lang="ts">
	import type { Snippet } from 'svelte';

	import RunningHead from './RunningHead.svelte';
	import type { IssueSection } from '$lib/content';

	interface Props {
		section: IssueSection;
		headingId: string;
		/** Optional marginal note under the lead, e.g. how to read the section. */
		note?: Snippet;
	}

	let { section, headingId, note }: Props = $props();
</script>

<RunningHead {section} />

<div class="mt-6 grid grid-cols-1 gap-x-10 lg:mt-8 lg:grid-cols-12">
	<p
		aria-hidden="true"
		class="hidden select-none font-latin text-[6.5rem] font-light italic leading-[0.8] text-ink lg:col-span-3 lg:block"
	>
		<span class="text-accent">§</span>{section.no}
	</p>

	<div class="lg:col-span-7">
		<h2 id={headingId} class="text-headline font-semibold">
			<span class="sr-only">§{section.no} {section.label}: </span>{section.title}
		</h2>
		{#if section.lead}
			<p class="mt-4 max-w-measure text-lede text-ink-soft">{section.lead}</p>
		{/if}
		{#if note}
			<div class="mt-4">{@render note()}</div>
		{/if}
	</div>
</div>
