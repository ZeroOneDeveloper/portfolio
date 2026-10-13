<script lang="ts">
	import Icon from './Icon.svelte';

	import type { Project } from '$lib/content';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();
</script>

<article
	id={project.id}
	aria-labelledby="{project.id}-title"
	class="flex h-full flex-col rounded-card border border-line bg-surface p-4 sm:p-5"
>
	<div class="flex items-center gap-4">
		<img
			src={project.media.src}
			width={project.media.width}
			height={project.media.height}
			alt={project.media.alt}
			loading="lazy"
			decoding="async"
			class="size-14 shrink-0 rounded-xl border object-cover {project.media.tone === 'dark'
				? 'border-black bg-black'
				: 'border-line'}"
		/>
		<div class="min-w-0">
			<h4 id="{project.id}-title" class="text-item-title font-bold">{project.name}</h4>
			<p class="text-meta text-muted">
				<span class="mono">{project.year}</span>
				<span aria-hidden="true" class="px-1">·</span>
				{project.role}
			</p>
		</div>
	</div>

	<p class="mb-auto mt-4 text-small text-ink-soft">{project.summary}</p>

	<div class="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
		<p class="mono text-micro text-muted">
			<span class="sr-only">기술 스택:</span>
			{project.stack}
		</p>
		{#each project.links as link (link.href)}
			<a
				href={link.href}
				class="inline-flex items-center gap-1 text-small font-semibold text-accent hover:text-accent-deep"
			>
				{link.label}
				<Icon name="arrow-up-right" class="size-3.5" />
				<span class="sr-only">({project.name})</span>
			</a>
		{/each}
	</div>
</article>
