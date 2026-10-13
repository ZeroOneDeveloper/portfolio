<script lang="ts">
	import type { Project, Shot } from '$lib/content';

	interface Props {
		project: Project;
		/** Sizing for the frame: aspect ratio, height or flex growth per breakpoint. */
		class?: string;
	}

	let { project, class: className = '' }: Props = $props();

	const media = $derived(project.media);
	const dark = $derived(
		media.kind === 'diagram' || (media.kind === 'logo' && media.tone === 'dark')
	);
	// Dark logo files are drawn on pure black; the Code01 panel is set on the ink.
	const ground = $derived(
		media.kind === 'diagram'
			? 'border-black bg-night'
			: dark
				? 'border-black bg-black'
				: 'border-line bg-sunken'
	);

	// Keep the last two words of a step together, so no label ends on a lone word.
	const unwidowed = (text: string) => text.replace(/ (\S+)$/, ' $1');

	// A print strip's height: the whole area, unless the strips side by side, 1rem apart,
	// would then be wider than it.
	const stripHeight = (frame: Shot) => {
		const count = media.kind === 'print' ? media.frames.length : 1;
		const tall = frame.height / frame.width;
		return `min(100cqh, calc((100cqw - ${count - 1}rem) / ${count} * ${tall}))`;
	};
</script>

{#snippet screenshot(shot: Shot, visibility: string)}
	<img
		src={shot.src}
		width={shot.width}
		height={shot.height}
		alt={shot.alt}
		loading="lazy"
		decoding="async"
		class="mx-auto h-auto w-full rounded-[8px] border border-line bg-surface shadow-shot {visibility}"
		style="max-width: {shot.width}px"
	/>
{/snippet}

<!--
	One frame for every kind of visual: same radius, same hairline, and a chip that says
	what the picture is. Screens and print frames stand on a sunken ground, logos
	keep the ground they were drawn on and the Code01 diagram sits on the ink.
-->
<figure class="relative overflow-hidden rounded-media border {ground} {className}">
	{#if media.kind === 'diagram'}
		<!-- No screenshot of Code01 is public: an ink panel with the wordmark and how grading
		     works, built only from what the project and its KIIT 2025 paper state. -->
		<div
			role="img"
			aria-label={media.alt}
			class="flex h-full flex-col justify-between gap-8 px-5 pb-6 pt-14 text-surface sm:px-8 sm:pb-8 sm:pt-16"
		>
			<div aria-hidden="true">
				<p lang="en" class="text-wordmark font-bold">
					{media.wordmark[0]}<span class="text-accent-glow">{media.wordmark[1]}</span>
				</p>
				<p class="mt-2.5 text-small text-night-muted">{media.subtitle}</p>
			</div>

			<ol class="grid grid-cols-3 gap-3 sm:gap-5" aria-hidden="true">
				{#each media.steps as step, index (step)}
					<li>
						<div class="flex items-center gap-2.5">
							<span class="mono text-micro text-accent-glow sm:text-meta">
								{String(index + 1).padStart(2, '0')}
							</span>
							<span class="h-px flex-1 bg-night-line"></span>
						</div>
						<p class="mt-2 text-meta font-semibold sm:mt-2.5 sm:text-small">
							{unwidowed(step)}
						</p>
					</li>
				{/each}
			</ol>
		</div>
	{:else if media.kind === 'screen'}
		<!-- Never drawn larger than its own size. Phones get the compact crop when there is
		     one, so the text in the capture stays readable; the hidden image is not fetched. -->
		<div class="px-[3%] pb-[3%] pt-12">
			{#if media.compact}
				{@render screenshot(media.compact, 'block md:hidden')}
				{@render screenshot(media.image, 'hidden md:block')}
			{:else}
				{@render screenshot(media.image, 'block')}
			{/if}
		</div>
	{:else if media.kind === 'print'}
		<!-- The frame templates whole and side by side, as large as the frame allows in both
		     directions: the area is a size container, so each strip is as tall as the area
		     unless its share of the width allows less. Browsers without container units keep
		     the full height. Each slot carries the order the photos fill it in. -->
		<div class="absolute inset-x-4 bottom-5 top-12 [container-type:size] sm:bottom-6">
			<div class="flex h-full items-center justify-center gap-4">
				{#each media.frames as frame (frame.src)}
					{@const black = frame.tone === 'dark'}
					<div
						class="relative h-full shrink-0 shadow-shot"
						style:aspect-ratio="{frame.width} / {frame.height}"
						style:height={stripHeight(frame)}
					>
						<img
							src={frame.src}
							width={frame.width}
							height={frame.height}
							alt={frame.alt}
							loading="lazy"
							decoding="async"
							class="h-full w-full border {black ? 'border-black' : 'border-line'}"
						/>
						<ol
							aria-hidden="true"
							class="mono text-micro {black ? 'text-muted' : 'text-night-muted'}"
						>
							{#each media.slots as top, index (top)}
								<li class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style:top="{top}%">
									{String(index + 1).padStart(2, '0')}
								</li>
							{/each}
						</ol>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<img
			src={media.image.src}
			width={media.image.width}
			height={media.image.height}
			alt={media.image.alt}
			loading="lazy"
			decoding="async"
			class="h-full w-full object-contain"
		/>
	{/if}

	<figcaption
		class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-micro font-medium {dark
			? 'bg-night-raised text-night-muted'
			: 'bg-surface text-muted'}"
	>
		{media.label}
	</figcaption>
</figure>
