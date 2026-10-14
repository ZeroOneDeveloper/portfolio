<script lang="ts">
	import Icon from './Icon.svelte';
	import Section from './Section.svelte';

	import { articles, companyNote, namedArticles, profile, type Article } from '$lib/content';

	// The headline's last word carries the arrow, so the arrow never wraps onto a line alone.
	function split(headline: string): [string, string] {
		const at = headline.lastIndexOf(' ') + 1;
		return [headline.slice(0, at), headline.slice(at)];
	}
</script>

{#snippet list(items: Article[], detailed: boolean)}
	<!--
		One ruled row per article: outlet and date | headline. The headline is the one link,
		so a screen reader's link list reads headlines only; its ::after stretches over the
		row, which keeps the whole row clickable.
	-->
	<ol class="mt-4 divide-y divide-line border-t border-line">
		{#each items as article (article.href)}
			{@const [head, tail] = split(article.headline)}
			<li class="group relative grid gap-y-1.5 py-5 lg:grid-cols-9 lg:gap-x-6 lg:py-6">
				<p class="text-small lg:col-span-2">
					<span class="font-semibold">{article.outlet}</span><span
						aria-hidden="true"
						class="text-muted lg:hidden">&nbsp;·</span
					>
					<span class="tabular-nums text-muted lg:block">{article.date}</span>
				</p>
				<div class="lg:col-span-7">
					<h4 class="text-title font-medium">
						<a href={article.href} class="link underline-target after:absolute after:inset-0">
							{head}<span class="whitespace-nowrap"
								>{tail}<Icon
									name="arrow-up-right"
									class="ml-[0.3em] inline size-[0.72em] align-[-0.02em]"
								/></span
							>
						</a>
					</h4>
					{#if detailed}
						<p class="mt-1.5 max-w-measure text-small text-muted">{article.summary}</p>
						{#if article.quote}
							<p class="mt-1.5 max-w-measure text-small text-muted">
								“{article.quote.text}”
								<span class="whitespace-nowrap">— {article.quote.speaker}</span>
							</p>
						{/if}
					{/if}
				</div>
			</li>
		{/each}
	</ol>
{/snippet}

<!--
	기사: the two articles that name him first (#case), with what each says; then the
	company's recent coverage, headlines only, under one line saying what the company does.
-->
<Section id="news">
	<div id="case">
		<h3 class="text-small font-semibold">소개된 기사</h3>
		{@render list(namedArticles, true)}
	</div>

	<div class="mt-14 sm:mt-16">
		<h3 class="text-small font-semibold">{profile.company.name} · 리얼월드</h3>
		<p class="mt-1 text-small text-muted">{companyNote}</p>
		{@render list(articles, false)}
	</div>
</Section>
