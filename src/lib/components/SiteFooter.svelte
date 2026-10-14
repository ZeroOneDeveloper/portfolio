<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import Icon from './Icon.svelte';
	import LogoMark from './LogoMark.svelte';

	import { footerLinks, profile } from '$lib/content';

	// The motto in two lines, broken at its pause; "0과 1" is glued, so a narrow phone can
	// only break the second line before 충분하다.
	const breakAt = profile.motto.indexOf('0');
	const motto = [
		profile.motto.slice(0, breakAt).trim(),
		profile.motto.slice(breakAt).replace(' ', '\u00a0')
	];
</script>

<!--
	The sign-off: the motto, large, as the page's last word; then who, where to find him,
	and the copyright. As it comes into view its hairline draws in and the motto rises, a
	line at a time, from behind its own baseline.
-->
<footer class="page mt-28 sm:mt-36 lg:mt-48">
	<div
		class="relative border-t border-line pb-10 pt-16 sm:pt-20 lg:pb-12 lg:pt-28"
		data-reveal="line"
	>
		<p class="text-motto font-bold">
			{#each motto as line, index (index)}{#if index > 0}{' '}{/if}<span
					class="block"
					data-reveal="mask"><span class="block">{line}</span></span
				>{/each}
		</p>

		<div
			class="mt-16 grid gap-y-8 sm:mt-20 lg:mt-28 lg:grid-cols-12 lg:items-center lg:gap-x-6"
			data-reveal="rise"
		>
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
			<a href="#now" class="group inline-flex items-center gap-1 hover:text-ink">
				<span class="underline-target">맨 위로</span>
				<Icon name="arrow-up" class="size-3.5" />
			</a>
		</div>
	</div>
</footer>
