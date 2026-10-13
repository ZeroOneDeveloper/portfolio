<script lang="ts">
	import { folio, type IssueSection } from '$lib/content';

	interface Props {
		section: IssueSection;
		/** Show the §n mark at every width (sections without a margin numeral). */
		showMark?: boolean;
	}

	let { section, showMark = false }: Props = $props();
</script>

<!-- The running head that opens every section: §n, its name, and a binary folio. -->
<div
	class="flex items-baseline justify-between gap-4 border-t border-ink pt-2.5 text-meta-ko text-ink-muted"
>
	<p class="flex items-baseline gap-2.5">
		<span
			class="font-latin text-[1.25rem] italic leading-none text-accent {showMark
				? ''
				: 'lg:hidden'}">§{section.no}</span
		>
		<span class="font-serif font-medium text-ink">{section.label}</span>
		<span aria-hidden="true" class="text-rule">/</span>
		<span class="font-latin text-[0.9375rem] italic">{section.en}</span>
	</p>
	<p class="font-mono tabular-nums tracking-[0.14em]">
		<span class="sr-only">쪽 번호 </span>{folio(section.no)}
	</p>
</div>
