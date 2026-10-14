<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import Dots from './Dots.svelte';
	import Glued from './Glued.svelte';

	import type { Project } from '$lib/content';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();

	const media = $derived(project.media);
</script>

<!--
	One main project: the words on the left, its picture on the right, from lg on the same
	line as the opening portrait. Pictures are shown as they are, without frames; only a
	light one, which would melt into the page, keeps a hairline edge.
-->
<article
	id={project.id}
	aria-labelledby="{project.id}-title"
	class="grid gap-y-8 lg:grid-cols-9 lg:gap-x-6"
>
	<div class="lg:col-span-5">
		<h3 id="{project.id}-title" class="text-project font-bold">{project.name}</h3>
		<p class="mt-2 text-small text-muted"><Dots items={[project.year, project.role]} /></p>
		<p class="mt-5 max-w-measure text-body text-soft"><Glued text={project.summary} /></p>
		<p class="mt-5 text-meta text-muted">
			<span class="sr-only">기술 스택:</span>
			<Dots items={project.stack.split(' · ')} />
		</p>
		{#if project.links.length}
			<ul class="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-small font-semibold">
				{#each project.links as link (link.href)}
					<li><ArrowLink href={link.href} label={link.label} context={project.name} /></li>
				{/each}
			</ul>
		{/if}
	</div>

	{#if media}
		<div class="lg:col-span-4">
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
