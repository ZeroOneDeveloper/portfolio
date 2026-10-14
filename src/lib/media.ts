// Media queries shared by the parts of the page that move.

/**
 * A wide screen driven by a mouse or trackpad, where 작업 becomes a list of large names
 * with a preview that follows the pointer. tailwind.config.ts builds its `fine` screen
 * from this, so the markup and the script always agree.
 */
export const FINE_POINTER = '(hover: hover) and (pointer: fine) and (min-width: 1024px)';

/** Motion is unwelcome: everything is shown as it ends up, and nothing animates. */
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
