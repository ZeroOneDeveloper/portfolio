<script lang="ts">
	import type { Snippet } from 'svelte';

	import { nav } from '$lib/content';

	interface Props {
		id: (typeof nav)[number]['id'];
		/** The title in the label column; the nav label unless given. */
		title?: string;
		/** The lead section's title is the product's name, set larger than the others. */
		size?: 'section' | 'product';
		/** Under the title in the label column, such as the researcher profiles. */
		aside?: Snippet;
		/** The content column. Its first line shares the title's baseline. */
		children: Snippet;
		/** After the content, across all twelve columns: pictures that need the full width. */
		wide?: Snippet;
		/** Space above the hairline. */
		class?: string;
	}

	let {
		id,
		title,
		size = 'section',
		aside,
		children,
		wide,
		class: className = 'mt-20 sm:mt-28 lg:mt-36'
	}: Props = $props();

	const position = $derived(nav.findIndex((item) => item.id === id) + 1);
	// The section's place on the page in binary, 001 to 101: written with nothing but the 0
	// and the 1 of the motto that closes the page.
	const index = $derived(position.toString(2).padStart(3, '0'));
	const label = $derived(title ?? nav[position - 1].label);
</script>

<!--
	A hairline across the page, the index hanging from it, then two columns from lg: the
	title on the left, the content on the right. The two share a baseline, whatever the
	content opens with.
-->
<section {id} aria-labelledby="{id}-title" class="page {className}">
	<div
		class="relative grid border-t border-line pt-14 sm:pt-16 lg:grid-cols-12 lg:items-baseline lg:gap-x-6 lg:pt-20"
	>
		<p aria-hidden="true" class="absolute left-0 top-4 text-meta tabular-nums text-muted">
			{index}
		</p>

		<div class="lg:col-span-3">
			<h2
				id="{id}-title"
				class={size === 'product' ? 'text-product font-extrabold' : 'text-section font-bold'}
			>
				{label}
			</h2>
			{#if aside}
				<div class="mt-5 lg:mt-8">{@render aside()}</div>
			{/if}
		</div>

		<div class="mt-8 min-w-0 sm:mt-10 lg:col-span-9 lg:mt-0">
			{@render children()}
		</div>

		{#if wide}
			<div class="min-w-0 lg:col-span-12">{@render wide()}</div>
		{/if}
	</div>
</section>
