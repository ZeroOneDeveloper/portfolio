<script lang="ts">
	import Icon from './Icon.svelte';

	import { intro, namedArticles, portrait, profile } from '$lib/content';

	interface Props {
		/** Grid placement within the opening. */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	// No photo frame at all until a portrait is placed in src/lib/profile/.
	const photo = profile.photo;
</script>

<!--
	지금: who he is and what he does now, kept short so AXIT, right below it, is in the
	first view. A portrait, once there is one, sits beside the name.
-->
<section id="now" aria-labelledby="now-name" class="min-w-0 {className}">
	<div class="flex items-end gap-5 sm:gap-6">
		{#if photo}
			<!-- A white studio portrait on a white card: the white reads as the frame. -->
			<img
				src={photo}
				width={portrait.width}
				height={portrait.height}
				alt={portrait.alt}
				fetchpriority="high"
				class="aspect-[4/5] w-24 shrink-0 rounded-media border border-line bg-surface object-cover object-[center_30%] shadow-lift sm:w-32"
			/>
		{/if}
		<div class="min-w-0">
			<h1 id="now-name" class="text-name font-bold">
				{profile.name}
				<span
					lang="en"
					class="ml-1.5 inline-block text-[0.42em] font-semibold tracking-[-0.01em] text-muted sm:ml-2"
				>
					{profile.nameEn}
				</span>
			</h1>
			<p class="mt-2 text-lede font-semibold sm:mt-3">
				{profile.company.name}
				{profile.role}
			</p>
		</div>
	</div>

	<!-- 지금 is lit (a one); 최근 is the ring (a zero), the same marks the nav and 경력 use. -->
	<dl
		class="mt-6 grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 gap-y-5 sm:mt-8 sm:grid-cols-[4.25rem_minmax(0,1fr)] sm:gap-x-4"
	>
		<dt class="flex h-[1.8rem] items-center gap-2 text-meta font-semibold text-accent">
			<span class="flex w-[9px] justify-center" aria-hidden="true">
				<span class="bit bit-on"></span>
			</span>
			지금
		</dt>
		<dd class="max-w-[38rem]">
			<p class="text-opener font-bold">{intro.now}</p>
			<p class="mt-1.5 text-body text-ink-soft">{intro.realworld}</p>
		</dd>

		<dt class="flex h-[1.75rem] items-center gap-2 text-meta font-semibold text-muted">
			<span class="flex w-[9px] justify-center" aria-hidden="true">
				<span class="bit"></span>
			</span>
			최근
		</dt>
		<dd class="max-w-[38rem] text-body text-ink-soft">
			{intro.recent}
			<span class="whitespace-nowrap text-meta">
				{#each namedArticles as article, index (article.href)}
					{#if index > 0}<span aria-hidden="true" class="px-1 text-muted">·</span>{/if}<a
						href={article.href}
						class="inline-flex items-center gap-0.5 font-semibold text-accent hover:text-accent-deep"
					>
						{article.outlet}
						<Icon name="arrow-up-right" class="size-3" />
						<span class="sr-only">기사</span>
					</a>
				{/each}
			</span>
		</dd>
	</dl>

	<ul class="mt-6 flex flex-wrap gap-1.5 sm:mt-8 sm:gap-2" aria-label="바로가기">
		{#each intro.links as link (link.href)}
			<li>
				<a
					href={link.href}
					class="inline-flex items-center gap-1 rounded-full border border-line-strong bg-surface px-2.5 py-1.5 text-meta font-medium transition-colors hover:border-accent hover:text-accent sm:gap-1.5 sm:px-3.5 sm:text-small"
				>
					{#if link.label === 'GitHub'}<Icon name="github" class="size-4" />{/if}
					{link.label}
					<Icon name="arrow-up-right" class="size-3.5 text-muted" />
				</a>
			</li>
		{/each}
	</ul>
</section>
