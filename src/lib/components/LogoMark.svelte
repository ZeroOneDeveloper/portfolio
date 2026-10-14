<script lang="ts">
	import blackLogo from '$lib/logo-black.svg';

	interface Props {
		/** Sizing classes; the mark keeps its own aspect ratio from the height. */
		class?: string;
		alt?: string;
		/** Lazy below the fold, as in the footer. */
		loading?: 'eager' | 'lazy';
	}

	let { class: className = 'h-16', alt = '', loading = 'eager' }: Props = $props();
</script>

<!--
	The monogram drawing sits inside a 1000×1000 canvas with wide margins.
	Crop to the ink so it can sit on a baseline next to type.
-->
<span class="relative inline-block aspect-[0.79] shrink-0 overflow-hidden {className}">
	<img
		src={blackLogo}
		{alt}
		{loading}
		width="1000"
		height="1000"
		class="absolute left-[-42.8%] top-[-29.85%] h-auto w-[207.5%] max-w-none"
	/>
</span>
