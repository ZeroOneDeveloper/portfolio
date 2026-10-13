<script lang="ts">
	import LogoMark from './LogoMark.svelte';
	import Icon from './Icon.svelte';

	import { active, trackActiveSection } from '$lib/active-section.svelte';
	import { articles, namedArticles, nav, papers, profile, projects } from '$lib/content';

	// Quiet counts beside the labels, from md up: what each section holds. AXIT is one
	// thing and 경력 is a line, not a list, so neither has one.
	const press = namedArticles.length + articles.length;
	const counts: Record<string, { shown: string; spoken: string }> = {
		projects: { shown: pad(projects.length), spoken: `${projects.length}개` },
		research: { shown: pad(papers.length), spoken: `논문 ${papers.length}편` },
		news: { shown: pad(press), spoken: `${press}건` }
	};

	function pad(count: number): string {
		return String(count).padStart(2, '0');
	}

	$effect(() => trackActiveSection());
</script>

<header class="sticky top-0 z-40 border-b border-line bg-canvas">
	<div class="page flex h-14 items-center justify-between gap-3 sm:h-16">
		<a href="#now" class="flex shrink-0 items-center gap-2 sm:gap-2.5">
			<LogoMark class="h-7 sm:h-8" />
			<!-- Below sm the five nav items need the room; the name is still the link's name. -->
			<span class="sr-only text-base font-semibold tracking-[-0.01em] sm:not-sr-only">
				{profile.name}
			</span>
			<span class="sr-only">, 맨 위로</span>
		</a>

		<nav aria-label="주요 메뉴">
			<ul class="flex items-center gap-0.5 text-small font-medium sm:gap-1">
				{#each nav as item (item.id)}
					<li>
						<a
							href="#{item.id}"
							data-nav={item.id}
							aria-current={active.id === item.id ? 'location' : undefined}
							class="nav-link group flex items-center gap-1.5 rounded-full px-1.5 py-1.5 text-ink-soft transition-colors hover:text-ink max-[359px]:px-1 sm:gap-2 sm:px-2.5"
						>
							<span class="flex w-[9px] justify-center" aria-hidden="true">
								<span class="bit group-hover:border-muted"></span>
							</span>
							{item.label}
							{#if counts[item.id]}
								<span class="mono hidden text-micro text-muted md:inline" aria-hidden="true">
									{counts[item.id].shown}
								</span>
								<span class="sr-only">({counts[item.id].spoken})</span>
							{/if}
						</a>
					</li>
				{/each}
				<li class="ml-1 hidden sm:ml-2 sm:block">
					<a
						href={profile.github}
						class="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-ink transition-colors hover:border-ink"
					>
						<Icon name="github" class="size-4" />
						GitHub
					</a>
				</li>
			</ul>
		</nav>
	</div>
</header>
