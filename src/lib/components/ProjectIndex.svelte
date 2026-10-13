<script lang="ts">
	import Ref from './Ref.svelte';
	import SectionOpener from './SectionOpener.svelte';
	import { hostOf, projects, sectionById } from '$lib/content';

	const section = sectionById('projects');

	// One template for the header row and every entry, so the columns stay aligned.
	const columns =
		'lg:grid-cols-[2.5rem_5.5rem_minmax(0,13rem)_minmax(0,1fr)_minmax(0,12rem)_8.5rem]';
</script>

<section id="projects" aria-labelledby="projects-title" class="page mt-24 sm:mt-28 lg:mt-32">
	<SectionOpener {section} headingId="projects-title" />

	<div class="mt-10 lg:mt-14">
		<!-- Column heads, as a printed table would set them -->
		<div
			aria-hidden="true"
			class="hidden gap-x-6 border-b border-ink pb-2 text-meta-ko font-medium text-ink-muted lg:grid {columns}"
		>
			<span class="font-mono">No.</span>
			<span>도판</span>
			<span>이름 · 연도 · 역할</span>
			<span>개요</span>
			<span>기술</span>
			<span>링크</span>
		</div>

		<ol class="border-t border-ink lg:border-t-0">
			{#each projects as project, index (project.name)}
				<li
					class="grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 border-b border-rule py-6 sm:grid-cols-[5.5rem_1fr] sm:gap-x-6 lg:items-start lg:gap-y-0 {columns}"
				>
					<p
						class="hidden pt-1 font-mono text-[0.8125rem] tabular-nums text-accent lg:block"
						aria-hidden="true"
					>
						{String(index + 1).padStart(2, '0')}
					</p>

					<!-- Plate: logo, or the name set in type when there is none -->
					{#if project.image}
						<img
							src={project.image}
							alt="{project.name} 로고"
							loading="lazy"
							width="640"
							height="640"
							class="aspect-square w-full bg-ink object-cover"
						/>
					{:else}
						<div
							class="flex aspect-square w-full items-center justify-center bg-ink px-1 text-paper"
							aria-hidden="true"
						>
							<span class="font-latin text-[0.9375rem] italic sm:text-[1.0625rem]"
								>{project.name}</span
							>
						</div>
					{/if}

					<div class="min-w-0 self-center lg:self-start">
						<h3 class="text-title font-semibold leading-snug">
							<span class="mr-1.5 font-mono text-[0.8125rem] font-normal text-accent lg:hidden"
								>{String(index + 1).padStart(2, '0')}</span
							>{project.name}
						</h3>
						<p class="mt-1 font-mono text-meta-ko text-ink-muted">{project.meta}</p>
					</div>

					<p class="col-span-2 text-note text-ink-soft lg:col-span-1">{project.summary}</p>

					<p
						class="col-span-2 font-mono text-[0.8125rem] leading-relaxed text-ink-muted lg:col-span-1 lg:pt-1"
					>
						{project.stack}
					</p>

					<p class="col-span-2 text-cite lg:col-span-1">
						{#if project.href}
							<Ref href={project.href} class="font-latin italic">{hostOf(project.href)}</Ref>
						{:else}
							<span class="text-ink-muted" aria-hidden="true">—</span><span class="sr-only"
								>공개 링크 없음</span
							>
						{/if}
					</p>
				</li>
			{/each}
		</ol>
	</div>
</section>
