<script lang="ts">
	import Icon from './Icon.svelte';

	import { intro, profile } from '$lib/content';
</script>

<!--
	지금: who he is and what he does now. Photo and name share one row on every width,
	so the lead case below stays inside the first screen.
-->
<section id="now" aria-labelledby="now-name" class="page pt-6 sm:pt-10 lg:pt-11">
	<div
		class="grid grid-cols-[6.75rem_minmax(0,1fr)] items-end gap-x-5 gap-y-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-x-8 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-x-12"
	>
		<!-- A white studio portrait on a white tile: the white reads as the frame. -->
		<figure>
			<img
				src={profile.photo.src}
				width={profile.photo.width}
				height={profile.photo.height}
				alt={profile.photo.alt}
				fetchpriority="high"
				class="aspect-[4/5] w-full rounded-card border border-line bg-surface object-cover shadow-lift"
				style="object-position: center 30%"
			/>
		</figure>

		<!-- On phones the two blocks join the grid (name beside the photo, the rest below);
		     from sm up they stack as one column beside the photo. -->
		<div class="contents sm:block">
			<div>
				<p class="flex items-center gap-2 text-meta font-semibold text-accent">
					<span class="size-1.5 rounded-full bg-accent" aria-hidden="true"></span>
					지금
				</p>
				<h1 id="now-name" class="mt-1.5 text-name font-bold sm:mt-2">
					{profile.name}
					<span
						lang="en"
						class="mt-1 block text-[0.9375rem] font-semibold tracking-normal text-muted sm:ml-2 sm:mt-0 sm:inline sm:text-[0.42em] sm:tracking-[-0.01em]"
					>
						{profile.nameEn}
					</span>
				</h1>
				<p class="mt-2 text-[1.0625rem] font-semibold leading-snug sm:mt-3 sm:text-lede">
					{profile.company.name}
					{profile.role}
				</p>
			</div>

			<div class="col-span-2 sm:mt-6">
				<p class="max-w-[38rem] text-balance text-lede text-ink-soft">{intro.positioning}</p>
				<ul class="mt-4 flex flex-wrap gap-2 sm:mt-5" aria-label="바로가기">
					{#each intro.links as link (link.href)}
						<li>
							<a
								href={link.href}
								class="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1.5 text-meta font-medium transition-colors hover:border-accent hover:text-accent sm:px-3.5 sm:text-small"
							>
								{#if link.label === 'GitHub'}<Icon name="github" class="size-4" />{/if}
								{link.label}
								<Icon name="arrow-up-right" class="size-3.5 text-muted" />
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>
