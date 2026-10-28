<script lang="ts">
	import LogoMark from './LogoMark.svelte';
	import { blogPath, type Language } from '$lib/blog/locale';
	import { profile } from '$lib/content';

	let {
		language,
		pathname,
		sibling,
		previewSibling = false,
		noindex = false
	}: {
		language: Language;
		pathname: string;
		sibling?: string | null;
		previewSibling?: boolean;
		noindex?: boolean;
	} = $props();
	const unavailable = $derived(language === 'ko' && !sibling);
</script>

<header class="border-b border-line bg-paper">
	<div class="page py-4 sm:py-5">
		<div class="flex min-h-11 items-center justify-between gap-4">
			<a href="/" class="inline-flex min-h-11 items-center gap-2.5 text-small font-semibold">
				<LogoMark class="h-7" />
				<span>{language === 'ko' ? profile.name : profile.nameEn}</span>
			</a>
			<a
				href="/"
				lang="ko"
				class="inline-flex min-h-11 items-center text-small text-muted underline underline-offset-4 hover:text-ink"
			>
				{language === 'ko' ? '포트폴리오' : 'Portfolio (한국어)'}
			</a>
		</div>
		<div class="mt-3 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
			<a
				href={blogPath(language)}
				aria-current={pathname === blogPath(language) ? 'page' : undefined}
				class="inline-flex min-h-11 items-center text-small font-semibold underline decoration-line underline-offset-8 hover:decoration-ink"
			>
				{language === 'ko' ? '블로그' : 'Blog'}
			</a>
			<nav
				aria-label={language === 'ko' ? '블로그 언어' : 'Blog language'}
				aria-describedby={unavailable ? 'translation-availability' : undefined}
				class="inline-flex rounded-full border border-line p-1 text-small"
			>
				{#each ['ko', 'en'] as code}
					{@const current = language === code}
					{#if !current && unavailable}
						<span
							lang="en"
							aria-disabled="true"
							class="inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-full px-3 text-muted"
						>
							<span class="language-flag" aria-hidden="true">🇺🇸</span>
							English
						</span>
					{:else}
						<a
							href={current ? pathname : sibling}
							lang={code}
							hreflang={current ? undefined : code}
							rel={current ? undefined : 'alternate'}
							aria-current={current ? 'page' : undefined}
							class="inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-full px-3 {current
								? 'bg-ink font-semibold text-paper'
								: 'text-soft hover:bg-field hover:text-ink'}"
						>
							<span class="language-flag" aria-hidden="true">{code === 'ko' ? '🇰🇷' : '🇺🇸'}</span>
							{code === 'ko' ? '한국어' : 'English'}
						</a>
					{/if}
				{/each}
			</nav>
		</div>
		{#if unavailable}
			<p id="translation-availability" class="mt-3 text-small text-muted">
				이 글은 한국어로만 제공돼요.
				<a
					href="/en/blog"
					lang="en"
					class="ml-1 inline-flex min-h-11 items-center underline underline-offset-4 hover:text-ink"
					>English articles →</a
				>
			</p>
		{:else if noindex || previewSibling}
			<p role="note" class="mt-4 border-l-2 border-line pl-3 text-small text-muted">
				{previewSibling
					? 'English · 검토용 초안 · 발행 승인 전'
					: 'Review draft · Not approved for publication'}
			</p>
		{/if}
	</div>
</header>

<style>
	.language-flag {
		flex: none;
		font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
		font-size: 1.125rem;
		line-height: 1;
	}
</style>
