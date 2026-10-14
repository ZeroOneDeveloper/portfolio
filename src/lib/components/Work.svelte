<script lang="ts">
	import AxitRow from './AxitRow.svelte';
	import Dots from './Dots.svelte';
	import ProjectPreview from './ProjectPreview.svelte';
	import ProjectRow from './ProjectRow.svelte';
	import Section from './Section.svelte';

	import { projectById } from '$lib/content';

	const main = ['code01', 'neulbom', 'zerocut', 'ods'].map(projectById);
	const early = ['uniquecode', 'uniquebots', 'freeai'].map(projectById);

	let index = $state<HTMLElement>();
</script>

<!--
	작업: AXIT, his lead project, then the four main projects as ruled rows; then the team
	he founded and what it ran, as a short list of text. 작업 opens right under the opening,
	on the hairline the portrait stands on.

	On a wide screen with a mouse the seven rows become one index: large names, hairlines
	between them, the details on the right. Pointing at a row sets the others back (see
	app.css) and floats its picture beside the pointer; reaching one of its links from the
	keyboard shows the picture beside the name.
-->
<Section id="projects" first>
	<div class="pb-12 sm:pb-14 lg:pb-16"><AxitRow /></div>

	<div bind:this={index} class="work-index">
		<ol class="divide-y divide-line border-t border-line fine:border-b">
			{#each main as project (project.id)}
				<li data-reveal="rise"><ProjectRow {project} /></li>
			{/each}
		</ol>

		<div
			class="mt-8 border-t border-line pt-12 fine:mt-16 fine:border-t-0 fine:pt-0 sm:pt-14 lg:pt-16"
		>
			<h3 class="text-small font-semibold" data-reveal="rise">
				<Dots items={['2020–2022', 'UniqueCode와 디스코드 봇']} />
			</h3>
			<ul
				class="mt-6 divide-y divide-line fine:mt-4 fine:border-y fine:border-line lg:mt-8 [&>li:first-child>article]:pt-0 fine:[&>li:first-child>article]:pt-8"
			>
				{#each early as project (project.id)}
					<li data-reveal="rise"><ProjectRow {project} kind="early" level={4} /></li>
				{/each}
			</ul>
		</div>
	</div>

	<ProjectPreview list={index} projects={[...main, ...early]} />
</Section>
