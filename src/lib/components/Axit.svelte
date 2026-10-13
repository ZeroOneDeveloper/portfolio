<script lang="ts">
	import Dots from './Dots.svelte';
	import Icon from './Icon.svelte';

	import { axit } from '$lib/content';

	interface Props {
		/** Grid placement within the opening. */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const source = axit.report.source;
</script>

{#snippet chip(label: string)}
	<span
		class="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-micro font-medium text-muted"
	>
		{label}
	</span>
{/snippet}

<!--
	AXIT, a level above the work cards: the whole width, lifted off the page, its name set
	larger than any card title. From xl the words take the left half and the iPad shot the
	right; below xl the shot comes right after the name, since at lg the words would run
	well past a shot squeezed into half the width. The phone shots follow as one strip in
	the order work moves (asked, planned, tracked), a swipeable row on phones. The store
	shots bring AXIT's violet; the page keeps its own green.
-->
<section
	id="axit"
	aria-labelledby="axit-title"
	class="rounded-card border border-line bg-surface p-2 shadow-lift {className}"
>
	<div class="grid gap-2 xl:grid-cols-2 xl:grid-rows-[auto_1fr] xl:gap-x-4">
		<div class="px-3 pb-4 pt-5 sm:px-5 sm:pt-7 lg:px-8 lg:pt-8 xl:pb-0 xl:pt-10">
			<h2 id="axit-title" class="text-feature font-bold">{axit.name}</h2>
			<p class="mt-3 text-opener font-bold">{axit.tagline}</p>
		</div>

		<figure
			class="relative flex flex-col items-center overflow-hidden rounded-media border border-line bg-sunken px-4 pb-4 pt-12 sm:px-8 sm:pb-6 xl:col-start-2 xl:row-span-2 xl:row-start-1"
		>
			{@render chip('태블릿 화면')}
			<img
				src={axit.main.src}
				width={axit.main.width}
				height={axit.main.height}
				alt={axit.main.alt}
				fetchpriority="high"
				decoding="async"
				class="h-auto w-full max-w-[28rem] rounded-[10px] border border-black shadow-shot"
			/>
			<!-- Balanced: the agent list is glued whole, so on phones it must not strand a short line above it. -->
			<figcaption class="mt-4 w-full max-w-[28rem] text-balance text-meta text-muted">
				{axit.main.caption}
			</figcaption>
		</figure>

		<div class="flex flex-col px-3 pb-5 pt-4 sm:px-5 lg:px-8 lg:pb-6 xl:pb-8 xl:pt-6">
			<p class="max-w-[34rem] text-body text-ink-soft">{axit.summary}</p>
			<p class="mt-5 max-w-[34rem] border-l-2 border-accent pl-3 text-small font-semibold">
				{axit.role}
			</p>

			<div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
				<ul class="flex flex-wrap gap-2" aria-label="앱 내려받기">
					{#each axit.stores as store (store.href)}
						<li>
							<a
								href={store.href}
								class="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-small font-semibold text-surface transition-colors hover:bg-accent-deep"
							>
								{store.label}<span class="sr-only">에서 {axit.name} 보기</span>
								<Icon name="arrow-up-right" class="size-3.5" />
							</a>
						</li>
					{/each}
				</ul>
				<p class="text-meta text-muted">
					<span class="whitespace-nowrap">
						App Store 출시 <span class="mono">{axit.released}</span>
					</span>
				</p>
			</div>

			<ul class="mb-8 mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2" aria-label="주요 기능">
				{#each axit.features as feature (feature.title)}
					<li class="border-t border-line pt-3">
						<p class="text-small font-bold">{feature.title}</p>
						<!-- Balanced: two or three short lines, none left holding just "수 있습니다." -->
						<p class="mt-1 text-balance text-meta text-ink-soft">{feature.body}</p>
					</li>
				{/each}
			</ul>

			<!-- The company's own figures: one quiet line with its source, pinned to the bottom. -->
			<p class="mt-auto border-t border-line pt-4 text-meta text-ink-soft">
				<Dots items={axit.report.facts} />
				<span class="whitespace-nowrap text-muted">— {axit.report.label},</span>
				<a
					href={source.href}
					class="inline-flex items-center gap-0.5 whitespace-nowrap font-semibold text-accent hover:text-accent-deep"
				>
					{source.outlet}
					<span class="mono font-medium">{source.date}</span>
					<Icon name="arrow-up-right" class="size-3" />
					<span class="sr-only">기사</span>
				</a>
			</p>
		</div>
	</div>

	<!--
		Below sm the strip scrolls sideways and holds no link, so it takes focus itself:
		arrow keys then scroll it in every browser. It clips its own shots to the panel's
		inner curve, so nothing around it clips, and its focus ring draws in full.
	-->
	<div class="relative mt-2 rounded-media border border-line bg-sunken">
		{@render chip('휴대폰 화면')}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<ol
			aria-label="{axit.name}에서 일이 흐르는 순서"
			tabindex="0"
			class="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto rounded-[13px] px-4 pb-5 pt-12 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-6 sm:pb-6 lg:gap-8 lg:px-8"
		>
			{#each axit.flow as shot, index (shot.src)}
				<li class="w-[62%] shrink-0 snap-start sm:w-auto">
					<figure class="mx-auto w-full max-w-[13.5rem]">
						<img
							src={shot.src}
							width={shot.width}
							height={shot.height}
							alt={shot.alt}
							loading="lazy"
							decoding="async"
							class="h-auto w-full rounded-[10px] border border-line shadow-shot"
						/>
						<figcaption class="mt-4">
							<span class="flex items-center gap-2 text-small font-bold">
								<span class="mono text-micro font-medium text-accent">
									{String(index + 1).padStart(2, '0')}
								</span>
								{shot.step}
							</span>
							<span class="mt-1 block text-meta text-ink-soft">{shot.caption}</span>
						</figcaption>
					</figure>
				</li>
			{/each}
		</ol>
	</div>

	<p class="px-3 pb-1 pt-3 text-micro text-muted sm:px-5 lg:px-8">{axit.credit}</p>
</section>
