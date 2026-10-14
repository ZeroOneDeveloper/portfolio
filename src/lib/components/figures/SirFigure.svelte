<script lang="ts">
	import Frame from './Frame.svelte';

	import { BOX, INSET, arrow, at, box, draw, fade, sir, through } from '$lib/figures';

	// Above: the three compartments in a row, joined by infection (β) and recovery (γ), with
	// births (λ) coming into S and deaths (μ) leaving each one. Below: what a model like his
	// does over time, stepped by Euler's method (Δt = 1) from generic parameters.

	const ROW = 66;
	const CELL = { width: 30, height: 26 };
	const compartments = [
		{ name: 'S', left: 50 },
		{ name: 'I', left: 116 },
		{ name: 'R', left: 182 }
	].map((compartment) => ({ ...compartment, middle: compartment.left + CELL.width / 2 }));
	const top = ROW - CELL.height / 2;
	const bottom = ROW + CELL.height / 2;

	/** The flows along the row: births into S, then S to I and I to R. */
	const flows = [
		{ from: INSET, to: 50, symbol: 'λ', word: '출생' },
		{ from: 80, to: 116, symbol: 'β', word: '감염' },
		{ from: 146, to: 182, symbol: 'γ', word: '회복' }
	];
	/** Where the deaths, falling out of each compartment, end. */
	const DEATHS = 116;

	const STEPS = 80;
	const run = sir({ beta: 0.5, gamma: 0.1, vital: 0.01, infected: 0.01, steps: STEPS });
	const plot = { left: INSET, right: 206, top: 130, bottom: 206 };
	const x = (step: number) => plot.left + (step / STEPS) * (plot.right - plot.left);
	const y = (share: number) => plot.bottom - share * (plot.bottom - plot.top);
	const curve = (shares: number[]) => through(shares.map((share, step) => [x(step), y(share)]));
	const peak = run.i.indexOf(Math.max(...run.i));

	const curves = [
		{ name: 'S', shares: run.s, tone: 'text-muted' },
		{ name: 'I', shares: run.i, tone: 'text-ink' },
		{ name: 'R', shares: run.r, tone: 'text-soft' }
	];
</script>

<Frame
	title="출생·사망을 더한 SIR 모델"
	label="SIR 모델 도식. 위에는 S(감수성), I(감염), R(회복) 세 칸이 감염 β와 회복 γ 화살표로 이어지고, 출생 λ가 S로 들어오며 사망 μ가 세 칸에서 각각 빠져나갑니다. 아래에는 임의의 매개변수로 계산한 S, I, R 곡선이 있습니다. I는 한 번 솟았다가 가라앉고, S는 크게 줄었다가 출생으로 조금씩 늘고, R은 늘어납니다."
>
	{#snippet art()}
		{#each compartments as compartment, index (compartment.name)}
			<path d={box(compartment.left, top, CELL.width, CELL.height)} {...draw(index * 80)} />
			<path
				d={arrow([
					[compartment.middle, bottom],
					[compartment.middle, DEATHS]
				])}
				{...draw(380 + index * 80)}
			/>
		{/each}
		{#each flows as flow, index (flow.symbol)}
			<path
				d={arrow([
					[flow.from, ROW],
					[flow.to, ROW]
				])}
				{...draw(220 + index * 100)}
			/>
		{/each}

		<path
			d={through([
				[plot.left, plot.top - 6],
				[plot.left, plot.bottom],
				[BOX - INSET, plot.bottom]
			])}
			class="text-muted"
			{...draw(320)}
		/>
		{#each curves as { name, shares, tone }, index (name)}
			<path d={curve(shares)} class="figure-plot {tone}" {...draw(520 + index * 120)} />
		{/each}
	{/snippet}

	{#snippet words()}
		{#each compartments as compartment, index (compartment.name)}
			<text
				{...at(compartment.middle, ROW)}
				dy="0.36em"
				text-anchor="middle"
				class="font-semibold"
				{...fade(260 + index * 80)}>{compartment.name}</text
			>
		{/each}
		{#each flows as flow, index (flow.symbol)}
			{@const middle = (flow.from + flow.to) / 2}
			<text {...at(middle, ROW)} dy="-0.55em" text-anchor="middle" {...fade(560 + index * 100)}
				>{flow.symbol}</text
			>
			<text
				{...at(middle, ROW)}
				dy="1.3em"
				text-anchor="middle"
				class="text-muted"
				{...fade(620 + index * 100)}>{flow.word}</text
			>
		{/each}
		{#each compartments as compartment, index (compartment.name)}
			<text
				{...at(compartment.middle, DEATHS - 12)}
				dx="0.45em"
				dy="0.36em"
				{...fade(700 + index * 80)}
				>μ{#if index === 0}<tspan dx="0.3em" class="text-muted">사망</tspan>{/if}</text
			>
		{/each}

		<text
			{...at(BOX - INSET, plot.bottom)}
			dy="1.25em"
			text-anchor="end"
			class="text-muted"
			{...fade(700)}>t</text
		>
		{#each curves as { name, shares }, index (name)}
			{#if name === 'I'}
				<text
					{...at(x(peak), y(shares[peak]))}
					dy="-0.6em"
					text-anchor="middle"
					class="font-semibold"
					{...fade(1100 + index * 120)}>{name}</text
				>
			{:else}
				<text
					{...at(x(STEPS), y(shares[STEPS]))}
					dx="0.5em"
					dy="0.36em"
					class="font-semibold"
					{...fade(1100 + index * 120)}>{name}</text
				>
			{/if}
		{/each}
	{/snippet}
</Frame>
