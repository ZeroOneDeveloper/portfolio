<script lang="ts">
	import { onMount } from 'svelte';

	import { IconMoonStars, IconSun } from '@tabler/icons-svelte';

	import '../app.css';

	let isDarkMode = $state(true);

	onMount(() => {
		isDarkMode = document.documentElement.classList.contains('dark');
	});

	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		document.documentElement.classList.toggle('dark', isDarkMode);
	}

	let { children } = $props();
</script>

<div class="min-h-screen overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 ease-in-out">
	<nav
		class="sticky top-0 flex w-full items-center justify-around border-b border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-black"
	>
		<a
			href="/"
			class="bg-gradient-to-br from-teal-500 via-gray-600 to-blue-800 bg-clip-text text-3xl text-transparent md:text-4xl"
			>ZERONE
		</a>
		<button onclick={toggleDarkMode}>
			{#if isDarkMode}
				<IconMoonStars
					class="h-6 w-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-800 md:h-8 md:w-8"
				/>
			{:else}
				<IconSun
					class="h-6 w-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-200 md:h-8 md:w-8"
				/>
			{/if}
		</button>
	</nav>

	{@render children()}
</div>
