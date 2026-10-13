<script lang="ts">
	import Dots from './Dots.svelte';
	import Glued from './Glued.svelte';
	import Icon from './Icon.svelte';
	import WorkMedia from './WorkMedia.svelte';

	import type { Project } from '$lib/content';

	interface Props {
		project: Project;
		/** Grid placement of the card. */
		class?: string;
		/** Sizing of the media frame. */
		mediaClass?: string;
		/**
		 * From lg up, let the media frame take the card's spare height instead of the text,
		 * so a card beside a taller one still ends level with it.
		 */
		fill?: boolean;
	}

	let { project, class: className = '', mediaClass = '', fill = false }: Props = $props();
</script>

<article
	id={project.id}
	aria-labelledby="{project.id}-title"
	class="flex flex-col rounded-card border border-line bg-surface p-2 {className}"
>
	<WorkMedia {project} class="{mediaClass} {fill ? 'lg:flex-1' : ''}" />

	<div
		class="flex flex-col px-3 pb-3 pt-5 sm:px-4 sm:pb-4 {fill ? 'flex-1 lg:flex-none' : 'flex-1'}"
	>
		<p class="text-meta text-muted">
			<Dots items={[project.year, project.role]} monoFirst />
		</p>
		<h3 id="{project.id}-title" class="mt-1.5 text-card-title font-bold">{project.name}</h3>
		<p class="mb-auto mt-2 max-w-[36rem] text-small text-ink-soft">
			<Glued text={project.summary} />
		</p>

		<div
			class="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line pt-4"
		>
			<p class="mono text-micro text-muted">
				<span class="sr-only">기술 스택:</span>
				<Dots items={project.stack.split(' · ')} />
			</p>
			{#if project.links.length}
				<ul class="flex flex-wrap gap-x-4 gap-y-1">
					{#each project.links as link (link.href)}
						<li>
							<a
								href={link.href}
								class="inline-flex items-center gap-1 text-small font-semibold text-accent hover:text-accent-deep"
							>
								{link.label}
								<Icon name="arrow-up-right" class="size-3.5" />
								<span class="sr-only">({project.name})</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</article>
