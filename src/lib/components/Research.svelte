<script lang="ts">
	import Glued from './Glued.svelte';
	import Icon from './Icon.svelte';
	import SectionHead from './SectionHead.svelte';
	import Explorations from './Explorations.svelte';

	import { doiOf, paperLinkLabel, papers, scholarLinks, selfNames } from '$lib/content';

	const isSelf = (author: string) => (selfNames as string[]).includes(author);
</script>

<section id="research" aria-labelledby="research-title" class="page mt-24 sm:mt-32">
	<SectionHead
		id="research-title"
		title="연구"
		lead="국민건강보험 코호트 연구부터 직접 만든 온라인 저지까지, 발표한 논문 4편입니다."
	>
		{#snippet aside()}
			<ul class="flex flex-wrap gap-2" aria-label="연구자 프로필">
				{#each scholarLinks as link (link.href)}
					<li>
						<a
							href={link.href}
							class="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1.5 text-meta font-medium transition-colors hover:border-accent hover:text-accent"
						>
							{link.label}
							<Icon name="arrow-up-right" class="size-3.5 text-muted" />
						</a>
					</li>
				{/each}
			</ul>
		{/snippet}
	</SectionHead>

	<ol class="border-t border-ink">
		{#each papers as paper (paper.href)}
			<li
				class="grid gap-x-8 gap-y-3 border-b border-line py-6 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:py-7 lg:grid-cols-[12rem_minmax(0,1fr)_auto]"
			>
				<p class="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-1.5">
					<span class="mono text-small font-medium">{paper.date}</span>
					<span
						class="rounded-full px-2 py-0.5 text-micro font-medium {paper.kind === '저널'
							? 'bg-accent-tint text-accent-deep'
							: 'bg-sunken text-ink-soft'}"
					>
						{paper.kind}
					</span>
				</p>

				<div class="min-w-0">
					<!-- Every title on the same measure: no balancing, so none ends up narrower. -->
					<h3
						class="max-w-measure text-pretty text-item-title font-semibold"
						lang={/[가-힣]/.test(paper.title) ? 'ko' : 'en'}
					>
						<a href={paper.href} class="hover:text-accent"><Glued text={paper.title} /></a>
					</h3>
					{#if paper.titleEn}
						<p lang="en" class="mt-1 max-w-measure text-meta text-muted">{paper.titleEn}</p>
					{/if}
					<p class="mt-2 text-meta text-ink-soft">
						{#each paper.authors as author, index (author)}
							{#if index > 0},
							{/if}
							{#if isSelf(author)}
								<strong class="font-bold text-ink">{author}</strong>
							{:else}
								{author}
							{/if}
						{/each}
					</p>
					<p class="mt-1 max-w-measure text-meta text-muted">
						<span class="font-medium text-ink-soft">{paper.venue}</span><span
							class="mono whitespace-nowrap">&nbsp;· {paper.locator}</span
						>
					</p>
					{#if doiOf(paper.href)}
						<p class="mono mt-0.5 break-all text-micro text-muted">doi:{doiOf(paper.href)}</p>
					{/if}
					<p class="mt-3 max-w-measure text-small text-ink-soft"><Glued text={paper.summary} /></p>
				</div>

				<p class="sm:col-start-2 lg:col-start-3">
					<a
						href={paper.href}
						class="inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1 text-meta font-semibold text-accent transition-colors hover:border-accent hover:bg-accent-tint"
					>
						{paperLinkLabel(paper.href)}
						<Icon name="arrow-up-right" class="size-3.5" />
						<span class="sr-only">({paper.title})</span>
					</a>
				</p>
			</li>
		{/each}
	</ol>

	<Explorations />
</section>
