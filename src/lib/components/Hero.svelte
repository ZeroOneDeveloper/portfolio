<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import Glance from './Glance.svelte';
	import Glued from './Glued.svelte';

	import { hero, portrait, profile, profileLinks } from '$lib/content';

	// No photo at all until a portrait is placed in src/lib/profile/.
	const photo = profile.photo;
</script>

<!--
	The opening: the statement, very large, then two quiet lines of context and the profile
	links; under it all, the at-a-glance row. The portrait has no frame: shot on pure white,
	it dissolves into the page. From lg it stands to the right of the statement, its foot on
	the hairline that opens the at-a-glance row. Below lg it sits top right, and the
	statement's first line, the name, comes to rest beside its foot: the padding above the
	heading is the photo's height (a share of the width) less the name's own line. From lg
	the statement and the portrait fill the screen less a band at the bottom, so the first
	view ends on that hairline, the row's labels just showing, and the first scroll brings
	the row; on a tall screen the words sit in the middle of the height they are given. The
	padding is what a 1536×864 screen can give and keep the band whole; on a shorter one
	the words need more height and push the hairline down, toward the bottom edge.
-->
<section id="now" aria-labelledby="hero-title" class="page">
	<div class="relative lg:grid lg:min-h-[calc(100svh-8rem)] lg:grid-cols-12 lg:gap-x-6">
		<div class="pb-16 sm:pb-24 lg:col-span-8 lg:row-start-1 lg:self-center lg:pt-16">
			<h1
				id="hero-title"
				class="text-display font-extrabold {photo
					? 'pt-[calc(1.5rem+70%-0.9em)] sm:pt-[calc(2.5rem+55%-0.9em)] md:pt-[calc(2.5rem+45%-0.9em)] lg:pt-0'
					: 'pt-12 sm:pt-16 lg:pt-0'}"
			>
				{#each hero.statement as line, index (line)}{#if index > 0}{' '}{/if}<span class="block"
						>{line}</span
					>{/each}
			</h1>

			<!-- Where he works, then where he studies: one quiet line each. -->
			<div class="mt-7 text-lede text-soft sm:mt-9 lg:mt-12">
				{#each hero.context as line (line)}
					<p><Glued text={line} /></p>
				{/each}
			</div>

			<ul
				aria-label="프로필"
				class="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-small font-medium max-[379px]:grid max-[379px]:grid-cols-2 sm:mt-8 sm:gap-x-6 lg:gap-x-8"
			>
				{#each profileLinks as link (link.href)}
					<li><ArrowLink href={link.href} label={link.label} /></li>
				{/each}
			</ul>
		</div>

		{#if photo}
			<img
				src={photo}
				width={portrait.width}
				height={portrait.height}
				alt={portrait.alt}
				fetchpriority="high"
				class="absolute right-0 top-6 aspect-[4/5] w-[56%] object-cover object-bottom sm:top-10 sm:w-[44%] md:w-[36%] lg:static lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:w-full lg:self-end"
			/>
		{/if}
	</div>

	<Glance />
</section>
