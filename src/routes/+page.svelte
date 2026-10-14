<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
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

<!-- The statement and the portrait, then the at-a-glance row on the hairline the portrait
     stands on: what he makes, what he researches, where he started. -->
<Hero />

<!-- 작업: AXIT, his lead project, then selected work -->
<Work />

<!-- 경력: what he works on, then one list from 현재 back to 2020 -->
<Career />

<!-- 연구: papers and high-school explorations -->
<Research />

<!-- 기사: the two articles that name him, then company coverage -->
<Press />
