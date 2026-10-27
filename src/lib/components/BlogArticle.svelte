<script lang="ts">
	import type { articleData } from '$lib/server/blog-pages';
	import Icon from '$lib/components/Icon.svelte';

	import { blogPath, labels, type Language } from '$lib/blog/locale';
	import { blog, meta, profile } from '$lib/content';
	import { REDUCED_MOTION } from '$lib/media';
	import { absolute, displayDate, postImage, postJsonLd, postPath, scriptJson } from '$lib/seo';

	let { data }: { data: ReturnType<typeof articleData> } = $props();
	const language: Language = $derived(data.language ?? 'ko');
	const ui = $derived(labels[language]);
	const path = $derived(blogPath(language));

	const post = $derived(data.post);
	const url = $derived(absolute(postPath(post.slug, language)));
	const image = $derived(postImage(post));
	const structuredData = $derived(scriptJson(postJsonLd(post, language)));

	let body = $state<HTMLElement>();

	// The clips that were GIFs on Medium loop on their own; when motion is unwelcome they
	// stay still, with controls to play them.
	$effect(() => {
		// Read data.html so this runs again when the page moves on to another post.
		if (!body || !data.html || !matchMedia(REDUCED_MOTION).matches) return;
		for (const video of body.querySelectorAll('video')) {
			video.pause();
			video.controls = true;
		}
	});

	// A YouTube video is its thumbnail, linking to YouTube, until it is clicked: then the
	// player takes its place and starts. A click that opens a new tab is left alone.
	function play(event: MouseEvent) {
		const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-youtube]');
		const id = link?.dataset.youtube;
		if (!link || !id || !/^[\w-]{11}$/.test(id)) return;
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}
		event.preventDefault();

		const player = document.createElement('iframe');
		player.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
		player.title =
			link.getAttribute('aria-label')?.replace(/, (YouTube 동영상 재생|Play YouTube video)$/, '') ??
			'';
		player.allow =
			'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
		player.allowFullscreen = true;
		player.referrerPolicy = 'strict-origin-when-cross-origin';
		const frame = document.createElement('div');
		frame.className = 'embed-frame';
		frame.append(player);
		link.replaceWith(frame);
		player.focus();
	}

	// On the text, which holds the links (Enter on a focused link clicks it too).
	$effect(() => {
		const text = body;
		text?.addEventListener('click', play);
		return () => text?.removeEventListener('click', play);
	});
</script>

<svelte:head>
	<title>{post.title} · {language === 'en' ? profile.nameEn : profile.name}</title>
	<meta name="description" content={post.description} />
	<meta name="author" content={language === 'en' ? profile.nameEn : profile.name} />
	<link rel="canonical" href={url} />
	{#if data.noindex}<meta name="robots" content="noindex, nofollow" />{/if}
	{#if data.alternate}
		<link rel="alternate" hreflang="ko" href={absolute(data.alternate.ko)} />
		<link rel="alternate" hreflang="en" href={absolute(data.alternate.en)} />
	{/if}
	<meta property="og:type" content="article" />
	<meta property="og:locale" content={language === 'en' ? 'en_US' : 'ko_KR'} />
	<meta property="og:site_name" content={profile.handle} />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image.src} />
	<meta property="og:image:width" content={String(image.width)} />
	<meta property="og:image:height" content={String(image.height)} />
	{#if !post.cover}
		<meta property="og:image:alt" content={language === 'en' ? 'ZerOne' : meta.image.alt} />
	{/if}
	<meta property="article:published_time" content={post.publishedAt} />
	<meta property="article:modified_time" content={post.updatedAt} />
	<meta property="article:author" content={profile.url} />
	{#each post.tags as tag (tag)}
		<meta property="article:tag" content={tag} />
	{/each}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.description} />
	<meta name="twitter:image" content={image.src} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html structuredData}
</svelte:head>

<!--
	A post, laid out as a section of the home page: a hairline across the page, the way back
	to the list in the label column, then the title, the date and his name, and the text in
	a reading column of its own. At the end, the posts before and after it.
-->
<div class="page mt-6 flex gap-4 text-small">
	{#if data.sibling}<a
			class="link-inline"
			href={data.sibling}
			lang={language === 'en' ? 'ko' : 'en'}
			>{language === 'en' ? '한국어' : 'English'}{data.previewSibling ? ' (review draft)' : ''}</a
		>{/if}
	{#if data.noindex}<p role="note">Review draft · Not approved for publication</p>{/if}
</div>
<article aria-labelledby="post-title" class="page mt-6 sm:mt-10 lg:mt-14">
	<div
		class="line-in relative grid border-t border-line pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-x-6 lg:pt-20"
	>
		<p class="text-small font-medium lg:col-span-3 lg:pt-[0.6em]">
			<a href={path} class="group inline-flex items-center gap-1.5 text-muted hover:text-ink">
				<Icon name="arrow-left" class="size-[0.95em]" />
				<span class="underline-target">{language === 'en' ? ui.blog : blog.label}</span>
			</a>
		</p>

		<header class="mt-8 sm:mt-10 lg:col-span-9 lg:mt-0">
			<h1 id="post-title" class="max-w-[22em] text-post font-extrabold">{post.title}</h1>
			<p class="mt-5 text-small text-muted sm:mt-6">
				<a href="/" rel="author" class="link font-semibold text-ink"
					>{language === 'en' ? profile.nameEn : profile.name}</a
				>
				<span aria-hidden="true">·</span>
				<time datetime={post.publishedAt} class="tabular-nums">{displayDate(post.publishedAt)}</time
				>
				<span aria-hidden="true">·</span>
				<span>{post.readingMinutes}{language === 'ko' ? '분 분량' : ' min read'}</span>
			</p>
		</header>

		<div
			bind:this={body}
			class="article mt-10 max-w-article sm:mt-14 lg:col-span-8 lg:col-start-4 xl:col-span-7 xl:col-start-4"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.html}
		</div>
	</div>

	{#if data.newer || data.older}
		<nav
			aria-label={ui.others}
			class="mt-20 grid border-t border-line pt-8 sm:mt-28 sm:pt-10 lg:grid-cols-12 lg:gap-x-6"
		>
			<ul class="grid gap-y-8 sm:grid-cols-2 sm:gap-x-8 lg:col-span-9 lg:col-start-4">
				{#if data.older}
					<li class="group relative">
						<p class="flex items-center gap-1.5 text-meta text-muted">
							<Icon name="arrow-left" class="size-3.5" />{ui.older}
						</p>
						<a
							href={postPath(data.older.slug, language)}
							class="link underline-target mt-2 block text-title font-semibold after:absolute after:inset-0"
						>
							{data.older.title}
						</a>
					</li>
				{/if}
				{#if data.newer}
					<li class="group relative sm:col-start-2 sm:text-right">
						<p class="flex items-center gap-1.5 text-meta text-muted sm:justify-end">
							{ui.newer}<Icon name="arrow-right" class="size-3.5" />
						</p>
						<a
							href={postPath(data.newer.slug, language)}
							class="link underline-target mt-2 block text-title font-semibold after:absolute after:inset-0"
						>
							{data.newer.title}
						</a>
					</li>
				{/if}
			</ul>
		</nav>
	{/if}
</article>
