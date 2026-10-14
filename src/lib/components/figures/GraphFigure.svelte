<script lang="ts">
	import Frame from './Frame.svelte';

	import { BOX, INSET, arrow, at, draw, fade, through } from '$lib/figures';

	// One function analysed the way his program does it: where the first derivative is zero
	// it has its local maximum and minimum, each with a level tangent; where the second is
	// zero, its inflection point.

	const f = (x: number) => x ** 3 - 3 * x;
	const slope = (x: number) => 3 * x ** 2 - 3;

	const domain = { min: -2.25, max: 2.25 };
	const range = { min: -3.1, max: 3.1 };
	const area = { left: INSET, right: BOX - INSET, top: 46, bottom: BOX - INSET };
	const sx = (x: number) =>
		area.left + ((x - domain.min) / (domain.max - domain.min)) * (area.right - area.left);
	const sy = (y: number) =>
		area.bottom - ((y - range.min) / (range.max - range.min)) * (area.bottom - area.top);

	// A cubic is one Bézier segment exactly: its control points follow from the ends and the
	// slopes there.
	const [a, b] = [-2.1, 2.1];
	const third = (b - a) / 3;
	const point = (x: number, y: number) => `${sx(x).toFixed(2)} ${sy(y).toFixed(2)}`;
	const graph =
		`M${point(a, f(a))}` +
		`C${point(a + third, f(a) + third * slope(a))} ` +
		`${point(b - third, f(b) - third * slope(b))} ${point(b, f(b))}`;

	const origin = { x: sx(0), y: sy(0) };
	const maximum = { x: sx(-1), y: sy(f(-1)) };
	const minimum = { x: sx(1), y: sy(f(1)) };
	const tangent = (point: { x: number; y: number }) =>
		through([
			[point.x - 20, point.y],
			[point.x + 20, point.y]
		]);
</script>

<Frame
	title="f(x) = x³ – 3x"
	label="f(x) = x³ − 3x 그래프 도식. f′(x) = 0인 x = −1에서 극대, x = 1에서 극소이며 두 점에는 수평인 접선이 그어져 있고, f″(x) = 0인 원점이 변곡점입니다."
>
	{#snippet art()}
		<g class="text-muted">
			<path
				d={arrow(
					[
						[area.left, origin.y],
						[area.right, origin.y]
					],
					4
				)}
				{...draw(0)}
			/>
			<path
				d={arrow(
					[
						[origin.x, area.bottom],
						[origin.x, area.top]
					],
					4
				)}
				{...draw(80)}
			/>
			<path d={tangent(maximum)} {...draw(900)} />
			<path d={tangent(minimum)} {...draw(980)} />
		</g>
		<path d={graph} class="figure-plot" {...draw(260)} />
		<circle cx={maximum.x} cy={maximum.y} r="2.6" class="fill-current" {...fade(1000)} />
		<circle cx={minimum.x} cy={minimum.y} r="2.6" class="fill-current" {...fade(1080)} />
		<circle cx={origin.x} cy={origin.y} r="2.6" class="fill-paper" {...fade(1160)} />
	{/snippet}

	{#snippet words()}
		<g class="text-muted">
			<text {...at(area.right, origin.y)} dy="1.3em" text-anchor="end" {...fade(420)}>x</text>
			<text {...at(origin.x, area.top)} dx="0.55em" dy="0.5em" {...fade(500)}>y</text>
			<text {...at(origin.x, origin.y)} dx="-0.45em" dy="1.2em" text-anchor="end" {...fade(300)}
				>O</text
			>
		</g>
		<text {...at(maximum.x, maximum.y)} dy="-0.75em" text-anchor="middle" {...fade(1100)}
			>극대 <tspan class="text-muted">f′=0</tspan></text
		>
		<text {...at(minimum.x, minimum.y)} dy="1.45em" text-anchor="middle" {...fade(1180)}
			>극소 <tspan class="text-muted">f′=0</tspan></text
		>
		<text {...at(origin.x, origin.y)} dx="0.6em" dy="-0.55em" {...fade(1260)}
			>변곡점 <tspan class="text-muted">f″=0</tspan></text
		>
	{/snippet}
</Frame>
