<script lang="ts">
	import PillLink from './PillLink.svelte';
	import { profile, sections } from '$lib/content';
</script>

<nav
	aria-label="페이지 섹션"
	class="sticky top-0 z-20 border-b border-black/[0.08] bg-parchment/80 backdrop-blur-xl backdrop-saturate-[1.8]"
>
	<div class="mx-auto flex h-[52px] max-w-text items-center justify-between px-4 sm:px-6">
		<a href="#top" class="font-display text-tagline text-ink">{profile.name}</a>

		<div class="flex items-center gap-6">
			<ul class="hidden items-center gap-6 md:flex">
				{#each sections as section (section.id)}
					<li>
						<a href="#{section.id}" class="text-[12px] leading-none text-ink/80 hover:text-ink">
							{section.label}
						</a>
					</li>
				{/each}
			</ul>
			<PillLink href={profile.github} size="compact">GitHub</PillLink>
		</div>
	</div>
</nav>
