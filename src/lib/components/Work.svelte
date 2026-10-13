<script lang="ts">
	import SectionHead from './SectionHead.svelte';
	import WorkCard from './WorkCard.svelte';
	import CompactWorkCard from './CompactWorkCard.svelte';

	import { projectById } from '$lib/content';

	const early = ['uniquecode', 'uniquebots', 'freeai'].map(projectById);
</script>

<section id="projects" aria-labelledby="projects-title" class="page mt-24 sm:mt-32">
	<SectionHead
		id="projects-title"
		title="대표 작업"
		lead="2020년에 창업한 팀부터 대학 수업을 위한 온라인 저지까지, 직접 만들고 운영한 서비스들입니다."
	/>

	<!-- Large cards in two mirrored rows: 7 + 5, then 4 + 8. -->
	<div class="grid gap-4 sm:gap-6 lg:grid-cols-12">
		<WorkCard project={projectById('code01')} class="lg:col-span-7" mediaClass="lg:h-[22rem]" />
		<WorkCard
			project={projectById('neulbom')}
			class="lg:col-span-5"
			mediaClass="aspect-[16/10] lg:aspect-auto lg:h-[22rem]"
		/>
		<WorkCard
			project={projectById('zerocut')}
			class="lg:col-span-4"
			mediaClass="aspect-square sm:aspect-[16/10] lg:aspect-auto lg:h-[30rem]"
		/>
		<WorkCard
			project={projectById('ods')}
			class="lg:col-span-8"
			mediaClass="aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-[30rem]"
		/>
	</div>

	<!-- The team he founded and what it ran, as smaller cards. -->
	<div class="mt-12 sm:mt-14">
		<h3 class="text-small font-semibold text-muted">
			<span class="mono">2020–2022</span> · UniqueCode와 디스코드 봇
		</h3>
		<ul class="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-6">
			{#each early as project (project.id)}
				<li><CompactWorkCard {project} /></li>
			{/each}
		</ul>
	</div>
</section>
