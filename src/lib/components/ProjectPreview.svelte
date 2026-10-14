<script lang="ts">
	import { tick } from 'svelte';

	import type { Project } from '$lib/content';
	import { FINE_POINTER, REDUCED_MOTION } from '$lib/media';

	interface Props {
		/** The list of projects. A row marked data-preview shows its picture while in use. */
		list?: HTMLElement;
		/** The projects in that list; those with a picture have one to show. */
		projects: Project[];
	}

	let { list, projects }: Props = $props();

	/** The picture hangs this far below and to the right of the pointer, clear of the name. */
	const OFFSET = { x: 18, y: 30 };
	/** Space between a name reached from the keyboard and its picture. */
	const GAP = 28;
	/** Space kept between the picture and the words of its row, and the screen's edges. */
	const MARGIN = 24;

	const pictured = $derived(projects.filter((project) => project.media));

	/** The project whose picture is out. */
	let active = $state<string | null>(null);
	/** The pictures go in on first use, so they cost nothing to a reader without a mouse. */
	let armed = $state(false);
	let box: HTMLElement;

	$effect(() => {
		if (!list) return;
		const rows = list;
		const fine = matchMedia(FINE_POINTER);
		const motion = matchMedia(REDUCED_MOTION);
		const cursor = { x: 0, y: 0 };
		/** The row in use, and whether the keyboard put it there. */
		let row: HTMLElement | null = null;
		let byKeyboard = false;
		// Where the picture is, and where it is going: its top left corner.
		let x = 0;
		let y = 0;
		let tx = 0;
		let ty = 0;
		let frameId = 0;
		let last = 0;
		let leftAt = 0;

		// Below and to the right of the pointer, or level with a name reached from the
		// keyboard, just after it; always within the row's name column (from the row's left
		// to its words, less a margin), so it never covers what the row says, and on screen.
		function aim() {
			if (!row) return;
			const card = box.querySelector<HTMLElement>(`[data-card="${row.dataset.preview}"]`);
			const width = card?.offsetWidth ?? 0;
			const height = card?.offsetHeight ?? 0;
			const bounds = row.getBoundingClientRect();
			const words = row.querySelector('[data-preview-edge]')?.getBoundingClientRect();
			const left = bounds.left;
			const right = Math.max(left, (words?.left ?? bounds.right) - MARGIN - width);
			let wantX = cursor.x + OFFSET.x;
			let wantY = cursor.y + OFFSET.y;
			if (byKeyboard || motion.matches) {
				const heading = row.querySelector('h3, h4');
				const name = document.createRange();
				if (heading) name.selectNodeContents(heading);
				const text = heading ? name.getBoundingClientRect() : bounds;
				wantX = text.right + GAP;
				wantY = text.top + (text.height - height) / 2;
			}
			tx = Math.min(right, Math.max(left, wantX));
			ty = Math.min(window.innerHeight - MARGIN - height, Math.max(MARGIN, wantY));
		}

		function place() {
			box.style.transform = `translate3d(${x}px, ${y}px, 0)`;
		}

		// The picture glides after its target; with reduced motion it is simply there.
		function frame(now: number) {
			frameId = 0;
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			aim();
			const follow = motion.matches ? 1 : 1 - Math.exp(-dt * 14);
			x += (tx - x) * follow;
			y += (ty - y) * follow;
			place();
			const settled = Math.abs(tx - x) < 0.25 && Math.abs(ty - y) < 0.25;
			if (row ? !settled : now - leftAt < 450) frameId = requestAnimationFrame(frame);
		}

		function run() {
			if (frameId) return;
			last = performance.now();
			frameId = requestAnimationFrame(frame);
		}

		function use(next: HTMLElement | null, keyboard: boolean) {
			byKeyboard = keyboard;
			if (next === row) return run();
			const appearing = row === null;
			row = next;
			active = next?.dataset.preview ?? null;
			if (!next) {
				leftAt = performance.now();
				return run();
			}
			// A picture coming out appears where it belongs, then follows.
			const show = () => {
				if (row !== next || !appearing) return;
				aim();
				x = tx;
				y = ty;
				place();
			};
			if (armed) show();
			else {
				armed = true;
				tick().then(show);
			}
			run();
		}

		const rowAt = (target: EventTarget | null) =>
			target instanceof Element ? target.closest<HTMLElement>('[data-preview]') : null;

		const onMove = (event: PointerEvent) => {
			if (event.pointerType === 'touch' || !fine.matches) return;
			cursor.x = event.clientX;
			cursor.y = event.clientY;
			use(rowAt(event.target), false);
		};
		const onLeave = () => {
			if (!byKeyboard) use(null, false);
		};
		const onFocusIn = (event: FocusEvent) => {
			const target = event.target;
			if (!fine.matches || !(target instanceof Element) || !target.matches(':focus-visible')) {
				return;
			}
			use(rowAt(target), true);
		};
		const onFocusOut = (event: FocusEvent) => {
			if (byKeyboard && !rows.contains(event.relatedTarget as Node | null)) use(null, false);
		};
		// Scrolling moves the rows under a resting pointer, or a focused row on the screen.
		const onScroll = () => {
			if (!row) return;
			if (!byKeyboard) {
				const under = document.elementFromPoint(cursor.x, cursor.y);
				return use(under && rows.contains(under) ? rowAt(under) : null, false);
			}
			run();
		};
		const onFine = () => {
			if (!fine.matches) use(null, false);
		};

		rows.addEventListener('pointermove', onMove, { passive: true });
		rows.addEventListener('pointerleave', onLeave, { passive: true });
		rows.addEventListener('focusin', onFocusIn);
		rows.addEventListener('focusout', onFocusOut);
		window.addEventListener('scroll', onScroll, { passive: true });
		fine.addEventListener('change', onFine);

		return () => {
			cancelAnimationFrame(frameId);
			rows.removeEventListener('pointermove', onMove);
			rows.removeEventListener('pointerleave', onLeave);
			rows.removeEventListener('focusin', onFocusIn);
			rows.removeEventListener('focusout', onFocusOut);
			window.removeEventListener('scroll', onScroll);
			fine.removeEventListener('change', onFine);
		};
	});
</script>

<!--
	The picture of the project in use, floating beside the pointer: decorative, so hidden
	from assistive technology (each row keeps its own picture, with its alt text, for screen
	readers and for touch screens, where it shows in place). Only on a wide screen with a
	mouse; it never takes the pointer.
-->
<div
	bind:this={box}
	aria-hidden="true"
	class="pointer-events-none fixed left-0 top-0 z-30 hidden will-change-transform fine:block"
>
	{#if armed}
		{#each pictured as project (project.id)}
			{@const media = project.media}
			<div
				data-card={project.id}
				class="absolute left-0 top-0 w-max origin-top-left overflow-hidden rounded-[4px] bg-paper shadow-[0_28px_60px_-30px] shadow-ink/30 outline outline-1 outline-line transition duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] {active ===
				project.id
					? 'scale-100 opacity-100'
					: 'scale-[0.94] opacity-0'}"
			>
				{#if media?.kind === 'screen'}
					<img
						src={media.image.src}
						width={media.image.width}
						height={media.image.height}
						alt=""
						class="block h-auto w-[22rem]"
					/>
				{:else if media?.kind === 'logo'}
					<img
						src={media.image.src}
						width={media.image.width}
						height={media.image.height}
						alt=""
						class="m-5 block size-44"
					/>
				{:else if media?.kind === 'print'}
					<div class="flex gap-3 p-4">
						{#each media.frames as frame (frame.src)}
							<img
								src={frame.src}
								width={frame.width}
								height={frame.height}
								alt=""
								class="block h-56 w-auto {frame.tone === 'light'
									? 'outline outline-1 outline-line'
									: ''}"
							/>
						{/each}
					</div>
				{:else if media?.kind === 'flow'}
					<div class="w-72 p-5">
						<p class="text-meta text-muted">{media.caption}</p>
						<ol class="mt-2 border-b border-line">
							{#each media.steps as step (step)}
								<li class="border-t border-line py-2.5 text-small font-semibold">{step}</li>
							{/each}
						</ol>
					</div>
				{/if}
			</div>
		{/each}
	{/if}
</div>
