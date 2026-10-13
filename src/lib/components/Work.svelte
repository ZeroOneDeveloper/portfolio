<script lang="ts">
	import SectionHead from './SectionHead.svelte';
	import WorkCard from './WorkCard.svelte';
	import CompactWorkCard from './CompactWorkCard.svelte';
	import Dots from './Dots.svelte';

	import { projectById } from '$lib/content';

	const early = ['uniquecode', 'uniquebots', 'freeai'].map(projectById);
</script>

<section id="projects" aria-labelledby="projects-title" class="page mt-20 sm:mt-28">
	<SectionHead
		id="projects-title"
		title="작업"
		lead="2020년에 창업한 팀부터 대학 수업을 위한 온라인 저지까지, 직접 만든 서비스들입니다."
	/>

	<!--
		Large cards in two mirrored rows from lg: 7 + 5, then 4 + 8. The ODS screen sets the
		height of the second row; the ZeroCut frames grow to meet it. From sm to lg, Code01
		and ODS take the full width and NeulBom and ZeroCut share a row in upright frames,
		since both pictures are square or tall.
	-->
	<div class="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12">
		<WorkCard
			project={projectById('code01')}
			class="sm:col-span-2 lg:col-span-7"
			mediaClass="lg:h-[22rem]"
		/>
		<WorkCard
			project={projectById('neulbom')}
			class="lg:col-span-5"
			mediaClass="aspect-[16/10] sm:aspect-[4/5] lg:aspect-auto lg:h-[22rem]"
		/>
		<WorkCard
			project={projectById('zerocut')}
			class="lg:col-span-4"
			mediaClass="aspect-[4/5] lg:aspect-auto lg:min-h-[24rem]"
			fill
		/>
		<WorkCard project={projectById('ods')} class="sm:col-span-2 lg:col-span-8" />
	</div>

	<!-- The team he founded and what it ran, as smaller cards. -->
	<div class="mt-12 sm:mt-14">
		<h3 class="text-small font-semibold text-ink">
			<Dots items={['2020–2022', 'UniqueCode와 디스코드 봇']} monoFirst />
		</h3>
		<!-- Two columns from sm, the third card spanning the row; three only from lg. -->
		<ul class="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
			{#each early as project, index (project.id)}
				<li class={index === early.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}>
					<CompactWorkCard {project} />
				</li>
			{/each}
		</ul>
	</div>
</section>
