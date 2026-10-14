<script lang="ts">
	import ArrowLink from './ArrowLink.svelte';
	import AxitRow from './AxitRow.svelte';
	import Dots from './Dots.svelte';
	import ProjectRow from './ProjectRow.svelte';
	import Section from './Section.svelte';

	import { projectById } from '$lib/content';

	const main = ['code01', 'neulbom', 'zerocut', 'ods'].map(projectById);
	const early = ['uniquecode', 'uniquebots', 'freeai'].map(projectById);
</script>

<!--
	작업: AXIT, his lead project, then the four main projects as ruled rows; then the team
	he founded and what it ran, as a short list of text.
-->
<Section id="projects">
	<ol class="divide-y divide-line">
		<li class="pb-12 sm:pb-14 lg:pb-16"><AxitRow /></li>
		{#each main as project (project.id)}
			<li class="py-12 sm:py-14 lg:py-16"><ProjectRow {project} /></li>
		{/each}
	</ol>

	<div class="mt-8 border-t border-line pt-12 sm:pt-14 lg:pt-16">
		<h3 class="text-small font-semibold">
			<Dots items={['2020–2022', 'UniqueCode와 디스코드 봇']} />
		</h3>
		<ul class="mt-6 divide-y divide-line lg:mt-8">
			{#each early as project (project.id)}
				<li
					id={project.id}
					class="grid gap-y-1.5 py-5 first:pt-0 lg:grid-cols-9 lg:items-baseline lg:gap-x-6"
				>
					<div class="lg:col-span-3">
						<h4 class="text-title font-semibold">{project.name}</h4>
						<p class="text-small text-muted"><Dots items={[project.year, project.role]} /></p>
					</div>
					<div class="lg:col-span-4">
						<p class="text-small text-soft">{project.summary}</p>
						<p class="mt-1 text-meta text-muted">
							<span class="sr-only">기술 스택:</span>
							<Dots items={project.stack.split(' · ')} />
						</p>
					</div>
					{#if project.links.length}
						<ul
							class="mt-1 flex gap-x-6 text-small font-semibold lg:col-span-2 lg:mt-0 lg:justify-end"
						>
							{#each project.links as link (link.href)}
								<li><ArrowLink href={link.href} label={link.label} context={project.name} /></li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</Section>
