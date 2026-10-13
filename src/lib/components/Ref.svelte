<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		class?: string;
		/** Print a small ↗ after external links. */
		arrow?: boolean;
		/** Keep the label and its arrow on one line (off for long identifiers). */
		nowrap?: boolean;
		children: Snippet;
	}

	let { href, class: className = '', arrow = true, nowrap = true, children }: Props = $props();

	const external = $derived(/^https?:\/\//.test(href));
</script>

<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	class="ink-link {nowrap ? 'whitespace-nowrap' : ''} {className}"
	>{@render children()}{#if external && arrow}<span
			aria-hidden="true"
			class="ml-[0.15em] inline-block font-latin text-[0.85em] no-underline">↗</span
		><span class="sr-only"> (새 창)</span>{/if}</a
>
