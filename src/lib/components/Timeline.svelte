<script lang="ts">
	import SectionHead from './SectionHead.svelte';

	import { timeline } from '$lib/content';
</script>

<section id="career" aria-labelledby="career-title" class="page mt-24 sm:mt-32">
	<SectionHead
		id="career-title"
		title="경력"
		lead="회사와 학교, 만든 것과 쓴 것을 해마다 정리했습니다."
	/>

	<ol class="border-t border-ink">
		{#each timeline as entry (entry.year)}
			<li
				class="grid gap-x-8 gap-y-3 border-b border-line py-5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:py-6 lg:grid-cols-[12rem_minmax(0,1fr)]"
			>
				<p
					class="mono flex items-center gap-2 self-start pt-0.5 text-small font-medium {entry.current
						? 'text-accent'
						: 'text-ink'}"
				>
					{#if entry.current}
						<span class="size-1.5 rounded-full bg-accent" aria-hidden="true"></span>
					{/if}
					{entry.year}
				</p>
				<ul class="grid gap-x-10 gap-y-4 lg:grid-cols-2">
					{#each entry.items as item (item.title)}
						<li class="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-x-3">
							<span class="pt-0.5 text-meta text-muted">{item.kind}</span>
							<div>
								<p class="text-item-title font-semibold">
									{#if item.href}
										<a href={item.href} class="text-link">{item.title}</a>
									{:else}
										{item.title}
									{/if}
								</p>
								<p class="mt-0.5 text-meta text-muted">{item.detail}</p>
							</div>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ol>
</section>
