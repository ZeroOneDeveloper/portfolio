<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import Dots from './Dots.svelte';
	import Glued from './Glued.svelte';

	import type { Project } from '$lib/content';

	interface Props {
		project: Project;
		/** A main project, with its picture; or one of the early ones, a line of text. */
		kind?: 'main' | 'early';
		/** Under 작업's own heading, or under the early projects' group heading too. */
		level?: 3 | 4;
	}

	let { project, kind = 'main', level = 3 }: Props = $props();

	const main = $derived(kind === 'main');
	const heading = $derived(`h${level}`);
	const media = $derived(project.media);
</script>

<!--
	One project, in one of three settings.
	- On a phone, and wherever there is no mouse: as before, the name, then what and when,
	  then the picture; from lg a main project keeps its picture on the right.
	- On a wide screen with a mouse (fine): a row of an index. The name is set large on the
	  left, what and when sit on the right, and the picture leaves the flow: Work.svelte
	  floats it beside the pointer, while it stays here for screen readers.
	data-preview marks a row that has a picture to float; data-preview-edge is where that
	picture must stop, so it never covers the words.
-->
<article
	id={project.id}
	aria-labelledby="{project.id}-title"
	data-preview={media ? project.id : undefined}
	class="work-row grid fine:items-start fine:py-8 lg:grid-cols-9 lg:gap-x-6 {main
		? 'py-12 sm:py-14 lg:py-16'
		: 'py-5'}"
>
	<svelte:element
		this={heading}
		id="{project.id}-title"
		class="fine:col-span-5 fine:row-start-1 fine:text-index fine:font-bold {main
			? 'text-project font-bold lg:col-span-5'
			: 'text-title font-semibold lg:col-span-3'}"
	>
		{project.name}
	</svelte:element>

	<div
		data-preview-edge
		class="fine:col-span-4 fine:col-start-6 fine:row-start-1 fine:mt-[0.45rem] {main
			? 'mt-2 lg:col-span-5 lg:row-start-2'
			: 'lg:col-span-6 lg:col-start-4 lg:row-start-1'}"
	>
		<p class="text-small text-muted"><Dots items={[project.year, project.role]} /></p>
		<p
			class="max-w-measure text-soft fine:mt-3 fine:text-small {main
				? 'mt-5 text-body'
				: 'mt-1.5 text-small'}"
		>
			<Glued text={project.summary} />
		</p>
		<p class="text-meta text-muted fine:mt-2 {main ? 'mt-5' : 'mt-1'}">
			<span class="sr-only">기술 스택:</span>
			<Dots items={project.stack.split(' · ')} />
		</p>
		{#if project.links.length}
			<ul
				class="flex flex-wrap gap-x-6 gap-y-1 text-small font-semibold fine:mt-3 {main
					? 'mt-4'
					: 'mt-2.5'}"
			>
				{#each project.links as link (link.href)}
					<li><ArrowLink href={link.href} label={link.label} context={project.name} /></li>
				{/each}
			</ul>
		{/if}
	</div>

	{#if media}
		<div
			class="mt-8 fine:sr-only lg:col-span-4 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mt-0"
		>
			{#if media.kind === 'flow'}
				<!-- No screenshot of it is public: how it works, as three ruled lines of type. -->
				<figure class="max-w-[26rem]">
					<figcaption class="text-meta text-muted">{media.caption}</figcaption>
					<ol class="mt-3 border-b border-line">
						{#each media.steps as step (step)}
							<li class="border-t border-line py-3 text-title font-semibold">{step}</li>
						{/each}
					</ol>
				</figure>
			{:else if media.kind === 'screen'}
				<!-- Phones get the tighter crop, so the text in the capture stays readable;
				     the hidden one is never fetched, being lazy and not displayed. -->
				{#each media.compact ? [media.compact, media.image] : [media.image] as shot, index (shot.src)}
					<img
						src={shot.src}
						width={shot.width}
						height={shot.height}
						alt={shot.alt}
						loading="lazy"
						decoding="async"
						class="h-auto w-full rounded-[4px] outline outline-1 outline-line {media.compact
							? index === 0
								? 'md:hidden'
								: 'hidden md:block'
							: ''}"
					/>
				{/each}
			{:else if media.kind === 'print'}
				<div class="flex gap-4">
					{#each media.frames as frame (frame.src)}
						<img
							src={frame.src}
							width={frame.width}
							height={frame.height}
							alt={frame.alt}
							loading="lazy"
							decoding="async"
							class="h-[17rem] w-auto {frame.tone === 'light'
								? 'outline outline-1 outline-line'
								: ''}"
						/>
					{/each}
				</div>
			{:else}
				<img
					src={media.image.src}
					width={media.image.width}
					height={media.image.height}
					alt={media.image.alt}
					loading="lazy"
					decoding="async"
					class="aspect-square w-full max-w-[14rem] rounded-[4px] lg:max-w-[15rem]"
				/>
			{/if}
		</div>
	{/if}
</article>
