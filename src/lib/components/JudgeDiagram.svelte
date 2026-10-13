<script lang="ts">
	// Code01 has no public screenshot, so its card shows how grading works, using only
	// what the project and its KIIT 2025 paper state.
	const steps = [
		{ no: '01', title: '제출', note: '학생이 코드를 제출' },
		{ no: '02', title: '채점', note: 'Docker 안의 Piston 엔진이 자동 채점' },
		{ no: '03', title: '결과', note: '결과를 실시간으로 표시' }
	];

	const stack = ['Next.js', 'FastAPI', 'PostgreSQL', 'Docker'];
</script>

<div class="flex h-full flex-col justify-between gap-6 p-5 sm:p-7">
	<p class="flex items-center gap-2.5">
		<span class="rounded-full bg-surface/90 px-2.5 py-1 text-micro font-medium text-muted"
			>도식</span
		>
		<span class="text-small font-semibold">채점 흐름</span>
	</p>

	<ol class="grid gap-2 sm:grid-cols-[1fr_auto_1.25fr_auto_1fr] sm:items-stretch sm:gap-3">
		{#each steps as step, index (step.no)}
			{#if index > 0}
				<li aria-hidden="true" class="flex items-center justify-center text-line-strong">
					<svg viewBox="0 0 24 24" class="size-5 rotate-90 sm:rotate-0" fill="none">
						<path
							d="M4 12h15m-5-5 5 5-5 5"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</li>
			{/if}
			<li
				class="rounded-xl border bg-surface px-4 py-3.5 sm:py-4 {index === 1
					? 'border-accent ring-4 ring-accent-tint'
					: 'border-line'}"
			>
				<p class="mono text-micro {index === 1 ? 'text-accent' : 'text-muted'}">{step.no}</p>
				<p class="mt-1 text-item-title font-bold">{step.title}</p>
				{#if index === 1}
					<p
						class="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-accent/50 px-2 py-0.5 text-micro text-accent"
					>
						<span class="mono">docker</span>
						<span aria-hidden="true">›</span>
						<span class="mono">piston</span>
					</p>
				{/if}
				<p class="mt-1.5 text-meta text-ink-soft">{step.note}</p>
			</li>
		{/each}
	</ol>

	<ul class="flex flex-wrap gap-1.5" aria-label="기술 스택">
		{#each stack as item (item)}
			<li class="mono rounded-md bg-surface/70 px-2 py-1 text-micro text-ink-soft">{item}</li>
		{/each}
	</ul>
</div>
