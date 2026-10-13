<script lang="ts">
	import Icon from './Icon.svelte';
	import SectionHead from './SectionHead.svelte';

	import { articles, namedArticles, profile, type Article } from '$lib/content';
</script>

{#snippet list(items: Article[])}
	<!--
		The headline is the one link, so a screen reader's link list reads headlines only;
		its ::after stretches over the row, which keeps the whole row clickable.
	-->
	<ol class="mt-3 border-t border-ink">
		{#each items as article (article.href)}
			<li
				class="group relative grid gap-x-8 gap-y-1.5 border-b border-line py-5 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:py-6 lg:grid-cols-[12rem_minmax(0,1fr)_auto]"
			>
				<p class="flex items-center gap-2 text-meta sm:flex-col sm:items-start sm:gap-0.5">
					<span class="whitespace-nowrap font-semibold text-ink">{article.outlet}</span>
					<span class="mono whitespace-nowrap text-muted">{article.date}</span>
					<span class="rounded-full bg-sunken px-2 py-0.5 text-micro text-ink-soft sm:hidden">
						{article.tag}
					</span>
				</p>
				<div class="min-w-0">
					<h4 class="max-w-measure text-pretty text-item-title font-semibold">
						<a
							href={article.href}
							class="transition-colors after:absolute after:inset-0 hover:text-accent group-hover:text-accent"
						>
							{article.headline}
						</a>
					</h4>
					<p class="mt-1 max-w-[46rem] text-meta text-muted">{article.summary}</p>
					{#if article.quote}
						<p class="mt-2 max-w-[46rem] text-meta text-ink-soft">
							“{article.quote.text}”
							<span class="whitespace-nowrap text-muted">— {article.quote.speaker}</span>
						</p>
					{/if}
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
			</li>
		{/each}
	</ol>
{/snippet}

<section id="news" aria-labelledby="news-title" class="page mt-24 sm:mt-32">
	<SectionHead
		id="news-title"
		title="기사"
		lead="{profile.name}가 소개된 기사 {namedArticles.length}건과, {profile.company
			.name}와 리얼월드의 최근 기사입니다."
	/>

	<!-- #case: the two articles behind the intro's 최근 line. -->
	<div id="case">
		<h3 class="text-small font-semibold text-ink">소개된 기사</h3>
		{@render list(namedArticles)}
	</div>

	<div class="mt-12 sm:mt-14">
		<h3 class="text-small font-semibold text-ink">{profile.company.name} · 리얼월드</h3>
		{@render list(articles)}
	</div>
</section>
