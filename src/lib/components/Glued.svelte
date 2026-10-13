<script lang="ts">
	interface Props {
		text: string;
	}

	let { text }: Props = $props();

	// Glue each middle dot to the word before it, so a wrapped line never starts with "·",
	// and keep ranges such as 2012–2023 or 4947–4958 whole.
	const parts = $derived(text.replace(/ · /g, ' · ').split(/(\d{4}–\d{4}[년:]?)/));
</script>

{#each parts as part, index (index)}{#if index % 2}<span class="whitespace-nowrap">{part}</span
		>{:else}{part}{/if}{/each}
