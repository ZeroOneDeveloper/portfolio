<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Work from '$lib/components/Work.svelte';
	import Career from '$lib/components/Career.svelte';
	import Research from '$lib/components/Research.svelte';
	import Press from '$lib/components/Press.svelte';

	import { meta, profile } from '$lib/content';
	import { absolute, jsonLd } from '$lib/seo';

	// Inside a script element, "<" is escaped so no string can ever close it early.
	const structuredData = JSON.stringify(jsonLd).replaceAll('<', '\\u003c');
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	<meta name="author" content={profile.name} />
	<link rel="canonical" href={profile.url} />
	<meta property="og:type" content="profile" />
	<meta property="og:locale" content="ko_KR" />
	<meta property="og:site_name" content={profile.handle} />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:url" content={profile.url} />
	<meta property="og:image" content={absolute(meta.image.src)} />
	<meta property="og:image:width" content={String(meta.image.width)} />
	<meta property="og:image:height" content={String(meta.image.height)} />
	<meta property="og:image:alt" content={meta.image.alt} />
	<meta property="profile:first_name" content={profile.givenName} />
	<meta property="profile:last_name" content={profile.familyName} />
	<meta property="profile:username" content={profile.handle} />
	<meta name="twitter:card" content="summary_large_image" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html '<script type="application/ld+json">' + structuredData + '</' + 'script>'}
</svelte:head>

<!-- His name, who he is in three sentences, and the portrait, over a field of 0s and 1s
     that parts around him -->
<Hero />

<!-- 작업: AXIT, his lead project, then selected work -->
<Work />

<!-- 경력: what he works on, then one list from 현재 back to 2020 -->
<Career />

<!-- 연구: papers and high-school explorations -->
<Research />

<!-- 기사: the two articles that name him, then company coverage -->
<Press />
