<script lang="ts">
	import LogoMark from './LogoMark.svelte';

	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { active, trackActiveSection } from '$lib/active-section.svelte';
	import { blog, nav, profile } from '$lib/content';

	let scrollY = $state(0);

	// White all along, so nothing shows through; the hairline under it only once the page
	// has moved, where it has something to separate.
	const scrolled = $derived(scrollY > 8);

	// The sections are on the home page: from the blog, their links lead back to it.
	const home = $derived(page.url.pathname === '/');
	const onBlog = $derived(page.url.pathname.startsWith(blog.path));

	// The header stays as pages change, so the section it lights is found again on each one.
	let stopTracking: (() => void) | undefined;
	afterNavigate(() => {
		stopTracking?.();
		active.id = '';
		stopTracking = trackActiveSection();
	});
	$effect(() => () => stopTracking?.());
</script>

<svelte:window bind:scrollY />

<header
	class="sticky top-0 z-40 border-b bg-paper transition-colors duration-200 {scrolled
		? 'border-line'
		: 'border-transparent'}"
>
	<div class="page flex h-14 items-center justify-between gap-4 sm:h-16">
		<a href={home ? '#now' : '/'} class="group flex shrink-0 items-center gap-2.5">
			<LogoMark class="h-7" />
			<span class="underline-target text-small font-semibold">
				{profile.name}
			</span>
			<span class="sr-only">{home ? ', 맨 위로' : ', 첫 화면으로'}</span>
		</a>

		<nav aria-label="주요 메뉴">
			<ul class="flex items-center gap-x-3.5 text-small font-medium sm:gap-x-7">
				{#each nav as item (item.id)}
					<li>
						<a
							href="{home ? '' : '/'}#{item.id}"
							data-nav={item.id}
							aria-current={active.id === item.id ? 'location' : undefined}
							class="nav-link block py-2 text-muted underline decoration-transparent decoration-[1.5px] underline-offset-[0.5em] transition-colors duration-150 hover:text-ink hover:decoration-current"
						>
							{item.label}
						</a>
					</li>
				{/each}
				<!-- The blog is a page of its own, not a section of this one: a hairline sets it apart. -->
				<li class="border-l border-line pl-3.5 sm:pl-7">
					<a
						href={blog.path}
						aria-current={onBlog ? 'page' : undefined}
						class="nav-link block py-2 text-muted underline decoration-transparent decoration-[1.5px] underline-offset-[0.5em] transition-colors duration-150 hover:text-ink hover:decoration-current"
					>
						{blog.label}
					</a>
				</li>
			</ul>
		</nav>
	</div>
</header>
