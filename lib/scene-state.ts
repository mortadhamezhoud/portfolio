/**
 * Mutable state shared between the page (scroll) and the 3D scene. It is read in
 * useFrame, never through React state, so scrolling causes no re-render.
 */
export const sceneState = {
  /** Smoothed morph progress between shapes (0 = globe). */
  morph: 0,
  /** Share of the globe in the current shape (drives arcs + mouse interaction). */
  globe: 1,
};

/** Raw morph target from the scroll position: globe on the hero, bars one screen later. */
export function readScrollMorph(): number {
  const range = Math.max(window.innerHeight * 0.9, 1);
  return Math.min(Math.max(window.scrollY / range, 0), 1);
}
