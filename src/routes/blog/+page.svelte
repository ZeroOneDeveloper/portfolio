<script lang="ts">
	import { blog, meta, profile } from '$lib/content';
	import { absolute, blogJsonLd, displayDate, postPath, scriptJson } from '$lib/seo';

	let { data } = $props();

	const url = absolute(blog.path);
	const structuredData = $derived(scriptJson(blogJsonLd(data.posts)));
</script>

<svelte:head>
	<title>{blog.title}</title>
	<meta name="description" content={blog.description} />
	<meta name="author" content={profile.name} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="ko_KR" />
	<meta property="og:site_name" content={profile.handle} />
	<meta property="og:title" content={blog.title} />
	<meta property="og:description" content={blog.description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={absolute(meta.image.src)} />
	<meta property="og:image:width" content={String(meta.image.width)} />
	<meta property="og:image:height" content={String(meta.image.height)} />
	<meta property="og:image:alt" content={meta.image.alt} />
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
		class="line-in relative grid border-t border-line pt-12 sm:pt-16 lg:grid-cols-12 lg:items-baseline lg:gap-x-6 lg:pt-20"
	>
		<div class="lg:col-span-3">
			<h1 id="blog-title" class="text-section font-bold">{blog.label}</h1>
			<p class="mt-3 text-small text-muted lg:mt-5">
				글 {data.posts.length}편 ·
				<a href="{blog.path}/rss.xml" data-sveltekit-reload class="link-inline">RSS</a>
			</p>
		</div>

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
								href={postPath(post.slug)}
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
	</div>
</section>
