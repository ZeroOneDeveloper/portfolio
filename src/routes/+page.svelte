<script lang="ts">
	import Intro from '$lib/components/Intro.svelte';
	import Axit from '$lib/components/Axit.svelte';
	import AtAGlance from '$lib/components/AtAGlance.svelte';
	import Work from '$lib/components/Work.svelte';
	import Career from '$lib/components/Career.svelte';
	import Research from '$lib/components/Research.svelte';
	import Press from '$lib/components/Press.svelte';

	import { profile } from '$lib/content';

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

<!--
	The opening, in one grid. In reading order: 지금 (name, role, what he does now and did
	recently), then AXIT, the work he leads, then the at-a-glance column. From lg up the
	at-a-glance column rises beside 지금, so AXIT starts in the first view on every width.
	The source keeps the phone order, where the column follows AXIT: there a screen reader
	and the eye agree. From lg only the column moves, and it is a labelled complementary
	landmark with nothing to focus, so tab order never jumps.
-->
<div class="page grid gap-y-10 pt-8 sm:gap-y-12 sm:pt-12 lg:grid-cols-12 lg:gap-x-12">
	<Intro class="lg:col-span-7" />
	<Axit class="lg:col-span-12" />
	<AtAGlance class="lg:col-span-5 lg:col-start-8 lg:row-start-1" />
</div>

<!-- 작업: selected work -->
<Work />

<!-- 경력: one line from 현재 back to 2020 -->
<Career />

<!-- 연구: papers and high-school explorations -->
<Research />

<!-- 기사: the two articles that name him, then company coverage -->
<Press />
