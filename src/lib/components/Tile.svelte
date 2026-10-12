<script lang="ts">
	import type { Snippet } from 'svelte';

	type Surface = 'light' | 'parchment' | 'dark' | 'dark-2' | 'dark-3';

	interface Props {
		id?: string;
		surface?: Surface;
		label?: string;
		children: Snippet;
	}

	let { id, surface = 'light', label, children }: Props = $props();

	const surfaces: Record<Surface, string> = {
		light: 'bg-canvas text-ink',
		parchment: 'bg-parchment text-ink',
		dark: 'bg-tile-1 text-white',
		'dark-2': 'bg-tile-2 text-white',
		'dark-3': 'bg-tile-3 text-white'
	};
</script>

<!-- Full-bleed, edge-to-edge band. The surface change itself is the section divider. -->
<section
	{id}
	aria-label={label}
	class="w-full px-4 py-12 sm:px-6 sm:py-section {surfaces[surface]}"
>
	{@render children()}
</section>
