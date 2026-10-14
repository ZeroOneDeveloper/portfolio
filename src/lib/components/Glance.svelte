<script lang="ts">
	import Glued from './Glued.svelte';
	import Icon from './Icon.svelte';

	import { glance, nav } from '$lib/content';

	// Read after each link by screen readers only: the section it jumps to.
	const sectionLabel = Object.fromEntries(nav.map((item) => [item.id, item.label]));

	// The title's last word carries the arrow, so the arrow never wraps onto a line alone.
	function split(title: string): [string, string] {
		const at = title.lastIndexOf(' ') + 1;
		return [title.slice(0, at), title.slice(at)];
	}
</script>

<!--
	At a glance: what he makes, what he researches and where he started, side by side under
	the opening. The hairline on top is the one the portrait stands on. Each title is the
	one link of its item, into the section that holds the detail; its ::after stretches over
	the item, so the whole of it is clickable. Stacked on phones, three across from md.
-->
<ul
	aria-label="한눈에 보기"
	class="grid gap-y-8 border-t border-line pt-7 sm:pt-8 md:grid-cols-3 md:gap-x-6"
>
	{#each glance as item (item.section)}
		{@const [head, tail] = split(item.title)}
		<li class="group relative">
			<p class="text-meta text-muted">{item.label}</p>
			<p class="mt-2 text-title font-semibold">
				<a href="#{item.section}" class="link underline-target after:absolute after:inset-0">
					{head}<span class="whitespace-nowrap"
						>{tail}<Icon
							name="arrow-down"
							class="ml-[0.3em] inline size-[0.72em] align-[-0.02em]"
						/></span
					><span class="sr-only">{` (${sectionLabel[item.section]})`}</span>
				</a>
			</p>
			<p class="mt-1.5 max-w-[25rem] text-balance text-small text-muted">
				<Glued text={item.body} />
			</p>
		</li>
	{/each}
</ul>
