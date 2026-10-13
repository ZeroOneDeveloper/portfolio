<script lang="ts">
	import LogoMark from './LogoMark.svelte';
	import { footerColumns, issue, profile } from '$lib/content';

	const year = new Date().getFullYear();
</script>

<footer class="page mb-10 mt-28 sm:mt-32 lg:mt-40">
	<div class="rule-double"></div>

	<div class="grid grid-cols-1 gap-x-10 gap-y-10 pt-8 lg:grid-cols-12 lg:pt-10">
		<!-- Imprint -->
		<div class="flex gap-5 lg:col-span-4">
			<LogoMark class="h-[4.5rem]" alt="ZerOne 로고" />
			<div>
				<p class="font-mono text-meta uppercase text-ink-muted">Colophon · 판권</p>
				<p class="mt-1 text-title font-semibold leading-snug">
					{profile.handle}
					{issue.title}
				</p>
				<p class="font-latin text-[0.9375rem] italic text-ink-soft">
					Vol. {issue.volume}, No. {issue.number}
				</p>
				<p class="mt-3 font-latin text-[0.9375rem] italic text-ink-muted">
					Set in Hahmlet, Newsreader &amp; IBM Plex Mono.
				</p>
			</div>
		</div>

		<nav aria-label="바닥글" class="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 lg:col-span-8">
			{#each footerColumns as column (column.heading)}
				<div>
					<h2 class="border-b border-ink pb-1.5 text-meta-ko font-semibold text-ink">
						{column.heading}
					</h2>
					<ul class="mt-2 space-y-1.5 text-cite">
						{#each column.links as link (link.href)}
							<li>
								<a
									href={link.href}
									target={link.href.startsWith('#') ? undefined : '_blank'}
									rel={link.href.startsWith('#') ? undefined : 'noopener noreferrer'}
									class="text-ink-soft transition-colors hover:text-accent hover:underline"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</div>

	<p class="mt-12 border-t border-rule pt-5 text-note text-ink-soft lg:mt-16">
		“{profile.motto}”
	</p>

	<div
		class="mt-3 flex flex-col gap-1 text-cite text-ink-muted sm:flex-row sm:justify-between sm:gap-6"
	>
		<p>
			Copyright © {year}
			{profile.nameEn} ({profile.handle}). All rights reserved.
		</p>
		<p>{profile.company.name} · {profile.school.name}</p>
	</div>
</footer>
