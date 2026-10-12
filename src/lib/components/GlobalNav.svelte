<script lang="ts">
	import { IconMenu2, IconX } from '@tabler/icons-svelte';

	import whiteLogo from '$lib/logo-white.svg';
	import { profileLinks } from '$lib/content';

	let open = $state(false);
</script>

<header class="relative z-30 bg-void text-white">
	<nav
		aria-label="외부 프로필"
		class="mx-auto flex h-11 max-w-text items-center justify-between px-4 sm:px-6"
	>
		<a href="/" class="flex h-11 items-center" aria-label="ZerOne 홈">
			<img src={whiteLogo} alt="" class="h-8 w-8" />
		</a>

		<ul class="hidden items-center gap-6 lg:flex">
			{#each profileLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						class="text-nav-link text-white/80 transition-colors hover:text-white"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<button
			type="button"
			class="flex h-11 w-11 items-center justify-center lg:hidden"
			aria-expanded={open}
			aria-controls="global-nav-tray"
			aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
			onclick={() => (open = !open)}
		>
			{#if open}
				<IconX class="h-[18px] w-[18px]" stroke={1.5} />
			{:else}
				<IconMenu2 class="h-[18px] w-[18px]" stroke={1.5} />
			{/if}
		</button>
	</nav>

	{#if open}
		<ul
			id="global-nav-tray"
			class="absolute inset-x-0 top-11 bg-void px-4 pb-8 pt-2 sm:px-6 lg:hidden"
		>
			{#each profileLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						class="block py-2 font-display text-tagline text-white/90"
						onclick={() => (open = false)}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</header>
