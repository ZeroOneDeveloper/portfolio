<script lang="ts">
	import whiteLogo from '$lib/logo-white.svg';

	import Tile from '$lib/components/Tile.svelte';
	import PillLink from '$lib/components/PillLink.svelte';
	import TextLink from '$lib/components/TextLink.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';

	import {
		articles,
		explorations,
		featuredCase,
		focusAreas,
		papers,
		profile,
		profileLinks,
		projects
	} from '$lib/content';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: '송찬우',
		alternateName: ['Chanwoo Song', 'ZerOne'],
		url: 'https://www.zero0ne.dev/',
		jobTitle: '개발팀장',
		worksFor: {
			'@type': 'Organization',
			name: '유니크굿컴퍼니',
			alternateName: 'Uniquegood Company',
			url: 'https://uniquegood.biz'
		},
		affiliation: {
			'@type': 'CollegeOrUniversity',
			name: '강원대학교 원주캠퍼스',
			alternateName: [
				'Kangwon National University Wonju Campus',
				'국립강릉원주대학교',
				'Gangneung-Wonju National University'
			]
		},
		knowsAbout: ['AI 에이전트', '풀스택 개발', '의료 데이터 분석'],
		sameAs: [
			'https://github.com/ZeroOneDeveloper',
			'https://orcid.org/0009-0008-2680-6367',
			'https://scholar.google.com/citations?user=9rZcbucAAAAJ',
			'https://www.dbpia.co.kr/author/authorDetail?ancId=5473989'
		]
	};

	const title = '송찬우 (Chanwoo Song) · ZerOne';
	const description = '유니크굿컴퍼니 개발팀장 송찬우(Chanwoo Song)의 프로젝트와 논문';

	const journalCount = papers.filter((paper) => paper.kind === '저널').length;
	const conferenceCount = papers.length - journalCount;

	const scholarLinks = profileLinks.filter((link) =>
		['ORCID', 'Google Scholar', 'DBpia'].includes(link.label)
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={profile.url} />
	<meta property="og:type" content="profile" />
	<meta property="og:locale" content="ko_KR" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={profile.url} />
	<meta name="twitter:card" content="summary" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html '<script type="application/ld+json">' + JSON.stringify(jsonLd) + '</' + 'script>'}
</svelte:head>

<!-- Hero -->
<Tile id="top" surface="light" label="소개">
	<div class="mx-auto flex max-w-text flex-col items-center text-center">
		<div class="mb-8 rounded-full bg-ink p-5 shadow-product sm:p-6">
			<img src={whiteLogo} alt="ZerOne 로고" class="h-20 w-20 sm:h-28 sm:w-28" />
		</div>

		<p class="mb-2 text-tagline text-ink-48">{profile.company.name} {profile.role}</p>
		<h1
			class="text-[28px] font-semibold leading-[1.07] tracking-[-0.28px] xs:text-[34px] sm:text-display-lg xl:text-hero-display"
		>
			{profile.name}
			<span class="block text-ink-48">{profile.nameEn}</span>
		</h1>
		<p class="mt-4 text-[21px] leading-[1.38] text-ink-80 sm:text-lead">{profile.motto}</p>

		<div class="mt-8 flex flex-wrap justify-center gap-4">
			<PillLink href="#projects">프로젝트 보기</PillLink>
			<PillLink href="#research" variant="secondary">논문 보기</PillLink>
		</div>

		<dl
			class="mt-16 grid w-full grid-cols-1 gap-8 border-t border-hairline pt-8 text-left sm:grid-cols-3 sm:gap-6"
		>
			<div>
				<dt class="text-caption-strong text-ink-48">지금</dt>
				<dd class="mt-1 text-body-strong">{profile.company.name} {profile.role}</dd>
			</div>
			<div>
				<dt class="text-caption-strong text-ink-48">학교</dt>
				<dd class="mt-1 text-body-strong">
					{profile.school.name}
					<span class="block font-normal text-ink-80">
						{profile.school.department}
						{profile.school.cohort}
					</span>
				</dd>
			</div>
			<div>
				<dt class="text-caption-strong text-ink-48">연구</dt>
				<dd class="mt-1 text-body-strong">
					논문 {papers.length}편
					<span class="block font-normal text-ink-80">
						국제 저널 {journalCount} · 학술대회 {conferenceCount}
					</span>
				</dd>
			</div>
		</dl>
	</div>
</Tile>

<!-- Now -->
<Tile id="now" surface="dark" label="지금">
	<SectionHeader
		onDark
		eyebrow="지금"
		title="리얼월드를 만드는 개발팀을 이끕니다."
		lead="유니크굿컴퍼니는 피지털 AI 기반의 플레이어블 콘텐츠 플랫폼 ‘리얼월드’를 운영합니다. 그 개발팀에서 AI 에이전트와 함께 일하는 방식을 만들어 갑니다."
	/>

	<div class="mb-16 flex flex-wrap justify-center gap-4">
		<PillLink href={profile.company.url}>유니크굿컴퍼니</PillLink>
		<PillLink href={profile.realworld} variant="secondary-on-dark">리얼월드</PillLink>
	</div>

	<ul class="mx-auto grid max-w-text grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
		{#each focusAreas as area (area.title)}
			<li class="border-t border-white/20 pt-6">
				<h3 class="text-tagline">{area.title}</h3>
				<p class="mt-3 text-body text-body-muted">{area.body}</p>
			</li>
		{/each}
	</ul>
</Tile>

<!-- News -->
<Tile id="news" surface="parchment" label="뉴스">
	<SectionHeader
		eyebrow="뉴스"
		title="기사로 보는 사례."
		lead="에이전트와 함께 일하는 작은 팀, 그리고 리얼월드가 최근 언론에 소개된 장면들입니다."
	/>

	<article
		class="mx-auto mb-5 grid max-w-grid grid-cols-1 gap-8 rounded-lg bg-canvas p-8 md:grid-cols-[minmax(220px,1fr)_2fr] md:gap-12 md:p-12"
	>
		<div
			class="flex flex-col justify-center border-b border-hairline pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-12"
		>
			<p class="text-caption-strong text-ink-48">사례</p>
			<p
				class="mt-2 font-display text-[56px] font-semibold leading-[1.07] tracking-[-0.28px] xl:text-[80px]"
			>
				{featuredCase.stat}
			</p>
			<p class="mt-2 text-body text-ink-80">{featuredCase.statCaption}</p>
		</div>
		<div>
			<h3 class="text-tagline">{featuredCase.title}</h3>
			<p class="mt-4 text-body text-ink-80">{featuredCase.body}</p>
			<blockquote class="mt-6 border-l-2 border-ink pl-4">
				<p class="text-body text-ink">“{featuredCase.quote}”</p>
			</blockquote>
			<div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-caption">
				{#each featuredCase.sources as source (source.href)}
					<TextLink href={source.href}>{source.label}</TextLink>
				{/each}
			</div>
		</div>
	</article>

	<ul class="mx-auto grid max-w-grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
		{#each articles as article (article.href)}
			<li>
				<a
					href={article.href}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex h-full flex-col rounded-lg bg-canvas p-6 transition-transform duration-150 active:scale-[0.98]"
				>
					<p class="text-caption-strong text-ink-48">{article.tag}</p>
					<h3 class="mt-2 font-text text-body-strong">{article.headline}</h3>
					<p class="mt-3 flex-1 text-caption text-ink-80">{article.summary}</p>
					<div class="mt-6 flex items-center justify-between gap-4 text-caption">
						<span class="text-ink-48">{article.outlet} · {article.date}</span>
						<span class="whitespace-nowrap text-primary group-hover:underline">기사 읽기 ›</span>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</Tile>

<!-- Research -->
<Tile id="research" surface="light" label="논문">
	<SectionHeader
		eyebrow="논문"
		title="데이터에서 위험을 읽어냅니다."
		lead="국민건강보험 코호트 연구부터 직접 만든 온라인 저지까지, 발표한 논문입니다."
	/>

	<ol class="mx-auto max-w-text">
		{#each papers as paper (paper.href)}
			<li
				class="grid grid-cols-1 gap-2 border-t border-hairline py-8 last:border-b md:grid-cols-[140px_1fr] md:gap-8"
			>
				<div class="text-caption text-ink-48">
					<span class="text-caption-strong text-ink">{paper.date}</span>
					<span class="ml-2 md:ml-0 md:mt-1 md:block">{paper.kind}</span>
				</div>
				<div>
					<h3 class="font-text text-body-strong">{paper.title}</h3>
					{#if paper.titleEn}
						<p class="mt-1 text-caption text-ink-48">{paper.titleEn}</p>
					{/if}
					<p class="mt-2 text-caption text-ink-80">
						{#each paper.authors as author, index (author)}
							{index > 0 ? ', ' : ''}<span
								class={author === profile.name || author === profile.nameEn
									? 'font-semibold text-ink'
									: ''}>{author}</span
							>
						{/each}
					</p>
					<p class="text-caption text-ink-48">{paper.venue}</p>
					<p class="mt-3 text-body text-ink-80">{paper.summary}</p>
					<TextLink href={paper.href} class="mt-3">논문 보기</TextLink>
				</div>
			</li>
		{/each}
	</ol>

	<div class="mx-auto mt-10 flex max-w-text flex-wrap justify-center gap-x-8 gap-y-2">
		{#each scholarLinks as link (link.href)}
			<TextLink href={link.href}>{link.label}</TextLink>
		{/each}
	</div>
</Tile>

<!-- Explorations -->
<Tile id="explorations" surface="dark-3" label="탐구">
	<SectionHeader
		onDark
		eyebrow="탐구"
		title="고등학생 때부터, 수학으로 문제를 풀었습니다."
		lead="감염병, 화학 공정, 수학 교육, 자원 관리. 질문 하나를 모델과 코드로 끝까지 따라간 기록입니다."
	/>

	<ul
		class="mx-auto grid max-w-grid grid-cols-1 gap-10 xs:grid-cols-2 xs:gap-8 xl:grid-cols-4 xl:gap-6"
	>
		{#each explorations as item (item.title)}
			<li class="flex flex-col">
				<img
					src={item.image}
					alt="{item.title} 탐구 포스터"
					loading="lazy"
					width="960"
					height="960"
					class="aspect-square w-full rounded-lg object-cover"
				/>
				<p class="mt-5 text-caption text-body-muted">{item.year} · {item.purpose}</p>
				<h3 class="mt-1 font-text text-body-strong">{item.title}</h3>
				<p class="mt-2 flex-1 text-caption text-body-muted">{item.summary}</p>
				<p class="mt-3 text-caption text-white/60">{item.stack}</p>
				<div class="mt-3 flex flex-wrap gap-x-5 text-caption">
					{#each item.links as link (link.href)}
						<TextLink href={link.href} onDark>{link.label}</TextLink>
					{/each}
				</div>
			</li>
		{/each}
	</ul>
</Tile>

<!-- Projects -->
<Tile id="projects" surface="light" label="프로젝트">
	<SectionHeader
		eyebrow="프로젝트"
		title="만들고, 운영하며 배웠습니다."
		lead="2020년에 창업한 팀부터 대학 수업을 위한 온라인 저지까지, 직접 만든 서비스들입니다."
	/>

	<ul
		class="mx-auto grid max-w-grid grid-cols-1 gap-5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
	>
		{#each projects as project (project.name)}
			<li class="flex flex-col rounded-lg border border-hairline bg-canvas p-6">
				{#if project.image}
					<img
						src={project.image}
						alt="{project.name} 로고"
						loading="lazy"
						width="640"
						height="640"
						class="aspect-square w-full rounded-sm object-cover"
					/>
				{:else}
					<div
						class="flex aspect-square w-full items-center justify-center rounded-sm bg-void text-white"
						aria-hidden="true"
					>
						<span class="font-display text-display-lg tracking-[-0.28px]">{project.name}</span>
					</div>
				{/if}
				<p class="mt-5 text-caption text-ink-48">{project.meta}</p>
				<h3 class="mt-1 font-text text-body-strong">{project.name}</h3>
				<p class="mt-2 flex-1 text-caption text-ink-80">{project.summary}</p>
				<p class="mt-3 text-caption text-ink-48">{project.stack}</p>
				{#if project.href}
					<TextLink href={project.href} class="mt-3 text-caption">자세히 보기</TextLink>
				{/if}
			</li>
		{/each}
	</ul>
</Tile>
