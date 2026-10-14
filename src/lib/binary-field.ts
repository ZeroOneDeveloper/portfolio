// The field of 0s and 1s behind the opening: a fine grid of tiny glyphs on a canvas.
//
// This module only simulates and draws. BinaryField.svelte measures the page, tells the
// engine where glyphs may appear (their presence: 0 under text and on the person, 1 in
// open space, soft in between) and drives the clock.
//
// Every glyph is a bit with a heat. At rest the glyphs are barely there and now and then
// one flips, with a brief flash. Near the pointer they heat up: darker, a little larger,
// flipping faster, and they cool slowly once it has passed, which leaves a trail. A ripple
// (a tap, or the field coming on) is a ring that flips every bit it crosses.
//
// It is cheap when nothing happens: only cells that are changing are visited and redrawn,
// from a sprite sheet, and nothing is allocated per frame.

/** Lengths are in CSS pixels. */
export interface FieldTuning {
	/** Distance between glyph centres. */
	pitch: number;
	/** Size of a glyph at rest. */
	glyph: number;
	/** How far the pointer's influence reaches. */
	radius: number;
	/** Opacity of the ink at rest, and at the pointer's centre. */
	rest: number;
	peak: number;
	/** Colour the glyphs are drawn in, as CSS. */
	ink: string;
	/** Font family, as CSS. */
	font: string;
}

/** A ring spreading from a point; it flips the bits its front crosses. */
interface Ripple {
	x: number;
	y: number;
	start: number;
	/** Front radius at the last step. */
	radius: number;
	speed: number;
	width: number;
	amp: number;
	reach: number;
}

export interface RippleOptions {
	/** Pixels per second. */
	speed: number;
	/** Width of the band behind the front that warms up. */
	width: number;
	/** Heat at the front, 0 to 1. */
	amp: number;
	/** Distance at which the ring has faded out. */
	reach: number;
}

/** Glyph sizes pre-rendered between rest (1) and MAX_SCALE, at the pointer's centre. */
const SCALE_STEPS = 6;
const MAX_SCALE = 1.28;
/** Opacity resolution: a cell is redrawn only when its look changes by a step. */
const ALPHA_STEPS = 96;
/** Share of the glyphs that flip each second at rest. */
const AMBIENT_RATE = 0.004;
/** Flips per second at the pointer's centre. */
const HOT_RATE = 7;
/** How much a flip at rest darkens its glyph, as a share of the pointer's darkening. */
const FLASH = 0.32;
/** Time constants, in seconds: warming up, cooling down, a flash fading. */
const WARM = 0.07;
const COOL = 0.6;
const FLASH_FADE = 0.42;
/**
 * The pointer's lens follows it with this lag. When the pointer rests, the lens settles to
 * a glow, then fades out: the field answers movement, and goes quiet when there is none.
 */
const LAG = 0.06;
const SETTLE_AFTER = 2600;
const SETTLED = 0.35;
const FADE_AFTER = 10000;
/** Weight of the glyphs. */
const WEIGHT = 500;

export class BinaryFieldEngine {
	readonly #canvas: HTMLCanvasElement;
	readonly #ctx: CanvasRenderingContext2D;
	#tuning: FieldTuning;

	// Size, in CSS px, and device pixels per CSS px.
	#width = 0;
	#height = 0;
	#dpr = 1;

	// The grid: centre of the first cell, counts, and each column's and row's origin in
	// device pixels.
	#x0 = 0;
	#y0 = 0;
	#cols = 0;
	#rows = 0;
	#cellX = new Int32Array(0);
	#cellY = new Int32Array(0);
	/** A cell's size in device pixels: one tile of the sprite sheet. */
	#tile = 0;

	// Per cell.
	#bits = new Uint8Array(0);
	#heat = new Float32Array(0);
	#flash = new Float32Array(0);
	/** Heat the pointer or a ripple asks of the cell this step; read and reset by step(). */
	#target = new Float32Array(0);
	#presence = new Float32Array(0);
	/** What the cell shows now, as a key (see #key); 0 when empty. */
	#drawn = new Int32Array(0);

	/** Cells that are changing, and a flag for membership. */
	#active = new Int32Array(0);
	#activeCount = 0;
	#isActive = new Uint8Array(0);
	/** Cells with any presence: where flips at rest may land. */
	#live = new Int32Array(0);
	#liveCount = 0;

	#sprites: HTMLCanvasElement | null = null;

	#pointer = { x: 0, y: 0, sx: 0, sy: 0, inside: false, moved: 0, energy: 0 };
	#ripples: Ripple[] = [];
	/** The field coming on: a ring from `origin` before which no glyph is shown yet. */
	#boot: Ripple | null = null;

	#seed = 0x2545f491;
	#flipCredit = 0;
	#last = 0;

	constructor(canvas: HTMLCanvasElement, tuning: FieldTuning) {
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('2D canvas unavailable');
		this.#canvas = canvas;
		this.#ctx = ctx;
		this.#tuning = tuning;
	}

	get width(): number {
		return this.#width;
	}

	get height(): number {
		return this.#height;
	}

	/** Whether the pointer or a ripple is at work: then every frame counts. */
	get lively(): boolean {
		return this.#pointer.energy > 0.01 || this.#ripples.length > 0 || this.#boot !== null;
	}

	/**
	 * Fit the canvas and the grid to a size in CSS px. Bits survive when the grid keeps its
	 * shape. Call setPresence() afterwards: it draws.
	 */
	resize(width: number, height: number, dpr: number, tuning: FieldTuning): void {
		const sameSprites =
			this.#sprites !== null &&
			dpr === this.#dpr &&
			tuning.pitch === this.#tuning.pitch &&
			tuning.glyph === this.#tuning.glyph &&
			tuning.ink === this.#tuning.ink &&
			tuning.font === this.#tuning.font;

		this.#tuning = tuning;
		this.#width = width;
		this.#height = height;
		this.#dpr = dpr;
		this.#canvas.width = Math.max(1, Math.round(width * dpr));
		this.#canvas.height = Math.max(1, Math.round(height * dpr));

		const { pitch } = tuning;
		const cols = Math.max(0, Math.floor(width / pitch));
		const rows = Math.max(0, Math.floor(height / pitch));
		this.#x0 = (width - cols * pitch) / 2 + pitch / 2;
		this.#y0 = (height - rows * pitch) / 2 + pitch / 2;
		this.#tile = Math.ceil(pitch * dpr);
		this.#cellX = Int32Array.from({ length: cols }, (_, c) =>
			Math.round((this.#x0 + c * pitch - pitch / 2) * dpr)
		);
		this.#cellY = Int32Array.from({ length: rows }, (_, r) =>
			Math.round((this.#y0 + r * pitch - pitch / 2) * dpr)
		);

		const count = cols * rows;
		if (cols !== this.#cols || rows !== this.#rows) {
			this.#cols = cols;
			this.#rows = rows;
			this.#bits = new Uint8Array(count);
			for (let i = 0; i < count; i++) this.#bits[i] = this.#random() < 0.5 ? 1 : 0;
			this.#heat = new Float32Array(count);
			this.#flash = new Float32Array(count);
			this.#target = new Float32Array(count);
			this.#presence = new Float32Array(count);
			this.#drawn = new Int32Array(count);
			this.#active = new Int32Array(count);
			this.#isActive = new Uint8Array(count);
			this.#live = new Int32Array(count);
			this.#activeCount = 0;
			this.#liveCount = 0;
		}

		if (!sameSprites) this.#paintSprites();
	}

	/** Re-render the glyph sprites, for when the font has arrived. Then draw again. */
	refreshSprites(): void {
		this.#paintSprites();
		this.drawAll();
	}

	/** Where glyphs may appear, from 0 to 1, by the centre of each cell. Draws everything. */
	setPresence(presenceAt: (x: number, y: number) => number): void {
		const { pitch } = this.#tuning;
		let live = 0;
		for (let r = 0, i = 0; r < this.#rows; r++) {
			const y = this.#y0 + r * pitch;
			for (let c = 0; c < this.#cols; c++, i++) {
				const p = presenceAt(this.#x0 + c * pitch, y);
				const value = p > 0.01 ? Math.min(1, p) : 0;
				this.#presence[i] = value;
				if (value > 0) this.#live[live++] = i;
			}
		}
		this.#liveCount = live;
		this.drawAll();
	}

	/** Forget all heat, flashes and ripples, and show the field at rest. */
	calm(): void {
		this.#heat.fill(0);
		this.#flash.fill(0);
		this.#target.fill(0);
		this.#isActive.fill(0);
		this.#activeCount = 0;
		this.#ripples.length = 0;
		this.#boot = null;
		this.#pointer.inside = false;
		this.#pointer.energy = 0;
		this.drawAll();
	}

	/** Draw every cell as it stands. */
	drawAll(): void {
		const ctx = this.#ctx;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.globalAlpha = 1;
		ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
		const count = this.#cols * this.#rows;
		for (let i = 0; i < count; i++) {
			const key = this.#key(i);
			this.#drawn[i] = key;
			if (key !== 0) this.#paint(i, key, false);
		}
	}

	/** The pointer is at (x, y) in CSS px, relative to the canvas. */
	pointerAt(x: number, y: number): void {
		const p = this.#pointer;
		if (!p.inside) {
			p.sx = x;
			p.sy = y;
		}
		p.x = x;
		p.y = y;
		p.inside = true;
	}

	/** The pointer has just moved: it is not resting. */
	pointerMoved(now: number): void {
		this.#pointer.moved = now;
	}

	pointerLeft(): void {
		this.#pointer.inside = false;
	}

	ripple(x: number, y: number, now: number, options: RippleOptions): void {
		if (this.#ripples.length >= 4) this.#ripples.shift();
		this.#ripples.push({ x, y, start: now, radius: 0, ...options });
	}

	/** Bring the field on with a ring from (x, y): no glyph shows before the ring reaches it. */
	boot(x: number, y: number, now: number, options: Omit<RippleOptions, 'reach'>): void {
		const reach = Math.max(
			Math.hypot(x, y),
			Math.hypot(this.#width - x, y),
			Math.hypot(x, this.#height - y),
			Math.hypot(this.#width - x, this.#height - y)
		);
		this.#boot = { x, y, start: now, radius: 0, reach, ...options };
		this.drawAll();
	}

	/** Skip the rest of the boot: every glyph shows at once. */
	finishBoot(): void {
		if (!this.#boot) return;
		this.#boot = null;
		this.drawAll();
	}

	/** Advance to `now` (ms) and redraw what changed. */
	step(now: number): void {
		const dt = Math.min(0.05, Math.max(0, (now - this.#last) / 1000));
		this.#last = now;
		if (dt === 0 || this.#liveCount === 0) return;

		// The pointer: its lens lags a little behind it, and settles when it rests.
		const p = this.#pointer;
		const rest = now - p.moved;
		const resting = rest > SETTLE_AFTER;
		const want = !p.inside || rest > FADE_AFTER ? 0 : resting ? SETTLED : 1;
		const tau = want > p.energy ? 0.12 : resting && p.inside ? 1.2 : 0.25;
		p.energy += (want - p.energy) * (1 - Math.exp(-dt / tau));
		if (p.energy < 0.004 && !p.inside) p.energy = 0;
		const follow = 1 - Math.exp(-dt / LAG);
		p.sx += (p.x - p.sx) * follow;
		p.sy += (p.y - p.sy) * follow;
		if (p.energy > 0.01) this.#warmAround(p.sx, p.sy, p.energy);

		// Rings.
		if (this.#boot && !this.#spread(this.#boot, now)) {
			this.#boot = null;
		}
		for (let n = 0; n < this.#ripples.length; ) {
			if (this.#spread(this.#ripples[n], now)) n++;
			else this.#ripples.splice(n, 1);
		}

		// Life at rest: a few bits flip, anywhere.
		this.#flipCredit += this.#liveCount * AMBIENT_RATE * dt;
		while (this.#flipCredit >= 1) {
			this.#flipCredit -= 1;
			const i = this.#live[Math.floor(this.#random() * this.#liveCount)];
			this.#bits[i] ^= 1;
			this.#flash[i] = 1;
			this.#activate(i);
		}

		// Every changing cell eases toward its target and is redrawn if its look changed.
		const warm = 1 - Math.exp(-dt / WARM);
		const cool = 1 - Math.exp(-dt / COOL);
		const fade = Math.exp(-dt / FLASH_FADE);
		for (let n = 0; n < this.#activeCount; ) {
			const i = this.#active[n];
			const target = this.#target[i];
			this.#target[i] = 0;
			let heat = this.#heat[i];
			heat += (target - heat) * (target > heat ? warm : cool);
			if (heat < 0.004 && target === 0) heat = 0;
			this.#heat[i] = heat;
			if (heat > 0.02 && this.#random() < heat * heat * HOT_RATE * dt) this.#bits[i] ^= 1;
			let flash = this.#flash[i];
			if (flash > 0) {
				flash *= fade;
				if (flash < 0.02) flash = 0;
				this.#flash[i] = flash;
			}

			const key = this.#key(i);
			if (key !== this.#drawn[i]) {
				this.#paint(i, key, true);
				this.#drawn[i] = key;
			}

			if (heat === 0 && flash === 0 && target === 0) {
				this.#isActive[i] = 0;
				this.#active[n] = this.#active[--this.#activeCount];
			} else {
				n++;
			}
		}
	}

	// A cell's look, packed: opacity step, size step and bit; 0 when nothing shows.
	#key(i: number): number {
		let presence = this.#presence[i];
		if (presence === 0) return 0;
		const boot = this.#boot;
		if (boot) {
			const { pitch } = this.#tuning;
			const dx = this.#x0 + (i % this.#cols) * pitch - boot.x;
			const dy = this.#y0 + Math.floor(i / this.#cols) * pitch - boot.y;
			const born = (boot.radius - Math.sqrt(dx * dx + dy * dy)) / boot.width;
			if (born <= 0) return 0;
			if (born < 1) presence *= born;
		}
		const heat = this.#heat[i];
		const { rest, peak } = this.#tuning;
		const level = Math.max(heat, this.#flash[i] * FLASH);
		const alpha = Math.round(presence * (rest + (peak - rest) * level) * ALPHA_STEPS);
		if (alpha <= 0) return 0;
		const size = Math.round(heat * (SCALE_STEPS - 1));
		return (alpha << 4) | (size << 1) | this.#bits[i];
	}

	#paint(i: number, key: number, clear: boolean): void {
		const ctx = this.#ctx;
		const tile = this.#tile;
		const x = this.#cellX[i % this.#cols];
		const y = this.#cellY[Math.floor(i / this.#cols)];
		if (clear) ctx.clearRect(x, y, tile, tile);
		if (key === 0 || !this.#sprites) return;
		ctx.globalAlpha = (key >> 4) / ALPHA_STEPS;
		const size = (key >> 1) & 7;
		const bit = key & 1;
		ctx.drawImage(this.#sprites, size * tile, bit * tile, tile, tile, x, y, tile, tile);
	}

	// One tile per glyph and size, in device pixels, centred on the digit's own ink.
	#paintSprites(): void {
		const tile = this.#tile;
		if (tile === 0) return;
		const sprites = this.#sprites ?? document.createElement('canvas');
		sprites.width = tile * SCALE_STEPS;
		sprites.height = tile * 2;
		const ctx = sprites.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, sprites.width, sprites.height);
		ctx.fillStyle = this.#tuning.ink;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'alphabetic';
		for (let size = 0; size < SCALE_STEPS; size++) {
			const scale = 1 + ((MAX_SCALE - 1) * size) / (SCALE_STEPS - 1);
			ctx.font = `${WEIGHT} ${this.#tuning.glyph * scale * this.#dpr}px ${this.#tuning.font}`;
			for (let bit = 0; bit < 2; bit++) {
				const glyph = bit ? '1' : '0';
				const m = ctx.measureText(glyph);
				const lift = (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
				ctx.fillText(glyph, size * tile + tile / 2, bit * tile + tile / 2 + lift);
			}
		}
		this.#sprites = sprites;
	}

	#activate(i: number): void {
		if (this.#isActive[i]) return;
		this.#isActive[i] = 1;
		this.#active[this.#activeCount++] = i;
	}

	// Warm the cells around (x, y): full at the centre, nothing at the radius.
	#warmAround(x: number, y: number, energy: number): void {
		const { pitch, radius } = this.#tuning;
		const reach2 = radius * radius;
		const c0 = Math.max(0, Math.ceil((x - radius - this.#x0) / pitch));
		const c1 = Math.min(this.#cols - 1, Math.floor((x + radius - this.#x0) / pitch));
		const r0 = Math.max(0, Math.ceil((y - radius - this.#y0) / pitch));
		const r1 = Math.min(this.#rows - 1, Math.floor((y + radius - this.#y0) / pitch));
		for (let r = r0; r <= r1; r++) {
			const dy = this.#y0 + r * pitch - y;
			for (let c = c0; c <= c1; c++) {
				const dx = this.#x0 + c * pitch - x;
				const d2 = dx * dx + dy * dy;
				if (d2 >= reach2) continue;
				const i = r * this.#cols + c;
				if (this.#presence[i] === 0) continue;
				const u = 1 - d2 / reach2;
				const want = u * u * energy;
				if (want > this.#target[i]) this.#target[i] = want;
				this.#activate(i);
			}
		}
	}

	// Move a ring to `now`: warm its band and flip what its front crossed. False when done.
	#spread(ring: Ripple, now: number): boolean {
		const radius = ((now - ring.start) / 1000) * ring.speed;
		const previous = ring.radius;
		ring.radius = radius;
		if (radius - ring.width > ring.reach) return false;

		const { pitch } = this.#tuning;
		const outer = Math.min(radius, ring.reach);
		const inner = Math.max(0, radius - ring.width);
		const outer2 = outer * outer;
		const inner2 = inner * inner;
		const c0 = Math.max(0, Math.ceil((ring.x - outer - this.#x0) / pitch));
		const c1 = Math.min(this.#cols - 1, Math.floor((ring.x + outer - this.#x0) / pitch));
		const r0 = Math.max(0, Math.ceil((ring.y - outer - this.#y0) / pitch));
		const r1 = Math.min(this.#rows - 1, Math.floor((ring.y + outer - this.#y0) / pitch));
		for (let r = r0; r <= r1; r++) {
			const dy = this.#y0 + r * pitch - ring.y;
			for (let c = c0; c <= c1; c++) {
				const dx = this.#x0 + c * pitch - ring.x;
				const d2 = dx * dx + dy * dy;
				if (d2 > outer2 || d2 < inner2) continue;
				const i = r * this.#cols + c;
				if (this.#presence[i] === 0) continue;
				const d = Math.sqrt(d2);
				if (d > previous) this.#bits[i] ^= 1;
				const behind = 1 - (radius - d) / ring.width;
				const want = ring.amp * behind * behind * (1 - d / ring.reach);
				if (want > this.#target[i]) this.#target[i] = want;
				this.#activate(i);
			}
		}
		return true;
	}

	// xorshift32: fast, and the same field each time for the same seed.
	#random(): number {
		let x = this.#seed | 0;
		x ^= x << 13;
		x ^= x >>> 17;
		x ^= x << 5;
		this.#seed = x;
		return (x >>> 0) / 4294967296;
	}
}

/** Parse a CSS hex or rgb() colour into its channels. */
export function parseColor(css: string): [number, number, number] | null {
	const value = css.trim();
	const hex = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(value);
	if (hex) {
		const digits = hex[1].length === 3 ? [...hex[1]].map((d) => d + d).join('') : hex[1];
		return [0, 2, 4].map((at) => parseInt(digits.slice(at, at + 2), 16)) as [
			number,
			number,
			number
		];
	}
	const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(value);
	return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : null;
}

/**
 * The opacity at which `ink` drawn over `paper` comes out as `colour`, all greys: a glyph
 * at that opacity shows exactly the colour the design names.
 */
export function inkAlpha(colour: string, paper: string, ink: string): number | null {
	const [c, p, k] = [colour, paper, ink].map(parseColor);
	if (!c || !p || !k) return null;
	const mean = (rgb: [number, number, number]) => (rgb[0] + rgb[1] + rgb[2]) / 3;
	const span = mean(p) - mean(k);
	return span > 0 ? Math.min(1, Math.max(0, (mean(p) - mean(c)) / span)) : null;
}
