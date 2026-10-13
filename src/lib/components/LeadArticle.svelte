<script lang="ts">
	import RunningHead from './RunningHead.svelte';
	import Ref from './Ref.svelte';
	import { featuredCase, hostOf, profile, sectionById } from '$lib/content';

	const section = sectionById('case');

	// "3일" → a numeral set in the Latin serif, a unit set in the Korean one.
	const [, statNumber, statUnit] = featuredCase.stat.match(/^(\d+)(.*)$/) ?? [
		'',
		featuredCase.stat,
		''
	];

	const noteMarks = featuredCase.sources.map((_, index) => index + 1).join(',');
</script>

<article id="case" aria-labelledby="case-title" class="page mt-24 sm:mt-28 lg:mt-32">
	<RunningHead {section} showMark />

	<div class="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:mt-12 lg:grid-cols-12">
		<!-- The figure that carries the story -->
		<div class="flex items-end gap-5 lg:col-span-5 lg:block">
			<p class="whitespace-nowrap text-stat text-ink" aria-hidden="true">
				<span class="font-latin font-light">{statNumber}</span><span
					class="ml-[0.02em] font-serif text-[0.62em] font-medium tracking-normal">{statUnit}</span
				>
			</p>
			<p
				class="max-w-[12rem] border-t border-ink pt-2 font-serif text-note text-ink-soft lg:mt-8 lg:max-w-[18rem]"
			>
				<span class="sr-only">{featuredCase.stat}: </span>{featuredCase.statCaption}
			</p>
		</div>

		<div class="lg:col-span-7">
			<p class="font-mono text-meta uppercase text-accent">
				Case <span aria-hidden="true">·</span>
				<span class="font-serif tracking-normal">사례</span>
			</p>
			<h2 id="case-title" class="mt-3 text-feature font-semibold">
				<span class="sr-only">§{section.no} {section.label}: </span>{featuredCase.title}
			</h2>
			<p class="mt-4 text-cite text-ink-muted">
				{#each featuredCase.sources as source, index (source.href)}{index > 0
						? ' · '
						: ''}『{source.outlet}』{/each}
				보도를 바탕으로 정리<sup>{noteMarks}</sup>
			</p>

			<div
				class="dropcap mt-8 border-t border-rule pt-6 text-lede md:columns-2 md:gap-10 md:[column-rule:1px_solid_theme(colors.rule)]"
			>
				<p>{featuredCase.body}</p>
			</div>
		</div>
	</div>

	<!-- Pull quote -->
	<figure
		class="mt-14 border-y border-ink py-8 sm:py-12 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:py-16"
	>
		<span
			aria-hidden="true"
			class="pointer-events-none block h-[3.5rem] select-none font-latin text-[7rem] leading-none text-accent sm:h-[4.5rem] sm:text-[9rem] lg:col-span-2 lg:row-span-2 lg:-mt-6 lg:h-auto lg:text-right lg:text-[12rem]"
			>“</span
		>
		<blockquote class="lg:col-span-9">
			<p class="text-quote font-normal text-ink">
				{featuredCase.quote}
			</p>
		</blockquote>
		<figcaption
			class="mt-6 flex items-baseline gap-2 font-serif text-note text-ink-soft lg:col-span-9 lg:col-start-3"
		>
			<span aria-hidden="true" class="inline-block w-8 border-t border-ink"></span>
			{profile.name}, {profile.company.name}
			{profile.role}<sup>{noteMarks}</sup>
		</figcaption>
	</figure>

	<!-- Footnotes -->
	<div class="mt-6 lg:grid lg:grid-cols-12 lg:gap-x-10">
		<h3 class="sr-only">출처</h3>
		<ol class="space-y-1.5 text-cite text-ink-soft lg:col-span-9 lg:col-start-3">
			{#each featuredCase.sources as source, index (source.href)}
				<li class="flex gap-2.5">
					<sup class="mt-[0.85em] w-3 shrink-0">{index + 1}</sup>
					<span>
						『{source.outlet}』,
						<span class="font-mono text-[0.8125rem] tabular-nums">{source.date}</span>.
						<Ref href={source.href} class="font-latin italic">{hostOf(source.href)}</Ref>
					</span>
				</li>
			{/each}
		</ol>
	</div>
</article>
