import { nav } from './content';

// Which header nav item is lit. Empty until JavaScript runs; without it, the :target
// rules in app.css light the item of the section you jumped to.
export const active = $state({ id: '' });

/**
 * Light the nav item of the last section whose top has passed a reading line a third of
 * the way down the viewport. Nothing runs on scroll: an IntersectionObserver watches the
 * band above that line, so its callback fires exactly when a section's top crosses the
 * line, either way, and the line it decides by is the edge that fired it. Returns a
 * cleanup function.
 */
export function trackActiveSection(): () => void {
	const sections = nav
		.map((item) => document.getElementById(item.id))
		.filter((element): element is HTMLElement => element !== null);

	if (!('IntersectionObserver' in window) || sections.length === 0) return () => {};

	// The reading line, in % of the viewport's height from the top.
	const share = 34;

	// Sections are in page order: the last one whose top is above the line is current,
	// so an item stays lit through the gap before the next section arrives. From the
	// observer, the line is its root's own bottom edge, so the two cannot disagree.
	const update = (entries?: IntersectionObserverEntry[]) => {
		const line = entries?.[0]?.rootBounds?.bottom ?? (window.innerHeight * share) / 100;
		let current = '';
		for (const section of sections) {
			if (section.getBoundingClientRect().top <= line) current = section.id;
		}
		active.id = current;
	};

	// The root is the band from the top of the viewport down to the line.
	const observer = new IntersectionObserver(update, {
		rootMargin: `0px 0px ${share - 100}% 0px`
	});
	for (const section of sections) observer.observe(section);
	update();

	return () => observer.disconnect();
}
