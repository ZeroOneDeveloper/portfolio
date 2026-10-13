<script lang="ts">
	import Icon from './Icon.svelte';
	import SectionHead from './SectionHead.svelte';

	import { articles, profile } from '$lib/content';
</script>

<section id="news" aria-labelledby="news-title" class="page mt-24 sm:mt-32">
	<SectionHead
		id="news-title"
		title="기사"
		lead="{profile.company.name}와 리얼월드가 소개된 최근 기사입니다."
	>
		{#snippet aside()}
			<a
				href="#case"
				class="inline-flex items-center gap-1.5 text-meta font-medium text-ink-soft hover:text-accent"
			>
				{profile.name}가 직접 소개된 기사 2건은 대표 사례에
				<Icon name="arrow-right" class="size-3.5 -rotate-90" />
			</a>
		{/snippet}
	</SectionHead>

	<ol class="border-t border-ink">
		{#each articles as article (article.href)}
			<li class="border-b border-line">
				<a
					href={article.href}
					class="group grid gap-x-8 gap-y-1.5 py-5 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:py-6 lg:grid-cols-[12rem_minmax(0,1fr)_auto]"
				>
					<p class="flex items-center gap-2 text-meta sm:flex-col sm:items-start sm:gap-0.5">
						<span class="font-semibold text-ink">{article.outlet}</span>
						<span class="mono text-muted">{article.date}</span>
						<span class="rounded-full bg-sunken px-2 py-0.5 text-micro text-ink-soft sm:hidden">
							{article.tag}
						</span>
					</p>
					<div class="min-w-0">
						<h3 class="text-item-title font-semibold transition-colors group-hover:text-accent">
							{article.headline}
						</h3>
						<p class="mt-1 max-w-[46rem] text-meta text-muted">{article.summary}</p>
					</div>
					<p class="hidden items-start gap-3 pt-1 sm:flex">
						<span class="rounded-full bg-sunken px-2 py-0.5 text-micro text-ink-soft">
							{article.tag}
						</span>
						<Icon
							name="arrow-up-right"
							class="size-4 text-muted transition-colors group-hover:text-accent"
						/>
					</p>
				</a>
			</li>
		{/each}
	</ol>
</section>
