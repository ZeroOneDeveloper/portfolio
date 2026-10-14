<script lang="ts">
	import Frame from './Frame.svelte';

	import { BOX, INSET, SCRIPT, at, draw, fade, fit, runs, shifts, through } from '$lib/figures';
	import type { Point } from '$lib/figures';

	// The rate law, then what separating its variables and integrating gives for a zero-,
	// first- and n-th-order reaction; below, the straight line a regression fits, whose R²
	// tells the orders apart. The points are placeholders.

	/** Where the equations start, right of their labels, in ems. */
	const INDENT = 3.4;
	/** From a row's centre line down to its baseline, in ems. */
	const CENTRE = 0.36;

	const lines = [
		{ label: '속도식', source: '–d[A]/dt = k[A]^n', y: 53 },
		{ label: '0차', source: '[A] = [A]_0 – kt', y: 89 },
		{ label: '1차', source: 'ln[A] = ln[A]_0 – kt', y: 109 },
		{ label: 'n차', source: '1/[A]^{n–1} = 1/[A]_0^{n–1} + (n–1)kt', y: 129 }
	];
	const RULE = 71;

	// The plot of the fit: placeholder points around a falling line, and the least-squares
	// line through them.
	const plot = { left: INSET, right: 146, top: 164, bottom: 206 };
	const scatter: Point[] = [
		[28, 2],
		[42, -2.5],
		[56, 1.5],
		[70, -1],
		[84, 2.5],
		[98, -2],
		[112, 1],
		[126, -1.5]
	].map(([x, noise]) => [x, 172 + (x - 28) * 0.24 + noise]);
	const { slope, intercept } = fit(scatter);
	const regression: Point[] = [24, 136].map((x) => [x, slope * x + intercept]);
</script>

<!-- An equation as runs of text, its sub- and superscripts set small below and above the line. -->
{#snippet equation(source: string, baseline: number)}
	{@const parts = runs(source)}
	{@const dy = shifts(parts, baseline)}
	{#each parts as part, index (index)}<tspan
			dy="{dy[index]}em"
			font-size={part.script ? `${SCRIPT.size}em` : undefined}>{part.text}</tspan
		>{/each}
{/snippet}

<Frame
	title="적분 속도식과 반응차수"
	label="적분 속도식 도식. 반응 속도식 −d[A]/dt = k[A]ⁿ의 변수를 분리해 적분한 식이 차수별로 적혀 있습니다. 0차는 [A] = [A]₀ − kt, 1차는 ln[A] = ln[A]₀ − kt, n차(n ≠ 1)는 1/[A]ⁿ⁻¹ = 1/[A]₀ⁿ⁻¹ + (n − 1)kt입니다. 아래에는 점들에 맞춘 회귀 직선과, 반응차수를 찾는 기준인 R²가 있습니다."
>
	{#snippet art()}
		<path
			d={through([
				[INSET, RULE],
				[BOX - INSET, RULE]
			])}
			class="text-line"
			{...draw(120)}
		/>

		<path
			d={through([
				[plot.left, plot.top],
				[plot.left, plot.bottom],
				[plot.right, plot.bottom]
			])}
			class="text-muted"
			{...draw(420)}
		/>
		<path d={through(regression)} class="figure-plot" {...draw(900)} />
		{#each scatter as [x, y], index (x)}
			<circle cx={x} cy={y} r="2.4" class="fill-paper" {...fade(620 + index * 50)} />
		{/each}
	{/snippet}

	{#snippet words()}
		{#each lines as line, index (line.label)}
			<text {...at(INSET, line.y)} dy="{CENTRE}em" class="text-muted" {...fade(index * 120)}
				>{line.label}</text
			>
			<text {...at(INSET, line.y)} dx="{INDENT}em" {...fade(60 + index * 120)}
				>{@render equation(line.source, CENTRE)}</text
			>
		{/each}
		<text {...at(INSET, lines[3].y)} dy="{CENTRE + 1.3}em" class="text-muted" {...fade(420)}
			>n≠1</text
		>

		<text
			{...at(plot.right, plot.bottom)}
			dy="1.25em"
			text-anchor="end"
			class="text-muted"
			{...fade(800)}>t</text
		>
		<text {...at(plot.right + 12, 182)} class="font-semibold" {...fade(1300)}
			>{@render equation('R^2', 0)}</text
		>
		<text {...at(plot.right + 12, 182)} dy="1.4em" class="text-muted" {...fade(1360)}
			>선형 회귀</text
		>
	{/snippet}
</Frame>
