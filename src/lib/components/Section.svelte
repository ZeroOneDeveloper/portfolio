<script lang="ts">
	import type { Snippet } from 'svelte';

	import { nav, type SectionId } from '$lib/content';

	interface Props {
		/** The section's nav item, which gives its title and its number. */
		id: SectionId;
		/** Under the title in the label column, such as the researcher profiles. */
		aside?: Snippet;
		/** The content column. Its first line shares the title's baseline. */
		children: Snippet;
	}

	let { id, aside, children }: Props = $props();

	const position = $derived(nav.findIndex((item) => item.id === id) + 1);
	// The section's place on the page in binary, 001 to 100: written with nothing but the 0
	// and the 1 of the motto that closes the page.
	const index = $derived(position.toString(2).padStart(3, '0'));
	const label = $derived(nav[position - 1].label);
</script>

<!--
	A hairline across the page, the index hanging from it, then two columns from lg: the
	title on the left, the content on the right. The two share a baseline, whatever the
	content opens with.
-->
<section {id} aria-labelledby="{id}-title" class="page mt-20 sm:mt-28 lg:mt-36">
	<div
		class="relative grid border-t border-line pt-14 sm:pt-16 lg:grid-cols-12 lg:items-baseline lg:gap-x-6 lg:pt-20"
	>
		<p aria-hidden="true" class="absolute left-0 top-4 text-meta tabular-nums text-muted">
			{index}
		</p>

		<div class="lg:col-span-3">
			<h2 id="{id}-title" class="text-section font-bold">{label}</h2>
			{#if aside}
				<div class="mt-5 lg:mt-8">{@render aside()}</div>
			{/if}
		</div>

		<div class="mt-8 min-w-0 sm:mt-10 lg:col-span-9 lg:mt-0">
			{@render children()}
		</div>
	</div>
</section>
