<script lang="ts">
	import type { Component } from 'svelte';

	import ArrowLink from './ArrowLink.svelte';
	import Dots from './Dots.svelte';
	import BlockchainFigure from './figures/BlockchainFigure.svelte';
	import GraphFigure from './figures/GraphFigure.svelte';
	import RateLawFigure from './figures/RateLawFigure.svelte';
	import SirFigure from './figures/SirFigure.svelte';

	import { explorations, profile, type ExplorationFigure } from '$lib/content';

	const figures: Record<ExplorationFigure, Component> = {
		sir: SirFigure,
		'rate-laws': RateLawFigure,
		graph: GraphFigure,
		blockchain: BlockchainFigure
	};
</script>

<!--
	High-school explorations: a row of figures, one per exploration, each drawn in the page's
	ink and hairlines, with a one-line caption and its links. One across on phones, where a
	figure needs the whole width to be read, two from 540px and four from xl; the figures
	stop at 22rem, so their words never sit lost in a frame too large for them.
-->
<div class="mt-16 border-t border-line pt-12 sm:pt-14 lg:mt-20 lg:pt-16">
	<h3 class="text-title font-semibold" data-reveal="rise">고등학교 탐구</h3>
	<p class="mt-1.5 text-small text-muted" data-reveal="rise">
		<a href={profile.highSchool.url} class="link-inline">{profile.highSchool.name}</a>에서 질문
		하나를 모델과 코드로 끝까지 따라간 기록입니다.
	</p>

	<ul
		class="mt-8 grid max-w-[22rem] gap-y-10 min-[540px]:max-w-[45.5rem] min-[540px]:grid-cols-2 min-[540px]:gap-x-6 lg:mt-10 xl:max-w-none xl:grid-cols-4"
	>
		{#each explorations as item (item.title)}
			{@const Figure = figures[item.figure]}
			<li data-reveal="rise">
				<figure>
					<Figure />
					<!-- The figure shows what it worked on; the caption adds what it is called, and when. -->
					<figcaption class="mt-4">
						<span class="block text-small font-semibold">{item.title}</span>
						<span class="mt-0.5 block text-meta text-muted">
							<Dots items={item.year.split(' · ')} />
						</span>
					</figcaption>
				</figure>
				<ul class="mt-2 flex flex-wrap gap-x-4 text-meta font-semibold">
					{#each item.links as link (link.href)}
						<li><ArrowLink href={link.href} label={link.label} context={item.title} /></li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>
