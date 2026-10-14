// The figures of 고등학교 탐구 (components/figures/): one drawing for each exploration, in
// the page's own ink and hairlines. They are diagrams, not records: every number in them is
// a generic parameter or a placeholder, and each says 도식 in its corner.

/** Each figure is drawn in a square this many units across, scaled to fit its frame. */
export const BOX = 240;

/** The frame's inner margin, in the same units: nothing is drawn or set outside it. */
export const INSET = 18;

export type Point = readonly [x: number, y: number];

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Where a word goes: a point of the square, as percentages of the frame. The words are set
 * outside the scaled drawing so that they keep one size however large the frame is, and
 * these keep each one on its mark.
 */
export function at(x: number, y: number): { x: string; y: string } {
	return { x: `${round((x / BOX) * 100)}%`, y: `${round((y / BOX) * 100)}%` };
}

/** A path through the points, in order. */
export function through(points: readonly Point[]): string {
	return points.map(([x, y], index) => `${index ? 'L' : 'M'}${round(x)} ${round(y)}`).join('');
}

/**
 * An arrow along the points, with an open head at the last. It is one unbroken line, out
 * to one wing of the head and back over it to the other, because a dash starts again with
 * every break: drawn in, the head would come before its shaft.
 */
export function arrow(points: readonly Point[], size = 4.5): string {
	const tip = points[points.length - 1];
	const before = points[points.length - 2];
	const angle = Math.atan2(tip[1] - before[1], tip[0] - before[0]);
	const wing = (turn: number): Point => [
		tip[0] - size * Math.cos(angle + turn),
		tip[1] - size * Math.sin(angle + turn)
	];
	return through([...points, wing(0.6), tip, wing(-0.6)]);
}

/** A box, begun halfway along its top edge, so the seam of its draw-in falls on a straight. */
export function box(x: number, y: number, width: number, height: number): string {
	const [left, top, right, bottom] = [x, y, x + width, y + height].map(round);
	return `M${round(x + width / 2)} ${top}H${right}V${bottom}H${left}V${top}Z`;
}

/**
 * A line that draws itself in from its start once its figure comes into view, `delay` ms
 * after the figure itself (app.css, [data-reveal='draw']).
 */
export function draw(delay: number) {
	return { pathLength: 1, 'data-draw': '', style: `--draw-delay: ${delay}ms` };
}

/** A word or a mark that fades in, `delay` ms after its figure comes into view. */
export function fade(delay: number) {
	return { 'data-fade': '', style: `--draw-delay: ${delay}ms` };
}

/** A run of an equation: plain, or set small below or above the line. */
export interface Run {
	text: string;
	script?: 'sub' | 'sup';
}

/**
 * An equation written with _ for a subscript and ^ for a superscript, each taking one
 * character or a group in braces: '1/[A]_0^{n–1}'. Returns its runs, in order.
 */
export function runs(source: string): Run[] {
	const parts: Run[] = [];
	const pattern = /([_^])(?:\{([^}]*)\}|(.))/g;
	let last = 0;
	for (const match of source.matchAll(pattern)) {
		if (match.index > last) parts.push({ text: source.slice(last, match.index) });
		parts.push({ text: match[2] ?? match[3], script: match[1] === '_' ? 'sub' : 'sup' });
		last = match.index + match[0].length;
	}
	if (last < source.length) parts.push({ text: source.slice(last) });
	return parts;
}

/** How small a sub- or superscript is set, and how far it sits from the line, in ems of the line. */
export const SCRIPT = { size: 0.72, sub: 0.28, sup: -0.42 };

/**
 * The shift of each run from the one before, in its own ems (an SVG tspan's dy), so that
 * every run lands on its line, `baseline` ems below the point it is set at, or just below
 * or above that line. The first run's shift replaces any dy of the text around it.
 */
export function shifts(parts: readonly Run[], baseline = 0): number[] {
	let current = 0;
	return parts.map(({ script }) => {
		const target = baseline + (script ? SCRIPT[script] : 0);
		const shift = (target - current) / (script ? SCRIPT.size : 1);
		current = target;
		return round(shift * 1000) / 1000;
	});
}

/** Generic parameters of an SIR model with births and deaths, in shares of the population. */
export interface SirParameters {
	/** Infections per contact between the susceptible and the infected (β). */
	beta: number;
	/** Recoveries per infected (γ). */
	gamma: number;
	/** Births (λ) and deaths (μ), set equal so that the population keeps its size. */
	vital: number;
	/** The infected share at the start; everyone else is susceptible. */
	infected: number;
	steps: number;
}

/**
 * The SIR model with births and deaths, stepped by Euler's method with Δt = 1: births
 * enter S, deaths leave every compartment. Returns the shares S, I and R at each step.
 */
export function sir({ beta, gamma, vital, infected, steps }: SirParameters) {
	let s = 1 - infected;
	let i = infected;
	let r = 0;
	const series = { s: [s], i: [i], r: [r] };
	for (let step = 0; step < steps; step++) {
		const infections = beta * s * i;
		const recoveries = gamma * i;
		[s, i, r] = [
			s + vital - infections - vital * s,
			i + infections - recoveries - vital * i,
			r + recoveries - vital * r
		];
		series.s.push(s);
		series.i.push(i);
		series.r.push(r);
	}
	return series;
}

/** The least-squares line through the points. */
export function fit(points: readonly Point[]): { slope: number; intercept: number } {
	const n = points.length;
	const meanX = points.reduce((sum, [x]) => sum + x, 0) / n;
	const meanY = points.reduce((sum, [, y]) => sum + y, 0) / n;
	let sxy = 0;
	let sxx = 0;
	for (const [x, y] of points) {
		sxy += (x - meanX) * (y - meanY);
		sxx += (x - meanX) ** 2;
	}
	const slope = sxy / sxx;
	return { slope, intercept: meanY - slope * meanX };
}
