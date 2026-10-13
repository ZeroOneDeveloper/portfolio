<script lang="ts">
	import JudgeDiagram from './JudgeDiagram.svelte';

	import type { Project } from '$lib/content';

	interface Props {
		project: Project;
		/** Sizing for the frame: aspect ratio or height per breakpoint. */
		class?: string;
	}

	let { project, class: className = 'aspect-[16/10]' }: Props = $props();

	const media = $derived(project.media);
</script>

<!--
	One frame for every kind of visual: same radius, same hairline, the label says what it is.
	Screenshots float on a sunken ground, outputs stand on it, logos keep their own ground.
-->
<figure
	class="relative overflow-hidden rounded-media border {media.tone === 'dark'
		? 'border-black bg-black'
		: 'border-line bg-sunken'} {className}"
>
	{#if media.label === '도식'}
		<div role="img" aria-label={media.alt} class="h-full">
			<JudgeDiagram />
		</div>
	{:else if media.label === '사이트 화면'}
		<img
			src={media.src}
			width={media.width}
			height={media.height}
			alt={media.alt}
			loading="lazy"
			decoding="async"
			class="absolute left-[5%] top-11 w-[90%] max-w-none rounded-[10px] border border-line bg-surface shadow-shot"
		/>
	{:else if media.label === '출력 예시'}
		<img
			src={media.src}
			width={media.width}
			height={media.height}
			alt={media.alt}
			loading="lazy"
			decoding="async"
			class="absolute left-1/2 top-[6%] h-[88%] w-auto max-w-none -translate-x-1/2 border border-line bg-surface shadow-shot"
		/>
	{:else}
		<img
			src={media.src}
			width={media.width}
			height={media.height}
			alt={media.alt}
			loading="lazy"
			decoding="async"
			class="h-full w-full object-contain"
		/>
	{/if}

	{#if media.label !== '도식'}
		<figcaption
			class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-micro font-medium {media.tone ===
			'dark'
				? 'bg-night-raised text-night-muted'
				: 'bg-surface/90 text-muted'}"
		>
			{media.label}
		</figcaption>
	{/if}
</figure>
