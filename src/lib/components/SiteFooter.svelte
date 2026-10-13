<script lang="ts">
	import LogoMark from './LogoMark.svelte';
	import Icon from './Icon.svelte';

	import { profile, profileLinks } from '$lib/content';

	// Set the 0 and the 1 of the motto in the mono face: a small nod to the handle.
	// The clause from "0과" on stays on one line so the motto breaks at its pause.
	const breakAt = profile.motto.indexOf('0');
	const mottoLead = profile.motto.slice(0, breakAt);
	const mottoTail = profile.motto.slice(breakAt).split(/([01])/);
</script>

<footer class="mt-24 border-t border-line bg-surface sm:mt-32">
	<div class="page grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
		<div class="flex items-start gap-4 sm:gap-5">
			<LogoMark class="h-12 sm:h-14" alt="ZerOne 로고" />
			<div>
				<p class="text-motto font-bold">
					{mottoLead}<span class="whitespace-nowrap"
						>{#each mottoTail as part, index (index)}{#if part === '0' || part === '1'}<span
									class="mono font-medium text-accent">{part}</span
								>{:else}{part}{/if}{/each}</span
					>
				</p>
				<p class="mt-1 text-meta text-muted">
					{profile.handle} · {profile.name}
					<span lang="en">{profile.nameEn}</span>
				</p>
			</div>
		</div>

		<nav aria-label="프로필 링크">
			<ul class="flex flex-wrap gap-2">
				{#each profileLinks as link (link.href)}
					<li>
						<a
							href={link.href}
							class="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-meta font-medium transition-colors hover:border-accent hover:text-accent"
						>
							{link.label}
							<Icon name="arrow-up-right" class="size-3.5 text-muted" />
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<div class="border-t border-line">
		<div class="page flex items-center justify-between gap-4 py-5 text-meta text-muted">
			<p>© 2026 {profile.name}</p>
			<a href="#now" class="inline-flex items-center gap-1 hover:text-accent">
				맨 위로
				<Icon name="arrow-right" class="size-3.5 -rotate-90" />
			</a>
		</div>
	</div>
</footer>
