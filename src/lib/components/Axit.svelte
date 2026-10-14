<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import Dots from './Dots.svelte';
	import Section from './Section.svelte';

	import { axit } from '$lib/content';

	const source = axit.report.source;

	// The iPad shot, then the phone shots in the order work moves: asked, planned, tracked.
	const shots = [axit.main, ...axit.flow];
</script>

<!--
	AXIT leads the page, right under the opening: its name in the label column, larger than
	any other section title, the tagline beside it on the same baseline. The store shots
	then take the full width in one row of equal height, each as wide as its proportions
	ask; on phones the iPad shot comes first at full width and the phone shots follow three
	across. Their violet is the only colour here: the page around them stays black and white.
-->
<Section id="axit" title={axit.name} size="product" class="mt-0">
	<p class="text-headline font-bold">{axit.tagline}</p>

	<p class="mt-8 max-w-measure text-lede text-soft lg:mt-10">{axit.summary}</p>
	<p class="mt-5 max-w-measure text-balance text-lede font-semibold">{axit.role}</p>

	<div class="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 lg:mt-10">
		<ul aria-label="앱 내려받기" class="flex gap-x-6 text-small font-semibold">
			{#each axit.stores as store (store.href)}
				<li><ArrowLink href={store.href} label={store.label} context="{axit.name} 앱" /></li>
			{/each}
		</ul>
		<p class="text-meta text-muted">
			App Store 출시 <span class="tabular-nums">{axit.released}</span>
		</p>
	</div>

	{#snippet wide()}
		<figure class="mt-16 sm:mt-20 lg:mt-28">
			<div class="grid grid-cols-3 gap-3 sm:flex sm:gap-4 lg:gap-6">
				{#each shots as shot, index (shot.src)}
					<!-- The flex share only applies from sm, where the shots share one row. -->
					<div class={index === 0 ? 'col-span-3' : ''} style:flex="{shot.width / shot.height} 1 0%">
						<img
							src={shot.src}
							width={shot.width}
							height={shot.height}
							alt={shot.alt}
							loading="lazy"
							decoding="async"
							class="h-auto w-full rounded-[6px]"
						/>
					</div>
				{/each}
			</div>
			<figcaption class="mt-4 text-meta text-muted">{axit.credit}</figcaption>
		</figure>

		<div class="lg:grid lg:grid-cols-12 lg:gap-x-6">
			<div class="lg:col-span-9 lg:col-start-4">
				<ul
					aria-label="주요 기능"
					class="mt-14 grid gap-x-8 gap-y-7 sm:mt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-x-6"
				>
					{#each axit.features as feature (feature.title)}
						<li>
							<p class="text-small font-semibold">{feature.title}</p>
							<!-- Balanced: two short lines, never one left holding "수 있습니다." -->
							<p class="mt-1.5 text-balance text-small text-soft">{feature.body}</p>
						</li>
					{/each}
				</ul>

				<!-- The company's own figures: one quiet line, never without its source. -->
				<p class="mt-14 text-meta text-muted lg:mt-16">
					<Dots items={axit.report.facts} />
					<span class="whitespace-nowrap">— {axit.report.label},</span>
					<ArrowLink
						href={source.href}
						label="{source.outlet} {source.date}"
						context="기사"
						class="text-ink"
					/>
				</p>
			</div>
		</div>
	{/snippet}
</Section>
