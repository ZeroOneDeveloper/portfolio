<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import Dots from './Dots.svelte';

	import { explorations, profile } from '$lib/content';
</script>

<!--
	High-school explorations: a quiet row of their posters, each with a one-line caption
	and its links. Two across on phones, four from lg.
-->
<div class="mt-16 border-t border-line pt-12 sm:pt-14 lg:mt-20 lg:pt-16">
	<h3 class="text-title font-semibold" data-reveal="rise">고등학교 탐구</h3>
	<p class="mt-1.5 text-small text-muted" data-reveal="rise">
		<a href={profile.highSchool.url} class="link-inline">{profile.highSchool.name}</a>에서 질문
		하나를 모델과 코드로 끝까지 따라간 기록입니다.
	</p>

	<ul class="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:mt-10 lg:grid-cols-4">
		{#each explorations as item (item.title)}
			<li data-reveal="rise">
				<figure>
					<img
						src={item.image}
						width={item.imageSize}
						height={item.imageSize}
						alt="{item.title} 탐구 포스터"
						loading="lazy"
						decoding="async"
						class="aspect-square w-full rounded-[4px] object-cover"
					/>
					<!-- The poster states its purpose itself; the caption adds when and where. -->
					<figcaption class="mt-4">
						<span class="block text-small font-semibold">{item.title}</span>
						<span class="mt-0.5 block text-meta text-muted">
							<Dots items={item.year.split(' · ')} />
						</span>
					</figcaption>
				</figure>
				<ul class="mt-2 flex flex-wrap gap-x-4 text-meta font-semibold">
					{#each item.links as link (link.href)}
						<li><ArrowLink href={link.href} label={link.label} context={item.title} /></li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>
