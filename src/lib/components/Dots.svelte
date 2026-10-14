<script lang="ts">
	interface Props {
		/** Short items such as a year and a role, or the parts of a stack. */
		items: readonly string[];
	}

	let { items }: Props = $props();
</script>

<!--
	Items joined by middle dots. Each item stays whole, and each dot is glued to the item
	before it, so a wrapped line never starts with "·" or splits a year range.
-->
{#each items as item, index (index)}{#if index > 0}<span aria-hidden="true">&nbsp;·</span
		>{' '}{/if}<span class="whitespace-nowrap">{item}</span>{/each}
