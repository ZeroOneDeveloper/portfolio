<script lang="ts">
	import Ref from './Ref.svelte';
	import SectionOpener from './SectionOpener.svelte';
	import { hostOf, papers, profile, profileLinks, sectionById, type Paper } from '$lib/content';

	const section = sectionById('research');

	const identifiers = profileLinks.filter((link) =>
		['ORCID', 'Google Scholar', 'DBpia'].includes(link.label)
	);

	const isAuthor = (name: string) => name === profile.name || name === profile.nameEn;

	// Latin venues are italicised; Hangul has no true italic, so Korean venues take 『』.
	const isLatin = (text: string) => !/[ㄱ-힝]/.test(text);

	function linkLabel(paper: Paper): string {
		const url = new URL(paper.href);
		return url.hostname === 'doi.org' ? `doi:${url.pathname.slice(1)}` : hostOf(paper.href);
	}
</script>

<section id="research" aria-labelledby="research-title" class="page mt-24 sm:mt-28 lg:mt-32">
	<SectionOpener {section} headingId="research-title">
		{#snippet note()}
			<p class="text-cite text-ink-muted">
				굵게 표시한 이름이 저자 본인입니다. 각 항목 아래는 짧은 주석입니다.
			</p>
		{/snippet}
	</SectionOpener>

	<div class="mt-10 grid grid-cols-1 gap-x-10 lg:mt-14 lg:grid-cols-12">
		<ol class="border-t border-ink lg:col-span-9 lg:col-start-4">
			{#each papers as paper, index (paper.href)}
				<li
					class="grid grid-cols-[auto_1fr] gap-x-3 border-b border-rule py-7 md:grid-cols-[3.5rem_1fr_9rem] md:gap-x-8"
				>
					<p class="row-start-1 font-mono text-[0.9375rem] tabular-nums text-accent">
						[{index + 1}]
					</p>

					<div class="col-span-2 row-start-2 min-w-0 md:col-span-1 md:col-start-2 md:row-start-1">
						<!-- The reference itself -->
						<p class="text-body">
							<span class="text-ink-soft">
								{#each paper.authors as author, i (author)}{i > 0
										? ', '
										: ''}{#if isAuthor(author)}<strong class="font-bold text-ink">{author}</strong
										>{:else}{author}{/if}{/each}.
							</span>
							<span class="font-medium text-ink">{paper.title}.</span>
							{#if paper.titleEn}
								<span class="font-latin text-[1.0625rem] italic text-ink-soft"
									>[{paper.titleEn}].</span
								>
							{/if}
							<span class="text-ink-soft">
								{#if isLatin(paper.venue)}
									<cite class="font-latin text-[1.125rem] italic text-ink">{paper.venue}</cite>,
								{:else}
									<cite class="not-italic text-ink">『{paper.venue}』</cite>,
								{/if}
								<span class="whitespace-nowrap">{paper.locator}</span>, {paper.date}.
							</span>
							<Ref
								href={paper.href}
								nowrap={false}
								class="font-mono text-[0.8125rem] text-ink-soft [overflow-wrap:anywhere]"
								>{linkLabel(paper)}</Ref
							>
						</p>

						<!-- Annotation -->
						<p class="mt-4 border-l-2 border-rule pl-4 text-note text-ink-soft">
							<span class="mr-1 text-meta-ko font-medium text-ink-muted">주석</span>
							{paper.summary}
						</p>
					</div>

					<!-- Marginalia: kind and date -->
					<p
						class="col-start-2 row-start-1 mb-2 flex items-baseline gap-3 text-meta-ko text-ink-muted md:col-start-3 md:mb-0 md:block md:border-l md:border-rule md:pl-4"
					>
						<span class="font-mono tabular-nums text-ink">{paper.date}</span>
						<span class="md:mt-1 md:block">{paper.kind}</span>
					</p>
				</li>
			{/each}
		</ol>

		<!-- Author identifiers -->
		<div
			class="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-note lg:col-span-9 lg:col-start-4"
		>
			<span class="text-meta-ko font-medium text-ink-muted">저자 식별자</span>
			{#each identifiers as link (link.href)}
				<Ref href={link.href}>{link.label}</Ref>
			{/each}
		</div>
	</div>
</section>
