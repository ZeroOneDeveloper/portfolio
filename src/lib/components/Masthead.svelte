<script lang="ts">
	import LogoMark from './LogoMark.svelte';
	import { articles, issue, profile, profileLinks } from '$lib/content';

	// The issue is dated by its newest entry.
	const issueDate = articles[0].date.slice(0, 7);
</script>

<header class="page pt-3 sm:pt-5">
	<!-- Issue line -->
	<div
		class="flex items-baseline justify-between gap-4 pb-2 font-mono text-meta uppercase text-ink-muted"
	>
		<p>
			Vol. {issue.volume} <span aria-hidden="true">·</span> No. {issue.number}
		</p>
		<p class="hidden font-serif text-meta-ko normal-case tracking-normal md:block">
			{issue.title} <span class="font-latin italic">— {issue.titleEn}</span>
		</p>
		<p class="tabular-nums">{issueDate}</p>
	</div>

	<div class="border-t-2 border-ink"></div>

	<!-- Nameplate -->
	<div class="grid grid-cols-1 gap-4 py-5 sm:py-7 md:grid-cols-12 md:items-end md:gap-8">
		<a
			href="/"
			class="group flex items-end gap-3 text-ink sm:gap-5 md:col-span-8"
			aria-label="{profile.handle} — {issue.title} 첫 쪽"
		>
			<LogoMark class="h-[3.6rem] sm:h-[5.5rem] lg:h-[7.5rem]" />
			<span class="font-latin text-nameplate font-normal">
				Zer<span class="italic">One</span>
			</span>
		</a>

		<div class="md:col-span-4 md:pb-2 md:text-right">
			<p class="text-title font-semibold leading-snug">{profile.name}의 {issue.title}</p>
			<p class="font-latin text-[1.0625rem] italic text-ink-soft">
				{issue.titleEn} of {profile.nameEn}
			</p>
		</div>
	</div>

	<!-- Ear: where else the author publishes -->
	<nav aria-label="외부 프로필" class="border-t border-ink">
		<ul
			class="flex flex-wrap items-baseline gap-x-5 gap-y-1 py-2.5 text-cite text-ink-soft sm:gap-x-0"
		>
			{#each profileLinks as link, index (link.href)}
				<li class="flex items-baseline">
					{#if index > 0}
						<span aria-hidden="true" class="mx-4 hidden text-rule sm:inline">|</span>
					{/if}
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						class="ink-link no-underline hover:underline"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="rule-double"></div>
</header>
