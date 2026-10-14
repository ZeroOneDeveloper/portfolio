<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import BinaryField from './BinaryField.svelte';

	import { hero, portrait, profile, profileLinks } from '$lib/content';

	// No photo at all until a portrait is placed in src/lib/profile/.
	const photo = profile.photo;

	// The first sentence is set stronger than the rest. From lg the lines are balanced (five
	// of about 30 characters at full width); everywhere, the last two words keep together,
	// so the paragraph never ends on a word alone.
	const [lead, ...more] = hero.intro;
	const rest = more.join(' ');
	const tailAt = rest.lastIndexOf(' ', rest.lastIndexOf(' ') - 1) + 1;

	// What the field of 0s and 1s parts around: the photo's person and every block of text.
	// Each box is measured on an element that never moves, while what it holds may slide in.
	let photoElement = $state<HTMLImageElement>();
	let nameElement = $state<HTMLElement>();
	let latinElement = $state<HTMLElement>();
	let introElement = $state<HTMLElement>();
	let linksElement = $state<HTMLElement>();
</script>

<!--
	The opening: his name, very large, his name in Latin beside it, then who he is in three
	sentences and the profile links. Behind it all, across the full width, the field of 0s
	and 1s: it runs through the white backdrop of the frameless portrait, stops at the
	person, and keeps clear of the text.

	From lg the portrait stands at the right, its foot on the hairline that opens 작업, and
	the words sit low on the left, leaving the field open above them. The opening fills the
	screen less a band at the bottom, so the first view ends on that hairline with 작업's
	number just showing. Below lg the portrait sits top right and the name comes to rest
	beside its foot: the padding above the heading is the photo's height (a share of the
	width) less the name's own line.
-->
<section id="now" aria-labelledby="hero-title" class="relative isolate">
	<div class="page">
		<div class="relative lg:grid lg:min-h-[calc(100svh-8rem)] lg:grid-cols-12 lg:gap-x-6">
			<div class="relative z-20 pb-16 sm:pb-20 lg:col-span-7 lg:row-start-1 lg:self-end lg:pt-24">
				<h1
					id="hero-title"
					class="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-display font-extrabold {photo
						? 'pt-[calc(1.5rem+70%-0.9em)] sm:pt-[calc(2.5rem+55%-0.9em)] md:pt-[calc(2.5rem+45%-0.9em)] lg:pt-0'
						: 'pt-12 sm:pt-16 lg:pt-0'}"
				>
					<span bind:this={nameElement} class="enter-mask"
						><span class="block">{profile.name}</span></span
					>
					<span bind:this={latinElement} class="w-full md:w-auto"
						><span
							lang="en"
							class="enter-rise block text-intro font-medium text-muted"
							style:--enter-delay="260ms">{profile.nameEn}</span
						></span
					>
				</h1>

				<div bind:this={introElement} class="mt-8 max-w-[27em] text-intro sm:mt-10 lg:mt-12">
					<p class="enter-rise lg:text-balance" style:--enter-delay="380ms">
						<span class="font-semibold text-ink">{lead}</span>
						<span class="text-soft"
							>{rest.slice(0, tailAt)}<span class="whitespace-nowrap">{rest.slice(tailAt)}</span
							></span
						>
					</p>
				</div>

				<div bind:this={linksElement} class="mt-7 w-fit sm:mt-9">
					<ul
						aria-label="프로필"
						class="enter-rise flex flex-wrap gap-x-4 gap-y-2 text-small font-medium max-[379px]:grid max-[379px]:grid-cols-2 sm:gap-x-6 lg:gap-x-8"
						style:--enter-delay="500ms"
					>
						{#each profileLinks as link (link.href)}
							<li><ArrowLink href={link.href} label={link.label} /></li>
						{/each}
					</ul>
				</div>
			</div>

			{#if photo}
				<img
					bind:this={photoElement}
					src={photo}
					width={portrait.width}
					height={portrait.height}
					alt={portrait.alt}
					fetchpriority="high"
					class="enter-fade absolute right-0 top-6 z-0 aspect-[4/5] w-[56%] object-cover object-bottom sm:top-10 sm:w-[44%] md:w-[36%] lg:relative lg:inset-auto lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:w-full lg:self-end"
					style:--enter-delay="120ms"
				/>
			{/if}
		</div>
	</div>

	<BinaryField
		photo={photoElement}
		clear={[nameElement, latinElement, introElement, linksElement]}
	/>
</section>
