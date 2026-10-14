<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		href: string;
		label: string;
		/** Read after the label by screen readers only, when the label alone is ambiguous. */
		context?: string;
		class?: string;
	}

	let { href, label, context, class: className = '' }: Props = $props();
</script>

<!-- A text link with a small arrow: the label underlines on hover and focus, the arrow never. -->
<a {href} class="group inline-flex items-center gap-[0.3em] whitespace-nowrap {className}">
	<span class="underline-target">{label}</span>{#if context}<span class="sr-only"
			>{` (${context})`}</span
		>{/if}
	<Icon name="arrow-up-right" class="size-[0.72em]" />
</a>
