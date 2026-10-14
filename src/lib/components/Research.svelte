<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import Explorations from './Explorations.svelte';
	import Glued from './Glued.svelte';
	import Section from './Section.svelte';

	import { paperLinkLabel, papers, scholarLinks, selfNames } from '$lib/content';

	const isSelf = (author: string) => (selfNames as string[]).includes(author);
</script>

<!--
	연구: the researcher profiles under the title, then one ruled row per paper: date |
	title, authors with his name in bold, venue | the link. The summaries stay in
	content.ts; the titles say enough here.
-->
<Section id="research">
	{#snippet aside()}
		<ul
			aria-label="연구자 프로필"
			class="flex flex-wrap gap-x-6 gap-y-1 text-small font-medium lg:flex-col lg:gap-y-1.5"
		>
			{#each scholarLinks as link (link.href)}
				<li><ArrowLink href={link.href} label={link.label} /></li>
			{/each}
		</ul>
	{/snippet}

	<ol class="divide-y divide-line">
		{#each papers as paper (paper.href)}
			<li
				data-reveal="rise"
				class="grid gap-y-2 py-8 first:pt-0 lg:grid-cols-9 lg:gap-x-6 lg:py-10"
			>
				<p class="text-small tabular-nums text-muted lg:col-span-2">{paper.date}</p>

				<div class="min-w-0 lg:col-span-5">
					<h3 class="text-title font-semibold" lang={/[가-힣]/.test(paper.title) ? 'ko' : 'en'}>
						<Glued text={paper.title} />
					</h3>
					{#if paper.titleEn}
						<p lang="en" class="mt-1 text-small text-muted">{paper.titleEn}</p>
					{/if}
					<p class="mt-3 text-small text-soft">
						{#each paper.authors as author, index (author)}{#if index > 0}{', '}{/if}{#if isSelf(author)}<strong
									class="font-bold text-ink">{author}</strong
								>{:else}{author}{/if}{/each}
					</p>
					<p class="mt-1 text-small text-muted">
						{paper.kind} · {paper.venue}<span class="whitespace-nowrap tabular-nums"
							>&nbsp;· {paper.locator}</span
						>
					</p>
				</div>

				<p class="mt-2 text-small font-semibold lg:col-span-2 lg:mt-0 lg:text-right">
					<ArrowLink href={paper.href} label={paperLinkLabel(paper.href)} context={paper.title} />
				</p>
			</li>
		{/each}
	</ol>

	<Explorations />
</Section>
