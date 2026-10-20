<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import Icon from './Icon.svelte';
	import LogoMark from './LogoMark.svelte';

	import { page } from '$app/state';
	import { footerLinks, profile } from '$lib/content';

	// The opening (#now) is on the home page; elsewhere the top is where the content starts.
	const top = $derived(page.url.pathname === '/' ? '#now' : '#main');
</script>

<!--
	The sign-off, kept quiet: who, where to find him, and the copyright. As it comes into
	view its hairline draws in and the rows rise.
-->
<footer class="page mt-28 sm:mt-36 lg:mt-48">
	<div
		class="relative border-t border-line pb-10 pt-12 sm:pt-14 lg:pb-12 lg:pt-16"
		data-reveal="line"
	>
		<div class="grid gap-y-8 lg:grid-cols-12 lg:items-center lg:gap-x-6" data-reveal="rise">
			<p class="flex items-center gap-3 lg:col-span-3">
				<LogoMark class="h-8" alt="ZerOne 로고" loading="lazy" />
				<span class="text-small">
					<span class="font-semibold">{profile.handle}</span>
					<span class="text-muted">· {profile.name} <span lang="en">{profile.nameEn}</span></span>
				</span>
			</p>

			<nav aria-label="프로필 링크" class="lg:col-span-9">
				<ul class="flex flex-wrap gap-x-6 gap-y-2 text-small font-medium lg:gap-x-8">
					{#each footerLinks as link (link.href)}
						<li><ArrowLink href={link.href} label={link.label} /></li>
					{/each}
				</ul>
			</nav>
		</div>

		<div
			class="mt-12 flex items-center justify-between gap-4 text-meta text-muted lg:mt-16"
			data-reveal="rise"
		>
			<p>© 2026 {profile.name}</p>
			<a href={top} class="group inline-flex items-center gap-1 hover:text-ink">
				<span class="underline-target">맨 위로</span>
				<Icon name="arrow-up" class="size-3.5" />
			</a>
		</div>
	</div>
</footer>
