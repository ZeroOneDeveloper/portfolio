<script lang="ts">
	import type { Snippet } from 'svelte';

	import { BOX, INSET, at } from '$lib/figures';

	interface Props {
		/** What the figure shows, read by screen readers in place of the drawing. */
		label: string;
		/** Top left, in a few words: what is drawn. */
		title: string;
		/** The lines and marks, in a square BOX units across that scales with the frame. */
		art: Snippet;
		/** The words, placed with at() in the same square; they keep their size. */
		words: Snippet;
	}

	let { label, title, art, words }: Props = $props();
</script>

<!--
	One frame for every figure: a square, its hairline, the same margin all round, what is
	drawn named at the top left and 도식 at the top right, since every number inside is a
	placeholder. The drawing scales with the frame; its words are set apart from it, on the
	same points, and keep their size (.figure in app.css). As the frame comes into view its
	lines draw in and its words fade in after them (app.css, [data-reveal='draw']); the two
	labels of the frame itself come with it.
-->
<div
	class="figure relative aspect-square w-full rounded-[4px] border border-line"
	data-reveal="draw"
>
	<svg role="img" aria-label={label} class="absolute inset-0 size-full overflow-visible">
		<svg
			viewBox="0 0 {BOX} {BOX}"
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="figure-art overflow-visible"
		>
			{@render art()}
		</svg>
		<text {...at(INSET, INSET)} dy="0.8em" class="text-muted">{title}</text>
		<text {...at(BOX - INSET, INSET)} dy="0.8em" text-anchor="end" class="text-muted">도식</text>
		{@render words()}
	</svg>
</div>
