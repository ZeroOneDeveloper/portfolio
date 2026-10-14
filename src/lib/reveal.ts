import { REDUCED_MOTION } from './media';

/** Between elements that come into view together. */
const STAGGER = 70;
const MAX_DELAY = 420;
/**
 * Past this long after the page started, app.css may already have shown everything by
 * itself (its safety net runs 2.5s after the first paint): show everything, quietly.
 */
const LATE = 2000;

/**
 * Reveal each [data-reveal] element as it comes into view (see app.css for how each kind
 * moves), with one IntersectionObserver. What is on screen now comes in at once, in page
 * order, a beat apart; what is above the screen, scrolled past by a jump to an anchor, is
 * simply shown. Returns a cleanup function.
 */
export function revealOnScroll(): () => void {
	const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

	const show = (element: HTMLElement, delay: number) => {
		if (delay > 0) element.style.setProperty('--reveal-delay', `${delay}ms`);
		element.dataset.revealed = '';
	};
	const showNow = (element: HTMLElement) => {
		element.dataset.revealed = 'now';
	};

	if (
		matchMedia(REDUCED_MOTION).matches ||
		!('IntersectionObserver' in window) ||
		performance.now() > LATE
	) {
		elements.forEach(showNow);
		return () => {};
	}

	document.documentElement.classList.add('reveal-ready');

	const waiting = new Set<HTMLElement>();
	let order = 0;
	for (const element of elements) {
		const { top, bottom } = element.getBoundingClientRect();
		if (bottom <= 0) showNow(element);
		else if (top < window.innerHeight) show(element, Math.min(order++ * STAGGER, MAX_DELAY));
		else waiting.add(element);
	}

	// An element comes in once its top is a little way up the screen.
	const observer = new IntersectionObserver(
		(entries) => {
			let batch = 0;
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const element = entry.target as HTMLElement;
				show(element, Math.min(batch++ * STAGGER, MAX_DELAY));
				observer.unobserve(element);
				waiting.delete(element);
			}
		},
		{ rootMargin: '0px 0px -8% 0px' }
	);
	for (const element of waiting) observer.observe(element);

	// The last lines of the page may never get that far up: once the page cannot scroll
	// any further, whatever is still waiting on screen comes in.
	const atEnd = () => {
		if (waiting.size === 0) return window.removeEventListener('scroll', atEnd);
		const root = document.documentElement;
		if (window.scrollY + window.innerHeight < root.scrollHeight - 2) return;
		let batch = 0;
		for (const element of waiting) {
			if (element.getBoundingClientRect().top >= window.innerHeight) continue;
			show(element, Math.min(batch++ * STAGGER, MAX_DELAY));
			observer.unobserve(element);
			waiting.delete(element);
		}
	};
	window.addEventListener('scroll', atEnd, { passive: true });
	atEnd();

	return () => {
		observer.disconnect();
		window.removeEventListener('scroll', atEnd);
	};
}
