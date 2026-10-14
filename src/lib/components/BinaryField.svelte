<script lang="ts">
	import { tick } from 'svelte';

	import {
		BinaryFieldEngine,
		inkAlpha,
		type FieldTuning,
		type RippleOptions
	} from '$lib/binary-field';
	import { REDUCED_MOTION } from '$lib/media';
	import { traceSilhouette, type Silhouette } from '$lib/silhouette';

	interface Props {
		/**
		 * The portrait the field runs through: glyphs fill its near-white backdrop and stop at
		 * the person, with a little air around him.
		 */
		photo?: HTMLImageElement;
		/** What the field opens around, with a soft edge, so no glyph ever sits under text. */
		clear?: (HTMLElement | undefined)[];
	}

	let { photo, clear = [] }: Props = $props();

	/** No glyph within this many CSS px of text, then a soft edge three cells deep. */
	const TEXT_MARGIN = 8;
	/** No glyph centre within this many CSS px of the person, then a soft edge. */
	const PERSON_MARGIN = 11;
	const PERSON_FEATHER = 26;
	/** Largest backing store, in device pixels: very large screens draw a little softer. */
	const MAX_PIXELS = 8_000_000;
	/** At rest a frame this often (ms) is plenty for a few slow flips. */
	const REST_INTERVAL = 33;
	/** The field coming on, from his head outward; and a tap. */
	const BOOT = { speed: 950, width: 150, amp: 0.3 };
	const TAP: RippleOptions = { speed: 560, width: 54, amp: 0.65, reach: 300 };

	let canvas: HTMLCanvasElement;
	/** Faded in once there is something to show. */
	let shown = $state(false);

	// What the page hands over, read at each layout; the main effect does not track it.
	const targets: { photo?: HTMLImageElement; clear: HTMLElement[] } = { clear: [] };
	let changed = () => {};

	$effect(() => {
		targets.photo = photo;
		targets.clear = clear.filter((element): element is HTMLElement => element !== undefined);
		changed();
	});

	$effect(() => {
		const host = canvas.parentElement;
		if (!host) return;

		// The greys are design tokens (tailwind.config.ts, exposed in app.css), reached here as
		// opacities of the ink, so a glyph shows exactly the named colour on the page.
		const tokens = getComputedStyle(document.documentElement);
		const token = (name: string, fallback: string) =>
			tokens.getPropertyValue(name).trim() || fallback;
		const paper = token('--paper', '#ffffff');
		const ink = token('--ink', '#0b0b0b');
		const rest = inkAlpha(token('--field', '#ebebeb'), paper, ink) ?? 0.08;
		const peak = inkAlpha(token('--field-peak', '#9a9a9a'), paper, ink) ?? 0.41;
		const font = getComputedStyle(host).fontFamily;
		const tuningFor = (width: number): FieldTuning =>
			width < 640
				? { pitch: 18, glyph: 12, radius: 130, rest, peak, ink, font }
				: { pitch: 22, glyph: 13, radius: 170, rest, peak, ink, font };

		let engine: BinaryFieldEngine;
		try {
			engine = new BinaryFieldEngine(canvas, tuningFor(host.clientWidth));
		} catch {
			return;
		}

		const motion = matchMedia(REDUCED_MOTION);
		let reduced = motion.matches;
		let inView = false;
		let pageVisible = document.visibilityState === 'visible';
		let ready = false;
		let destroyed = false;
		let running = false;
		let frameId = 0;
		let timerId = 0;
		let layoutId = 0;
		/** The pointer in viewport coordinates, while a mouse or pen is over the opening. */
		const pointer = { x: 0, y: 0, over: false };
		/** Where the canvas is on the page, so a frame needs no measuring. */
		let pageLeft = 0;
		let pageTop = 0;
		let traced: { key: string; shape: Silhouette } | null = null;
		let head = { x: 0, y: 0 };

		function layout() {
			layoutId = 0;
			const box = canvas.getBoundingClientRect();
			const { width, height } = box;
			if (width < 1 || height < 1) return;
			pageLeft = box.left + window.scrollX;
			pageTop = box.top + window.scrollY;
			const tuning = tuningFor(width);
			const dpr = Math.min(
				window.devicePixelRatio || 1,
				2,
				Math.sqrt(MAX_PIXELS / (width * height))
			);
			engine.resize(width, height, dpr, tuning);

			const texts = targets.clear.map((element) => {
				const r = element.getBoundingClientRect();
				return {
					left: r.left - box.left,
					top: r.top - box.top,
					right: r.right - box.left,
					bottom: r.bottom - box.top
				};
			});

			// The person, traced again only when the picture or its size changes.
			let shape: Silhouette | null = null;
			let origin = { x: 0, y: 0 };
			const image = targets.photo;
			if (image) {
				const r = image.getBoundingClientRect();
				origin = { x: r.left - box.left, y: r.top - box.top };
				const key = `${image.currentSrc}|${r.width}|${r.height}|${image.naturalWidth}`;
				if (traced?.key !== key) {
					traced = {
						key,
						shape: traceSilhouette(image, r.width, r.height, PERSON_MARGIN + PERSON_FEATHER)
					};
				}
				shape = traced.shape;
				head = { x: origin.x + shape.head.x, y: origin.y + shape.head.y };
			} else {
				head = { x: width * 0.7, y: height * 0.4 };
			}

			// Open space has glyphs; text and the person push them away; the field fades in under
			// the header and out toward the hairline it ends on. On a phone the portrait is at the
			// top and the text runs to the bottom, so the field gives out sooner.
			const { pitch } = tuning;
			const bottom = pitch * (width < 640 ? 5 : 3);
			engine.setPresence((x, y) => {
				let p = smooth(0, pitch * 3, y) * smooth(height, height - bottom, y);
				for (const t of texts) {
					if (p === 0) return 0;
					const dx = Math.max(t.left - x, 0, x - t.right);
					const dy = Math.max(t.top - y, 0, y - t.bottom);
					p *= smooth(TEXT_MARGIN, TEXT_MARGIN + pitch * 3, Math.hypot(dx, dy));
				}
				if (shape && p > 0) {
					const d = shape.distance(x - origin.x, y - origin.y);
					p *= smooth(PERSON_MARGIN, PERSON_MARGIN + PERSON_FEATHER, d);
				}
				return p;
			});
		}

		function relayout() {
			if (ready && !layoutId && !destroyed) layoutId = requestAnimationFrame(layout);
		}

		function frame(now: number) {
			frameId = 0;
			// From the viewport to the canvas, by the scroll, which also moves a pointer at rest.
			if (pointer.over) {
				engine.pointerAt(
					pointer.x + window.scrollX - pageLeft,
					pointer.y + window.scrollY - pageTop
				);
			}
			engine.step(now);
			// Every frame while the pointer or a ripple is at work; at rest, a timer paces the
			// frames and leaves the main thread alone in between.
			if (engine.lively) frameId = requestAnimationFrame(frame);
			else timerId = window.setTimeout(resume, REST_INTERVAL);
		}

		function resume() {
			timerId = 0;
			frameId = requestAnimationFrame(frame);
		}

		// Something happened: the next frame now, not at the resting pace.
		function wake() {
			if (!running || !timerId) return;
			clearTimeout(timerId);
			resume();
		}

		// Run only while the opening is on screen, the tab is showing and motion is welcome.
		function sync() {
			const run = ready && inView && pageVisible && !reduced;
			if (run && !running) {
				running = true;
				frameId = requestAnimationFrame(frame);
			} else if (!run && running) {
				running = false;
				cancelAnimationFrame(frameId);
				clearTimeout(timerId);
				frameId = 0;
				timerId = 0;
				engine.finishBoot();
			}
		}

		// Size changes of the opening, the text or the photo all mean a new layout.
		const resizes = new ResizeObserver(relayout);
		let watchedPhoto: HTMLImageElement | undefined;
		const watch = () => {
			resizes.disconnect();
			resizes.observe(host);
			for (const element of targets.clear) resizes.observe(element);
			watchedPhoto?.removeEventListener('load', relayout);
			watchedPhoto = targets.photo;
			if (watchedPhoto) {
				resizes.observe(watchedPhoto);
				watchedPhoto.addEventListener('load', relayout);
			}
		};
		changed = () => {
			watch();
			relayout();
		};
		watch();

		const visibility = new IntersectionObserver((entries) => {
			inView = entries[entries.length - 1].isIntersecting;
			sync();
		});
		visibility.observe(host);

		const onVisibility = () => {
			pageVisible = document.visibilityState === 'visible';
			sync();
		};
		const onMotion = () => {
			reduced = motion.matches;
			if (reduced) {
				pointer.over = false;
				sync();
				engine.calm();
			} else {
				sync();
			}
		};
		// A mouse or pen warms the field around it; a touch only ever taps.
		const onMove = (event: PointerEvent) => {
			if (event.pointerType === 'touch' || reduced) return;
			pointer.x = event.clientX;
			pointer.y = event.clientY;
			pointer.over = true;
			engine.pointerMoved(performance.now());
			wake();
		};
		const onLeave = () => {
			pointer.over = false;
			engine.pointerLeft();
		};
		// A tap or a click sends a ripple; a touch that scrolls the page does not.
		const onTap = (event: MouseEvent) => {
			if (!ready || reduced) return;
			const box = canvas.getBoundingClientRect();
			engine.ripple(event.clientX - box.left, event.clientY - box.top, performance.now(), TAP);
			wake();
		};

		document.addEventListener('visibilitychange', onVisibility);
		motion.addEventListener('change', onMotion);
		window.addEventListener('resize', relayout, { passive: true });
		host.addEventListener('pointermove', onMove, { passive: true });
		host.addEventListener('pointerleave', onLeave, { passive: true });
		host.addEventListener('click', onTap, { passive: true });

		// Draw once the font and the photo are in, so nothing jumps; never wait long for them.
		(async () => {
			await tick();
			const glyphFont = document.fonts?.load(`500 16px ${font}`, '01');
			const settled = Promise.all([glyphFont, targets.photo?.decode()]).catch(() => {});
			const timedOut = await Promise.race([
				settled.then(() => false),
				new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 1500))
			]);
			if (destroyed) return;
			ready = true;
			layout();
			if (!reduced && inView && pageVisible) {
				engine.boot(head.x, head.y, performance.now(), BOOT);
			}
			shown = true;
			sync();
			// The font came late: redraw the glyphs in it once it is in.
			if (timedOut) {
				glyphFont
					?.then(() => {
						if (!destroyed) engine.refreshSprites();
					})
					.catch(() => {});
			}
		})();

		return () => {
			destroyed = true;
			cancelAnimationFrame(frameId);
			clearTimeout(timerId);
			cancelAnimationFrame(layoutId);
			resizes.disconnect();
			visibility.disconnect();
			watchedPhoto?.removeEventListener('load', relayout);
			document.removeEventListener('visibilitychange', onVisibility);
			motion.removeEventListener('change', onMotion);
			window.removeEventListener('resize', relayout);
			host.removeEventListener('pointermove', onMove);
			host.removeEventListener('pointerleave', onLeave);
			host.removeEventListener('click', onTap);
			changed = () => {};
		};
	});

	/** 0 at edge0, 1 at edge1, smooth in between; either way round. */
	function smooth(edge0: number, edge1: number, x: number): number {
		const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
		return t * t * (3 - 2 * t);
	}
</script>

<!--
	The field of 0s and 1s: a canvas across the whole opening, above the photo (so it can
	run through the photo's white backdrop) and below the text, which it keeps clear of.
	Decorative, so hidden from assistive technology and from the pointer. Without
	JavaScript it stays empty and the opening is complete without it.
-->
<canvas
	bind:this={canvas}
	aria-hidden="true"
	class="pointer-events-none absolute inset-0 z-10 h-full w-full transition-opacity duration-1000 ease-out {shown
		? 'opacity-100'
		: 'opacity-0'}"
></canvas>
