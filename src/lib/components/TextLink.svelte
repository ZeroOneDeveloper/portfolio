<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		onDark?: boolean;
		class?: string;
		children: Snippet;
	}

	let { href, onDark = false, class: className = '', children }: Props = $props();

	const external = $derived(/^https?:\/\//.test(href));
</script>

<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	class="inline-flex items-center gap-[2px] hover:underline {onDark
		? 'text-primary-on-dark'
		: 'text-primary'} {className}"
>
	{@render children()}<span aria-hidden="true" class="translate-y-[-1px]">›</span>
</a>
