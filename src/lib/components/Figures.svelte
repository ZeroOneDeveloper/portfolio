<script lang="ts">
	import Ref from './Ref.svelte';
	import SectionOpener from './SectionOpener.svelte';
	import { explorations, sectionById } from '$lib/content';

	const section = sectionById('explorations');
</script>

<section
	id="explorations"
	aria-labelledby="explorations-title"
	class="page mt-24 sm:mt-28 lg:mt-32"
>
	<SectionOpener {section} headingId="explorations-title" />

	<!-- Plate: the four posters, set as numbered figures -->
	<div class="mt-10 border-y border-ink py-5 sm:py-6 lg:mt-14">
		<ul class="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-10">
			{#each explorations as item, index (item.title)}
				<li>
					<figure>
						<img
							src={item.image}
							alt="{item.title} 탐구 포스터"
							loading="lazy"
							width="960"
							height="960"
							class="aspect-square w-full bg-ink object-cover"
						/>
						<figcaption
							class="mt-2 flex items-baseline gap-2 font-latin text-[0.9375rem] leading-snug"
						>
							<span class="shrink-0 font-semibold italic text-accent">Fig. {index + 1}</span>
							<span class="italic text-ink-soft">{item.title}</span>
						</figcaption>
					</figure>
				</li>
			{/each}
		</ul>
	</div>

	<!-- Captions, in figure order -->
	<ol class="mt-2 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
		{#each explorations as item, index (item.title)}
			<li class="border-b border-rule py-6 sm:border-b-0">
				<article aria-labelledby="fig-{index}">
					<p class="font-mono text-meta-ko text-ink-muted">
						<span class="font-latin text-[0.9375rem] font-semibold italic text-accent"
							>Fig. {index + 1}.</span
						>
						{item.year}
					</p>
					<h3 id="fig-{index}" class="mt-2 font-latin text-[1.625rem] font-medium leading-tight">
						{item.title}
					</h3>
					<p class="mt-1 text-note text-ink-soft">‘{item.purpose}’</p>
					<p class="mt-3 text-note text-ink-soft">{item.summary}</p>
					<p class="mt-3 font-mono text-[0.8125rem] leading-relaxed text-ink-muted">
						{item.stack}
					</p>
					<p class="mt-2 flex flex-wrap gap-x-4 text-cite">
						{#each item.links as link (link.href)}
							<Ref href={link.href}>{link.label}</Ref>
						{/each}
					</p>
				</article>
			</li>
		{/each}
	</ol>
</section>
