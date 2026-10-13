<script lang="ts">
	import Dots from './Dots.svelte';
	import Glued from './Glued.svelte';
	import SectionHead from './SectionHead.svelte';

	import { career } from '$lib/content';

	// A year is printed once, on the first entry of its run.
	const showsYear = (index: number) => index === 0 || career[index - 1].year !== career[index].year;
</script>

<!--
	One rail from 현재 back to 2020, one entry per row. Past entries sit on it as small
	rings (0); the present is the single upright bar (1). The year column lines up with
	the date column of 연구 and 기사.
-->
<section id="career" aria-labelledby="career-title" class="page mt-24 sm:mt-32">
	<SectionHead
		id="career-title"
		title="경력"
		lead="맡은 역할과 학교, 발표한 논문을 중심으로 2020년부터 지금까지를 정리했습니다."
	/>

	<ol class="border-t border-ink pt-8 sm:pt-10">
		{#each career as entry, index (entry.title)}
			<li
				class="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-8 lg:grid-cols-[12rem_minmax(0,1fr)]"
			>
				<p
					class="mono pt-[3px] text-meta font-medium sm:pt-0.5 sm:text-small {entry.current
						? 'text-accent'
						: 'text-ink-soft'} {showsYear(index) ? '' : 'sr-only'}"
				>
					<span class="whitespace-nowrap">{entry.year}</span>
				</p>

				<div
					class="relative border-l border-line pl-6 sm:pl-8 {index === career.length - 1
						? 'pb-1'
						: 'pb-7 sm:pb-8'} {showsYear(index) ? '' : 'col-start-2'}"
				>
					<span
						class="bit absolute {entry.current
							? 'bit-on -left-[2px] top-[6px]'
							: '-left-[5px] top-[9px] bg-canvas'}"
						aria-hidden="true"
					></span>
					<p class="text-item-title font-bold text-ink"><Glued text={entry.title} /></p>
					<p class="mt-0.5 max-w-measure text-meta text-muted">
						<Dots items={entry.detail} />
					</p>
				</div>
			</li>
		{/each}
	</ol>
</section>
