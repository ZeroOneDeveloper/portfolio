<script lang="ts">
	import Ref from './Ref.svelte';
	import SectionOpener from './SectionOpener.svelte';
	import {
		explorations,
		featuredCase,
		focusAreas,
		folio,
		papers,
		profile,
		projects,
		sectionById,
		sections
	} from '$lib/content';

	const now = sectionById('now');

	const journalCount = papers.filter((paper) => paper.kind === '저널').length;
	const conferenceCount = papers.length - journalCount;

	// The motto's own 0 and 1 are set apart, the way a monogram would be.
	const mottoParts = profile.motto.split(/([01])/).filter(Boolean);
</script>

<section aria-labelledby="author-name" class="page pt-10 sm:pt-14 lg:pt-16">
	<div class="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-12">
		<!-- Title page: the author, as a paper would print one -->
		<div class="md:col-span-8 lg:col-span-6 lg:col-start-4 lg:row-start-1">
			<p class="font-mono text-meta uppercase text-ink-muted">
				Author <span aria-hidden="true">·</span>
				<span class="font-serif tracking-normal">저자</span>
			</p>

			<h1 id="author-name" class="mt-3 text-display font-semibold tracking-[-0.015em]">
				{profile.name}<sup aria-hidden="true" class="ml-1 text-[0.24em]">1,2</sup>
				<span
					class="mt-1 block font-latin text-[0.46em] font-normal italic leading-tight tracking-normal text-ink-soft"
				>
					{profile.nameEn}
				</span>
			</h1>

			<ol class="mt-6 space-y-1 border-t border-rule pt-4 text-note text-ink-soft">
				<li class="flex gap-2.5">
					<sup class="mt-[0.9em]">1</sup>
					<span>
						<Ref href={profile.company.url} arrow={false}>{profile.company.name}</Ref>
						{profile.role}
					</span>
				</li>
				<li class="flex gap-2.5">
					<sup class="mt-[0.9em]">2</sup>
					<span>
						{profile.school.name}
						{profile.school.department}
						{profile.school.cohort}
					</span>
				</li>
			</ol>

			<figure class="mt-10 pl-6 sm:mt-12 sm:pl-12">
				<blockquote>
					<p class="text-epigraph font-light text-ink">
						{#each mottoParts as part, index (index)}
							{#if part === '0' || part === '1'}
								<span class="font-latin text-[1.12em] font-normal italic text-accent">{part}</span>
							{:else}
								{part}
							{/if}
						{/each}
					</p>
				</blockquote>
				<figcaption class="mt-2 font-latin text-[1.0625rem] italic text-ink-muted">
					— {profile.handle}, 좌우명
				</figcaption>
			</figure>
		</div>

		<!-- Marginalia -->
		<aside
			aria-label="저자에 관한 메모"
			class="md:col-span-4 lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:pt-8"
		>
			<dl
				class="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink pt-4 text-note md:grid-cols-1 lg:border-l lg:border-t-0 lg:border-rule lg:pl-6 lg:pt-0"
			>
				<div>
					<dt class="text-meta-ko font-medium text-ink-muted">필명</dt>
					<dd class="mt-0.5">
						<span class="font-latin text-[1.125rem]">{profile.handle}</span>
						<span class="block font-latin text-[0.9375rem] italic text-ink-muted">zero + one</span>
					</dd>
				</div>
				<div>
					<dt class="text-meta-ko font-medium text-ink-muted">논문</dt>
					<dd class="mt-0.5">
						<a href="#research" class="ink-link">{papers.length}편</a>
						<span class="block text-cite text-ink-muted">
							국제 저널 {journalCount} · 학술대회 {conferenceCount}
						</span>
					</dd>
				</div>
				<div>
					<dt class="text-meta-ko font-medium text-ink-muted">탐구 · 프로젝트</dt>
					<dd class="mt-0.5">
						<a href="#explorations" class="ink-link">탐구 {explorations.length}편</a> ·
						<a href="#projects" class="ink-link">프로젝트 {projects.length}개</a>
					</dd>
				</div>
				<div>
					<dt class="text-meta-ko font-medium text-ink-muted">모교</dt>
					<dd class="mt-0.5">
						<Ref href={profile.highSchool.url} arrow={false}>{profile.highSchool.name}</Ref>
						<span class="block text-cite text-ink-muted">{profile.highSchool.cohort}</span>
					</dd>
				</div>
			</dl>
		</aside>

		<!-- Table of contents -->
		<nav
			id="contents"
			aria-labelledby="contents-title"
			class="md:col-span-12 lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:pt-8"
		>
			<h2
				id="contents-title"
				class="flex items-baseline justify-between border-y border-ink py-2 font-serif text-note font-semibold"
			>
				차례 <span class="font-latin text-[0.9375rem] font-normal italic text-ink-muted"
					>Contents</span
				>
			</h2>
			<ol class="md:columns-2 md:gap-10 lg:columns-1">
				{#each sections as section (section.id)}
					{@const entryTitle = section.id === 'case' ? featuredCase.title : section.title}
					<li class="break-inside-avoid border-b border-rule">
						<a href="#{section.id}" class="group block py-2.5 transition-colors hover:text-accent">
							<span class="flex items-baseline gap-2">
								<span class="w-7 shrink-0 font-latin italic text-accent">§{section.no}</span>
								<span class="font-medium">{section.label}</span>
								<span
									class="font-latin text-[0.9375rem] italic text-ink-muted group-hover:text-accent"
									>{section.en}</span
								>
								<span aria-hidden="true" class="leader"></span>
								<span class="font-mono text-meta tabular-nums text-ink-muted">
									<span class="sr-only">쪽 </span>{folio(section.no)}
								</span>
							</span>
							{#if entryTitle}
								<span
									class="ml-9 mt-0.5 block text-cite group-hover:text-accent {section.id === 'case'
										? 'font-semibold text-ink'
										: 'text-ink-soft'}">{entryTitle}</span
								>
							{/if}
						</a>
					</li>
				{/each}
			</ol>
			<p class="mt-3 text-cite text-ink-muted">
				쪽 번호는 <span class="font-latin italic">0</span>과
				<span class="font-latin italic">1</span>로만 매겼습니다.
			</p>
		</nav>
	</div>

	<!-- §0 Abstract: what he does now -->
	<section id="now" aria-labelledby="now-title" class="mt-16 sm:mt-20 lg:mt-24">
		<SectionOpener section={now} headingId="now-title" />

		<div class="mt-8 grid grid-cols-1 gap-x-10 lg:grid-cols-12">
			<div class="lg:col-span-9 lg:col-start-4">
				<p class="flex flex-wrap gap-x-6 gap-y-1 text-note">
					<Ref href={profile.company.url}>{profile.company.name}</Ref>
					<Ref href={profile.realworld}>리얼월드</Ref>
				</p>

				<h3
					class="mt-10 flex items-baseline gap-3 border-b border-ink pb-2 text-note font-semibold"
				>
					주제어 <span class="font-latin text-[0.9375rem] font-normal italic text-ink-muted"
						>Keywords</span
					>
				</h3>
				<dl>
					{#each focusAreas as area, index (area.title)}
						<div
							class="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-dotted border-ink-muted py-4 sm:grid-cols-[13rem_1fr]"
						>
							<dt class="flex items-baseline gap-3 text-title font-semibold">
								<span class="font-mono text-meta text-accent">K{index + 1}</span>
								{area.title}
							</dt>
							<dd class="text-body text-ink-soft">{area.body}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>
	</section>
</section>
