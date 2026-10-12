<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		variant?: 'primary' | 'secondary' | 'secondary-on-dark';
		size?: 'default' | 'compact';
		children: Snippet;
	}

	let { href, variant = 'primary', size = 'default', children }: Props = $props();

	const external = $derived(/^https?:\/\//.test(href));

	const variants = {
		primary: 'bg-primary text-white',
		secondary: 'border border-primary text-primary',
		'secondary-on-dark': 'border border-primary-on-dark text-primary-on-dark'
	};

	const sizes = {
		default: 'px-[22px] py-[11px] text-body',
		compact: 'px-[11px] py-[4px] text-[12px] leading-[1.5]'
	};
</script>

<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	class="inline-flex items-center justify-center whitespace-nowrap rounded-pill transition-transform duration-150 active:scale-95 {variants[
		variant
	]} {sizes[size]}"
>
	{@render children()}
</a>
