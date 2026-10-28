<script lang="ts">
	import BlogNotice from './BlogNotice.svelte';
	import type { listData } from '$lib/server/blog-pages';
	import { blogPath, labels, type Language } from '$lib/blog/locale';
	import { blog, meta, profile } from '$lib/content';
	import { absolute, blogJsonLd, displayDate, postPath, scriptJson } from '$lib/seo';

	let { data }: { data: ReturnType<typeof listData> } = $props();
	const language: Language = $derived(data.language ?? 'ko');
	const ui = $derived(labels[language]);
	const path = $derived(blogPath(language));

	const url = $derived(absolute(path));
	const structuredData = $derived(scriptJson(blogJsonLd(data.posts, language)));
</script>

<svelte:head>
	<title>{language === 'en' ? ui.title : blog.title}</title>
	<meta name="description" content={language === 'en' ? ui.description : blog.description} />
	<meta name="author" content={language === 'en' ? profile.nameEn : profile.name} />
	<link rel="canonical" href={url} />
	{#if data.noindex}<meta name="robots" content="noindex, nofollow" />{/if}
	{#if data.alternate}
		<link rel="alternate" hreflang="ko" href={absolute(data.alternate.ko)} />
		<link rel="alternate" hreflang="en" href={absolute(data.alternate.en)} />
	{/if}
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={language === 'en' ? 'en_US' : 'ko_KR'} />
	<meta property="og:site_name" content={profile.handle} />
	<meta property="og:title" content={language === 'en' ? ui.title : blog.title} />
	<meta property="og:description" content={language === 'en' ? ui.description : blog.description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={absolute(meta.image.src)} />
	<meta property="og:image:width" content={String(meta.image.width)} />
	<meta property="og:image:height" content={String(meta.image.height)} />
	<meta property="og:image:alt" content={language === 'en' ? 'ZerOne' : meta.image.alt} />
	<meta name="twitter:card" content="summary_large_image" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html structuredData}
</svelte:head>

<!--
	The list of posts, newest first, laid out as a section of the home page: a hairline across
	the page, the title in the label column, the posts in the content column. One ruled row
	per post: the date, the title (the one link, stretched over the row), the first lines,
	and the post's picture on the right.
-->

<section aria-labelledby="blog-title" class="page mt-6 sm:mt-10 lg:mt-14">
	<div
		class="line-in relative grid border-line max-sm:before:hidden sm:border-t sm:pt-16 lg:grid-cols-12 lg:items-baseline lg:gap-x-6 lg:pt-20"
	>
		<div class="lg:col-span-3">
			<h1 id="blog-title" class="text-section font-bold">
				{language === 'en' ? ui.blog : blog.label}
			</h1>
			<p class="mt-3 text-small text-muted lg:mt-5">
				{language === 'ko' ? '글 ' : ''}{data.posts.length}{language === 'ko' ? '편' : ' articles'} ·
				<a href="{path}/rss.xml" data-sveltekit-reload class="link-inline">RSS</a>
			</p>
			<BlogNotice noindex={data.noindex} previewSibling={data.previewSibling} />
		</div>

		{#if language === 'en' && data.posts.length === 0}
			<div class="mt-8 lg:col-span-9 lg:mt-0">
				<p class="text-title font-semibold">No English articles published yet.</p>
				<p class="mt-3 text-small text-muted">You can read the original articles in Korean.</p>
				<a
					href="/blog"
					lang="ko"
					class="mt-4 inline-flex min-h-11 items-center underline underline-offset-4"
					>한국어 글 보기 →</a
				>
			</div>
		{:else}
			<ol class="mt-6 divide-y divide-line sm:mt-8 lg:col-span-9 lg:mt-0">
				{#each data.posts as post (post.slug)}
					<li
						class="group relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 py-6 first:pt-0 sm:gap-x-8 sm:py-8 lg:first:pt-1"
					>
						<div class="min-w-0">
							<p class="text-meta tabular-nums text-muted">
								<time datetime={post.publishedAt}>{displayDate(post.publishedAt)}</time>
							</p>
							<h2 class="mt-1.5 text-headline font-bold">
								<a
									href={postPath(post.slug, language)}
									class="link underline-target after:absolute after:inset-0"
								>
									{post.title}
								</a>
							</h2>
							<p
								class="mt-2 line-clamp-2 max-w-measure text-small text-soft sm:mt-2.5 sm:line-clamp-3"
							>
								{post.description}
							</p>
						</div>
						{#if post.cover}
							<img
								src={post.cover.thumb.src}
								width={post.cover.thumb.width}
								height={post.cover.thumb.height}
								alt=""
								loading="lazy"
								decoding="async"
								class="mt-1 aspect-[16/10] w-28 border border-line object-cover sm:w-44 lg:w-52"
							/>
						{/if}
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</section>
