<script lang="ts">
	import Icon from './Icon.svelte';

	import { featuredCase } from '$lib/content';

	const [time, form] = featuredCase.shifts;
</script>

<!-- The lead work item: the press-verified 3일 case, as one wide card. -->
<section id="case" aria-labelledby="case-title" class="page mt-8 sm:mt-10">
	<article class="on-night rounded-card bg-night p-5 text-surface sm:p-8 lg:px-10 lg:py-9">
		<header
			class="flex flex-col gap-3 border-b border-night-line pb-5 sm:flex-row sm:items-center sm:justify-between"
		>
			<p class="text-meta text-night-muted">
				<span class="font-semibold text-accent-glow">대표 사례</span>
				<span aria-hidden="true" class="px-1">·</span>
				{featuredCase.context}
			</p>
			<ul class="flex flex-wrap gap-2" aria-label="보도">
				{#each featuredCase.sources as source (source.href)}
					<li>
						<a
							href={source.href}
							class="inline-flex items-center gap-1.5 rounded-full border border-night-line px-3 py-1 text-meta text-surface transition-colors hover:border-accent-glow hover:text-accent-glow"
						>
							<span class="font-semibold">{source.outlet}</span>
							<span class="mono text-night-muted">{source.date}</span>
							<Icon name="arrow-up-right" class="size-3.5 text-night-muted" />
						</a>
					</li>
				{/each}
			</ul>
		</header>

		<div class="grid gap-8 pt-6 sm:pt-8 lg:grid-cols-[minmax(0,4.5fr)_minmax(0,7.5fr)] lg:gap-14">
			<!-- 8년 → 3일, 앱 → 웹: both changes on one grid so the arrows line up. -->
			<div>
				<p class="sr-only">
					{time.fromNote}
					{time.from}에서 {time.toNote}
					{time.to}로. {form.fromNote}인 {form.from}에서 {form.toNote}인 {form.to}으로.
				</p>
				<div
					aria-hidden="true"
					class="grid grid-cols-[auto_auto_minmax(0,1fr)] items-end gap-x-4 sm:gap-x-6"
				>
					<span class="text-stat font-bold text-night-muted">{time.from}</span>
					<Icon name="arrow-right" class="mb-[0.3em] size-7 text-night-muted sm:size-9" />
					<span class="text-stat font-bold text-accent-glow">{time.to}</span>
					<span class="mt-2 text-meta text-night-muted">{time.fromNote}</span>
					<span></span>
					<span class="mt-2 text-meta text-surface">{time.toNote}</span>

					<span class="col-span-3 my-5 border-t border-night-line sm:my-6"></span>

					<span class="text-stat-sm font-bold text-night-muted">{form.from}</span>
					<Icon name="arrow-right" class="mb-[0.15em] size-6 text-night-muted sm:size-7" />
					<span class="text-stat-sm font-bold text-accent-glow">{form.to}</span>
					<span class="mt-1.5 text-meta text-night-muted">{form.fromNote}</span>
					<span></span>
					<span class="mt-1.5 text-meta text-surface">{form.toNote}</span>
				</div>
			</div>

			<div>
				<h2 id="case-title" class="text-case-title font-bold">{featuredCase.title}</h2>
				<p class="mt-3 max-w-[44rem] text-body text-night-muted">{featuredCase.body}</p>

				<figure class="mt-6 border-l-2 border-accent-glow pl-4 sm:pl-5">
					<blockquote class="text-[1.0625rem] font-medium leading-[1.7] text-surface">
						“{featuredCase.quote}”
					</blockquote>
					<figcaption class="mt-2 text-meta text-night-muted">
						— {featuredCase.speaker},
						<a
							href={featuredCase.quoteSource.href}
							class="underline decoration-night-line underline-offset-[0.25em] hover:text-accent-glow hover:decoration-accent-glow"
						>
							{featuredCase.quoteSource.outlet}
							<span class="mono">{featuredCase.quoteSource.date}</span>
						</a>
					</figcaption>
				</figure>
			</div>
		</div>
	</article>
</section>
