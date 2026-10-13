<script lang="ts">
	import Ref from './Ref.svelte';
	import SectionOpener from './SectionOpener.svelte';
	import { articles, featuredCase, hostOf, sectionById } from '$lib/content';

	const section = sectionById('news');

	// Footnotes run through the whole issue: the lead article's sources come first.
	const firstNote = featuredCase.sources.length + 1;
</script>

<section id="news" aria-labelledby="news-title" class="page mt-24 sm:mt-28 lg:mt-32">
	<SectionOpener {section} headingId="news-title" />

	<div class="mt-10 grid grid-cols-1 gap-x-10 lg:mt-14 lg:grid-cols-12">
		<ol class="grid grid-cols-1 border-t border-ink md:grid-cols-2 lg:col-span-9 lg:col-start-4">
			{#each articles as article, index (article.href)}
				{@const note = firstNote + index}
				<li
					class="flex flex-col border-b border-rule py-7 md:odd:pr-8 md:even:border-l md:even:pl-8 lg:odd:pr-10 lg:even:pl-10"
				>
					<article class="flex h-full flex-col" aria-labelledby="clip-{index}">
						<p class="text-meta-ko font-medium text-accent">{article.tag}</p>
						<h3 id="clip-{index}" class="mt-2 text-title font-semibold">
							<a
								href={article.href}
								target="_blank"
								rel="noopener noreferrer"
								class="transition-colors duration-200 hover:text-accent"
								>{article.headline}<span class="sr-only"> (새 창)</span></a
							><sup>{note}</sup>
						</h3>
						<p class="mt-3 flex-1 text-note text-ink-soft">{article.summary}</p>

						<!-- The footnote, set like a citation -->
						<p class="mt-5 flex gap-2.5 text-cite text-ink-soft">
							<span aria-hidden="true" class="mt-[0.8em] w-6 shrink-0 border-t border-ink"></span>
							<span>
								<sup>{note}</sup>
								『{article.outlet}』,
								<span class="font-mono text-[0.8125rem] tabular-nums">{article.date}</span>.
								<Ref href={article.href} class="font-latin italic">{hostOf(article.href)}</Ref>
							</span>
						</p>
					</article>
				</li>
			{/each}
		</ol>
	</div>
</section>
