<script lang="ts">
	import LogoMark from './LogoMark.svelte';
	import { type Language } from '$lib/blog/locale';
	import { profile } from '$lib/content';

	let {
		language,
		pathname,
		sibling
	}: {
		language: Language;
		pathname: string;
		sibling?: string | null;
	} = $props();
	const unavailable = $derived(language === 'ko' && !sibling);
</script>

<header class="border-b border-line bg-paper">
	<div class="page flex items-center justify-between gap-2 py-2 sm:gap-6 sm:py-3">
		<a
			href="/"
			aria-label={language === 'ko' ? `${profile.name} 홈` : `${profile.nameEn} home`}
			class="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2.5 text-small font-semibold"
		>
			<LogoMark class="h-7" />
			<span class="hidden sm:inline">{language === 'ko' ? profile.name : profile.nameEn}</span>
		</a>
		<a
			href="/"
			lang="ko"
			class="ml-auto hidden min-h-11 items-center text-small text-muted underline underline-offset-4 hover:text-ink sm:inline-flex"
		>
			{language === 'ko' ? '포트폴리오' : 'Portfolio (한국어)'}
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
						class="inline-flex min-h-11 min-w-24 items-center justify-center gap-1.5 rounded-full px-2 text-muted sm:gap-2 sm:px-3"
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
						class="inline-flex min-h-11 min-w-24 items-center justify-center gap-1.5 rounded-full px-2 sm:gap-2 sm:px-3 {current
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
</header>

<style>
	.language-flag {
		flex: none;
		font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
		font-size: 1.125rem;
		line-height: 1;
	}
</style>
