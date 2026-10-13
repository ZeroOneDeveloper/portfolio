<script lang="ts">
	import Dots from './Dots.svelte';
	import Icon from './Icon.svelte';
	import SectionHead from './SectionHead.svelte';

	import { explorations, profile } from '$lib/content';
</script>

<!-- High-school explorations: a smaller gallery of their posters. -->
<div class="mt-16 sm:mt-20">
	<SectionHead id="explorations" level={3} title="고등학교 탐구">
		{#snippet lead()}
			감염병, 화학 공정, 수학 교육, 자원 관리.
			<a href={profile.highSchool.url} class="text-link">{profile.highSchool.name}</a>에서 질문
			하나를 모델과 코드로 끝까지 따라간 기록입니다.
		{/snippet}
	</SectionHead>

	<!-- Phone: a swipeable row so each poster stays large enough to read. `relative` keeps
	     the screen-reader-only labels inside the row, so they cannot widen the page. -->
	<ul
		class="relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
		aria-label="고등학교 탐구 포스터"
	>
		{#each explorations as item (item.title)}
			<li class="w-[82%] shrink-0 snap-start sm:w-auto">
				<figure class="flex h-full flex-col">
					<img
						src={item.image}
						width={item.imageSize}
						height={item.imageSize}
						alt="{item.title} 탐구 포스터"
						loading="lazy"
						decoding="async"
						class="aspect-square w-full rounded-media border border-black bg-black object-cover"
					/>
					<figcaption class="flex flex-1 flex-col pt-4">
						<p class="text-meta text-muted">
							<Dots items={item.year.split(' · ')} monoFirst />
						</p>
						<p class="mt-1 text-item-title font-semibold">
							{item.title}
							<span class="font-normal text-muted">— {item.purpose}</span>
						</p>
						<p class="mb-auto mt-1.5 text-meta text-ink-soft">{item.summary}</p>
						<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
							<span class="mono text-micro text-muted"
								><Dots items={item.stack.split(' · ')} /></span
							>
						</div>
						<ul class="mt-2 flex flex-wrap gap-x-4">
							{#each item.links as link (link.href)}
								<li>
									<a
										href={link.href}
										class="inline-flex items-center gap-1 text-meta font-semibold text-accent hover:text-accent-deep"
									>
										{link.label}
										<Icon name="arrow-up-right" class="size-3.5" />
										<span class="sr-only">({item.title})</span>
									</a>
								</li>
							{/each}
						</ul>
					</figcaption>
				</figure>
			</li>
		{/each}
	</ul>
</div>
