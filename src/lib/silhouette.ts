// Where the person in the portrait is, read from the picture itself, so the field of 0s
// and 1s can run through the photo's white background and stop at his outline.
//
// The picture is drawn small, exactly as the page shows it (its object-fit and
// object-position included), into a grid of samples. Near-white samples connected to the
// edge are background: a flood from the border, so a bright patch of skin or a glint on
// the zip, enclosed by the person, stays part of him. The rest is the person, and a
// distance transform gives, for every sample, how far the nearest part of him is.

/** CSS px per sample. Finer than a glyph cell by far, coarse enough to be quick. */
const SAMPLE = 2;
/** Luminance above which a sample counts as the white backdrop. */
const WHITE = 245;
/** Squared distance standing for "no person in reach". */
const FAR = 1e20;

export interface Silhouette {
	/**
	 * Distance in CSS px from a point, relative to the picture's box, to the nearest part of
	 * the person. Infinity farther away than the reach it was traced with.
	 */
	distance(x: number, y: number): number;
	/** The middle of the head, relative to the box. */
	head: { x: number; y: number };
}

/**
 * Trace the person in `image`, shown in a box of `width` × `height` CSS px. Distances are
 * known up to `reach` around the box. Without readable pixels (not loaded yet, or from
 * another origin) the whole box counts as the person.
 */
export function traceSilhouette(
	image: HTMLImageElement,
	width: number,
	height: number,
	reach: number
): Silhouette {
	const box = boxSilhouette(width, height);
	const naturalWidth = image.naturalWidth;
	const naturalHeight = image.naturalHeight;
	if (!image.complete || !naturalWidth || !naturalHeight || !width || !height) return box;

	// The picture as the page shows it, drawn over white (so transparency reads as backdrop).
	const cols = Math.ceil(width / SAMPLE);
	const rows = Math.ceil(height / SAMPLE);
	const canvas = document.createElement('canvas');
	canvas.width = cols;
	canvas.height = rows;
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) return box;
	const placed = placeImage(image, width, height, naturalWidth, naturalHeight);
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, cols, rows);
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(
		image,
		placed.x / SAMPLE,
		placed.y / SAMPLE,
		placed.width / SAMPLE,
		placed.height / SAMPLE
	);
	let pixels: Uint8ClampedArray;
	try {
		pixels = ctx.getImageData(0, 0, cols, rows).data;
	} catch {
		return box;
	}

	// The grid: the box and a margin of backdrop around it, as wide as the reach.
	const pad = Math.ceil(reach / SAMPLE);
	const w = cols + 2 * pad;
	const h = rows + 2 * pad;
	const white = new Uint8Array(w * h).fill(1);
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			const at = (y * cols + x) * 4;
			const lum = 0.2126 * pixels[at] + 0.7152 * pixels[at + 1] + 0.0722 * pixels[at + 2];
			white[(y + pad) * w + x + pad] = lum > WHITE ? 1 : 0;
		}
	}

	// Backdrop: white samples reached from the margin, which is all white and connected.
	const backdrop = new Uint8Array(w * h);
	const stack = new Int32Array(w * h);
	let top = 0;
	const visit = (i: number) => {
		if (white[i] && !backdrop[i]) {
			backdrop[i] = 1;
			stack[top++] = i;
		}
	};
	visit(0);
	while (top > 0) {
		const i = stack[--top];
		const x = i % w;
		if (x > 0) visit(i - 1);
		if (x < w - 1) visit(i + 1);
		if (i >= w) visit(i - w);
		if (i < w * (h - 1)) visit(i + w);
	}

	// Squared distance, in samples, from every sample to the nearest one of the person.
	const field = new Float64Array(w * h);
	let found = false;
	let headTop = -1;
	let personBottom = -1;
	for (let i = 0; i < w * h; i++) {
		if (backdrop[i]) {
			field[i] = FAR;
		} else {
			found = true;
			const y = Math.floor(i / w);
			if (headTop < 0) headTop = y;
			personBottom = y;
		}
	}
	if (!found) {
		return { distance: () => Infinity, head: { x: width / 2, y: height / 3 } };
	}
	distanceTransform(field, w, h);

	// The head: the middle of the person across the rows just under the top of the hair.
	let sum = 0;
	let count = 0;
	const headRows = Math.max(1, Math.round((personBottom - headTop) * 0.18));
	for (let y = headTop; y < headTop + headRows; y++) {
		for (let x = 0; x < w; x++) {
			if (!backdrop[y * w + x]) {
				sum += x;
				count++;
			}
		}
	}
	const head = {
		x: ((count ? sum / count : w / 2) - pad) * SAMPLE,
		y: (headTop - pad + headRows) * SAMPLE
	};

	return {
		head,
		distance(x, y) {
			const col = Math.floor(x / SAMPLE) + pad;
			const row = Math.floor(y / SAMPLE) + pad;
			if (col < 0 || row < 0 || col >= w || row >= h) return Infinity;
			const d2 = field[row * w + col];
			return d2 >= FAR ? Infinity : Math.sqrt(d2) * SAMPLE;
		}
	};
}

/** Before the pixels can be read: the whole box is the person. */
function boxSilhouette(width: number, height: number): Silhouette {
	return {
		head: { x: width / 2, y: height / 3 },
		distance(x, y) {
			const dx = Math.max(0 - x, 0, x - width);
			const dy = Math.max(0 - y, 0, y - height);
			return Math.hypot(dx, dy);
		}
	};
}

/** Where the picture lands in its box, in CSS px, by its object-fit and object-position. */
function placeImage(
	image: HTMLImageElement,
	width: number,
	height: number,
	naturalWidth: number,
	naturalHeight: number
): { x: number; y: number; width: number; height: number } {
	const style = getComputedStyle(image);
	let w = width;
	let h = height;
	const cover = Math.max(width / naturalWidth, height / naturalHeight);
	const contain = Math.min(width / naturalWidth, height / naturalHeight);
	switch (style.objectFit) {
		case 'cover':
			w = naturalWidth * cover;
			h = naturalHeight * cover;
			break;
		case 'contain':
			w = naturalWidth * contain;
			h = naturalHeight * contain;
			break;
		case 'scale-down':
			w = naturalWidth * Math.min(1, contain);
			h = naturalHeight * Math.min(1, contain);
			break;
		case 'none':
			w = naturalWidth;
			h = naturalHeight;
			break;
	}
	const [px = '50%', py = '50%'] = style.objectPosition.split(/\s+/);
	return { x: offset(px, width - w), y: offset(py, height - h), width: w, height: h };
}

/** One computed object-position coordinate (a percentage or a length) as an offset. */
function offset(value: string, free: number): number {
	if (value.endsWith('%')) return (free * parseFloat(value)) / 100;
	const length = parseFloat(value);
	return Number.isFinite(length) ? length : free / 2;
}

/**
 * Exact squared Euclidean distance transform (Felzenszwalb and Huttenlocher), in place:
 * zeros are the person, FAR is everything else.
 */
function distanceTransform(grid: Float64Array, w: number, h: number): void {
	const n = Math.max(w, h);
	const f = new Float64Array(n);
	const d = new Float64Array(n);
	const v = new Int32Array(n);
	const z = new Float64Array(n + 1);
	for (let x = 0; x < w; x++) {
		for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
		lowerEnvelope(f, d, v, z, h);
		for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
	}
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
		lowerEnvelope(f, d, v, z, w);
		for (let x = 0; x < w; x++) grid[y * w + x] = d[x];
	}
}

/** One dimension of the transform: the lower envelope of parabolas rooted at f. */
function lowerEnvelope(
	f: Float64Array,
	d: Float64Array,
	v: Int32Array,
	z: Float64Array,
	n: number
): void {
	let k = 0;
	v[0] = 0;
	z[0] = -FAR;
	z[1] = FAR;
	for (let q = 1; q < n; q++) {
		let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
		while (s <= z[k]) {
			k--;
			s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
		}
		k++;
		v[k] = q;
		z[k] = s;
		z[k + 1] = FAR;
	}
	k = 0;
	for (let q = 0; q < n; q++) {
		while (z[k + 1] < q) k++;
		const r = q - v[k];
		d[q] = r * r + f[v[k]];
	}
}
