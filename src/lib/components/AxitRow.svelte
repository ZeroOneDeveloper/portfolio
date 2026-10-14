<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import Dots from './Dots.svelte';

	import { axit } from '$lib/content';

	const { report, shot } = axit;
</script>

<!--
	AXIT, his lead project, opens 작업 on the same two columns as the rows under it, a little
	richer: the tagline under the name, the store description, his part in it, the store
	links, and the company's own figures in one quiet line, never without their source. One
	store screenshot stands where the other rows keep their picture, a little taller than
	theirs and about as tall as the words beside it. With a mouse, where the rows below
	become an index of large names, its name is set as large as theirs.
-->
<article id="axit" aria-labelledby="axit-title" class="grid gap-y-8 lg:grid-cols-9 lg:gap-x-6">
	<div class="lg:col-span-5" data-reveal="rise">
		<h3 id="axit-title" class="text-project font-bold fine:text-index">{axit.name}</h3>
		<p class="mt-2 text-title font-semibold">{axit.tagline}</p>
		<p class="mt-5 max-w-measure text-body text-soft">{axit.summary}</p>
		<!-- Balanced: a phone breaks it after 개발팀장으로, never between AXIT and 개발을. -->
		<p class="mt-4 max-w-measure text-balance text-body font-semibold">{axit.role}</p>

		<div class="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1">
			<ul aria-label="앱 내려받기" class="flex gap-x-6 text-small font-semibold">
				{#each axit.stores as store (store.href)}
					<li><ArrowLink href={store.href} label={store.label} context="{axit.name} 앱" /></li>
				{/each}
			</ul>
			<p class="text-meta text-muted">
				App Store 출시 <span class="tabular-nums">{axit.released}</span>
			</p>
		</div>

		<p class="mt-8 max-w-measure text-meta text-muted">
			<Dots items={report.facts} />
			<span class="whitespace-nowrap">— {report.label},</span>
			<ArrowLink
				href={report.source.href}
				label="{report.source.outlet} {report.source.date}"
				context="기사"
				class="text-ink"
			/>
		</p>
	</div>

	<div class="lg:col-span-4" data-reveal="rise">
		<img
			src={shot.src}
			width={shot.width}
			height={shot.height}
			alt={shot.alt}
			loading="lazy"
			decoding="async"
			class="h-auto w-full max-w-[13rem] rounded-[4px] lg:max-w-[15rem]"
		/>
	</div>
</article>
