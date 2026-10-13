<script lang="ts">
	import LogoMark from './LogoMark.svelte';
	import Icon from './Icon.svelte';

	import { nav, profile } from '$lib/content';
</script>

<header class="sticky top-0 z-40 border-b border-line bg-canvas">
	<div class="page flex h-14 items-center justify-between gap-4 sm:h-16">
		<a href="#now" class="group flex items-center gap-2.5" aria-label="{profile.name}, 맨 위로">
			<LogoMark class="h-7 sm:h-8" />
			<span class="text-[0.9375rem] font-semibold tracking-[-0.01em] sm:text-base">
				{profile.name}
			</span>
		</a>

		<nav aria-label="주요 메뉴">
			<ul class="flex items-center gap-0.5 text-small font-medium sm:gap-1">
				{#each nav as item (item.id)}
					<li>
						<a
							href="#{item.id}"
							class="rounded-full px-2 py-1.5 text-ink-soft transition-colors hover:bg-sunken hover:text-ink sm:px-3"
						>
							{item.label}
						</a>
					</li>
				{/each}
				<li class="ml-1 sm:ml-2">
					<a
						href={profile.github}
						class="flex items-center gap-1.5 rounded-full border border-line-strong px-2.5 py-1.5 text-ink transition-colors hover:border-ink sm:px-3"
					>
						<Icon name="github" class="size-4" />
						<span class="sr-only sm:not-sr-only">GitHub</span>
					</a>
				</li>
			</ul>
		</nav>
	</div>
</header>
