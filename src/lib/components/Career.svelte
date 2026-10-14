<script lang="ts">
	import Dots from './Dots.svelte';
	import Glued from './Glued.svelte';
	import Section from './Section.svelte';

	import { career, focusAreas } from '$lib/content';

	// A year is printed once, on the first entry of its run.
	const showsYear = (index: number) => index === 0 || career[index - 1].year !== career[index].year;
</script>

<!--
	경력: what he works on in one line, then a plain two-column list from 현재 back to 2020,
	year | entry. The year column is as wide as the date column of 연구 and 기사.
-->
<Section id="career">
	<p class="text-lede font-semibold" data-reveal="rise">
		<span class="sr-only">하는 일:</span>
		<Dots items={focusAreas.map((area) => area.title)} />
	</p>

	<ol class="mt-10 sm:mt-12 lg:mt-14">
		{#each career as entry, index (entry.title)}
			<li
				data-reveal="rise"
				class="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 py-2.5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-9"
			>
				<p
					class="pt-px text-small tabular-nums lg:col-span-2 {entry.current
						? 'font-semibold text-ink'
						: 'text-muted'} {showsYear(index) ? '' : 'sr-only'}"
				>
					<span class="whitespace-nowrap">{entry.year}</span>
				</p>
				<p class="col-start-2 lg:col-span-7 lg:col-start-3">
					<span class="block text-body font-semibold sm:inline"><Glued text={entry.title} /></span>
					<span class="block text-small text-muted sm:ml-3 sm:inline">
						<Dots items={entry.detail} />
					</span>
				</p>
			</li>
		{/each}
	</ol>
</Section>
