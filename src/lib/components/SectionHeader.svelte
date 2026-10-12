<script lang="ts">
	interface Props {
		eyebrow: string;
		title: string;
		lead?: string;
		onDark?: boolean;
	}

	let { eyebrow, title, lead, onDark = false }: Props = $props();
</script>

<header class="mx-auto mb-12 max-w-text text-center sm:mb-16">
	<p class="mb-2 text-tagline {onDark ? 'text-body-muted' : 'text-ink-48'}">{eyebrow}</p>
	<h2 class="text-[34px] font-semibold leading-[1.1] sm:text-display-lg">{title}</h2>
	{#if lead}
		<p
			class="mx-auto mt-4 max-w-[692px] text-[21px] leading-[1.38] sm:text-lead {onDark
				? 'text-body-muted'
				: 'text-ink-80'}"
		>
			{lead}
		</p>
	{/if}
</header>
