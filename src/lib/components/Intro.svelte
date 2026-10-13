<script lang="ts">
	import Dots from './Dots.svelte';
	import Icon from './Icon.svelte';

	import { focusAreas, intro, namedArticles, papers, portrait, profile } from '$lib/content';

	const journals = papers.filter((paper) => paper.kind === '저널').length;
	const conferences = papers.length - journals;

	// No photo frame at all until the real portrait is set in content.ts.
	const photo = profile.photo;
</script>

<!--
	지금: who he is and what he does now. Without a photo the text takes the left seven
	columns and an at-a-glance column fills the rest. With a photo it leads the row, at
	280px or more from lg up; the at-a-glance column then sits beside the text from xl up
	and below it before that.
-->
<section
	id="now"
	aria-labelledby="now-name"
	class="page grid gap-x-10 gap-y-10 pt-8 sm:pt-12 lg:pt-14 {photo
		? 'sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-x-8 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[19rem_minmax(0,1fr)_19rem]'
		: 'lg:grid-cols-12 lg:gap-x-12'}"
>
	{#if photo}
		<!-- A white studio portrait on a white card: the white reads as the frame. -->
		<img
			src={photo}
			width={portrait.width}
			height={portrait.height}
			alt={portrait.alt}
			fetchpriority="high"
			class="aspect-[4/5] w-40 rounded-card border border-line bg-surface object-cover object-[center_30%] shadow-lift sm:w-full"
		/>
	{/if}

	<div class="min-w-0 {photo ? '' : 'lg:col-span-7'}">
		<h1 id="now-name" class="text-name font-bold">
			{profile.name}
			<span
				lang="en"
				class="mt-1 block text-[1.0625rem] font-semibold tracking-[-0.01em] text-muted sm:ml-2 sm:mt-0 sm:inline sm:text-[0.42em]"
			>
				{profile.nameEn}
			</span>
		</h1>
		<p class="mt-2 text-lede font-semibold sm:mt-3">
			{profile.company.name}
			{profile.role}
		</p>

		<!-- 지금 is lit (a one); 최근 is the ring (a zero), the same marks the nav and 경력 use. -->
		<dl
			class="mt-7 grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 gap-y-5 sm:mt-8 sm:grid-cols-[4.25rem_minmax(0,1fr)] sm:gap-x-4"
		>
			<dt class="flex h-[1.8rem] items-center gap-2 text-meta font-semibold text-accent">
				<span class="flex w-[9px] justify-center" aria-hidden="true">
					<span class="bit bit-on"></span>
				</span>
				지금
			</dt>
			<dd class="max-w-[38rem]">
				<p class="text-opener font-bold">{intro.now}</p>
				<p class="mt-1.5 text-body text-ink-soft">{intro.realworld}</p>
				<p class="mt-1 text-body text-ink-soft">{intro.positioning}</p>
			</dd>

			<dt class="flex h-[1.75rem] items-center gap-2 text-meta font-semibold text-muted">
				<span class="flex w-[9px] justify-center" aria-hidden="true">
					<span class="bit"></span>
				</span>
				최근
			</dt>
			<dd class="max-w-[38rem] text-body text-ink-soft">
				{intro.recent}
				<span class="whitespace-nowrap text-meta">
					{#each namedArticles as article, index (article.href)}
						{#if index > 0}<span aria-hidden="true" class="px-1 text-muted">·</span>{/if}<a
							href={article.href}
							class="inline-flex items-center gap-0.5 font-semibold text-accent hover:text-accent-deep"
						>
							{article.outlet}
							<Icon name="arrow-up-right" class="size-3" />
							<span class="sr-only">기사</span>
						</a>
					{/each}
				</span>
			</dd>
		</dl>

		<ul class="mt-7 flex flex-wrap gap-2 sm:mt-8" aria-label="바로가기">
			{#each intro.links as link (link.href)}
				<li>
					<a
						href={link.href}
						class="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1.5 text-meta font-medium transition-colors hover:border-accent hover:text-accent sm:px-3.5 sm:text-small"
					>
						{#if link.label === 'GitHub'}<Icon name="github" class="size-4" />{/if}
						{link.label}
						<Icon name="arrow-up-right" class="size-3.5 text-muted" />
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<!--
		At a glance. 하는 일 spells out the positioning line and shows on every width;
		학교 and 연구 are repeated in 경력 and 연구, so they join from lg up only. The
		researcher profiles are left to 연구 and the footer.
	-->
	<div
		class="grid content-start gap-y-7 border-t border-line pt-7 {photo
			? 'sm:col-span-2 xl:col-span-1 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-1'
			: 'lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-1'}"
	>
		<div>
			<p id="focus-label" class="text-small font-semibold text-ink">하는 일</p>
			<ul
				aria-labelledby="focus-label"
				class="mt-3 grid gap-y-4 {photo
					? 'md:grid-cols-3 md:gap-x-8 xl:grid-cols-1'
					: 'md:grid-cols-3 md:gap-x-8 lg:grid-cols-1'}"
			>
				{#each focusAreas as area (area.title)}
					<li>
						<p class="text-small font-bold">{area.title}</p>
						<!-- One measure, balanced: each body breaks at its phrase, none trails a stub. -->
						<p class="mt-0.5 max-w-[22rem] text-balance text-meta text-ink-soft">{area.body}</p>
					</li>
				{/each}
			</ul>
		</div>

		<dl
			class="hidden gap-x-8 gap-y-6 lg:grid {photo
				? 'lg:grid-cols-3 xl:grid-cols-1'
				: 'xl:grid-cols-2'}"
		>
			<div>
				<dt class="text-meta font-semibold text-muted">학교</dt>
				<dd class="mt-1.5 text-small font-semibold">{profile.school.name}</dd>
				<dd class="text-small text-ink-soft">
					{profile.school.department}
					<span class="whitespace-nowrap">{profile.school.cohort}</span>
				</dd>
			</div>
			<div>
				<dt class="text-meta font-semibold text-muted">연구</dt>
				<dd class="mt-1.5 text-small font-semibold">논문 {papers.length}편</dd>
				<dd class="text-small text-ink-soft">
					<Dots items={[`국제 저널 ${journals}`, `학술대회 ${conferences}`]} />
				</dd>
			</div>
		</dl>
	</div>
</section>
