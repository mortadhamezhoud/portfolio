import { SHAPE } from "@/lib/scenes";

/**
 * Mutable state shared between the page (scroll) and the 3D scene. It is read in
 * useFrame, never through React state, so scrolling causes no re-render.
 */
export const sceneState = {
  /** Current morph: shape index `from` -> `to`, progress 0..1. */
  from: 0 as number,
  to: 0 as number,
  morph: 0,
  /** Share of the globe in the current shape (drives arcs + mouse interaction). */
  globe: 1,
  /** 1 = big hero-style placement, 0 = small, blurred ambient background. */
  zone: 1,
  /** Mobile only: 1 puts the shape small at the top of the screen (above the project text). */
  compact: 0,
  /** Index (0-2) of the domain shown in "What I do", or -1 outside the section. */
  domain: -1,
};

export interface Keyframe {
  /** Scroll position (px) at which this keyframe is fully reached. */
  y: number;
  shape: number;
  zone: number;
  /** 1 = mobile placement above the project text. */
  compact?: number;
}

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/**
 * Builds the scroll timeline from the sections in the DOM. Called on mount and resize,
 * never during scroll. Between two keyframes the scene morphs/moves; with the same
 * shape it only moves (a "hold").
 */
export function buildTimeline(): Keyframe[] {
  const vh = window.innerHeight;
  const scrollY = window.scrollY;
  const top = (id: string) => {
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().top + scrollY : null;
  };

  const frames: Keyframe[] = [{ y: 0, shape: SHAPE.globe, zone: 1 }];
  const about = top("about");
  const contact = top("contact");

  // Projects: one keyframe pair per project (arrive / leave), shape read from data-shape
  const projectEls = Array.from(document.querySelectorAll<HTMLElement>("#projects [data-shape]"));
  const projectFrames: Keyframe[] = projectEls.flatMap((el) => {
    const shape = Number(el.dataset.shape);
    const y = el.getBoundingClientRect().top + scrollY + (el.offsetHeight - vh) / 2;
    return [
      { y: y - vh * 0.15, shape, zone: 1, compact: 1 },
      { y: y + vh * 0.15, shape, zone: 1, compact: 1 },
    ];
  });
  const projectsStart = top("projects");
  if (projectFrames.length > 0 && projectsStart !== null) {
    // Ambient globe until just before the first project, then the first shape appears
    frames.push({ y: projectsStart - vh * 0.7, shape: SHAPE.globe, zone: 0 }, ...projectFrames);
    const last = projectFrames[projectFrames.length - 1];
    frames.push({ y: last.y + vh * 0.9, shape: last.shape, zone: 0 });
  }

  if (about !== null) // The globe leaves the text area before About starts
    frames.push({ y: about - vh * 0.55, shape: SHAPE.globe, zone: 1 }, { y: about - vh * 0.05, shape: SHAPE.globe, zone: 0 });
  if (contact !== null) {
    frames.push(
      { y: contact - vh * 0.9, shape: frames[frames.length - 1].shape, zone: 0 },
      { y: contact - vh * 0.1, shape: SHAPE.globe, zone: 0 },
    );
  }
  // Keep keyframes strictly ordered (sections can overlap on tiny viewports)
  return frames
    .sort((a, b) => a.y - b.y)
    .filter((f, i, all) => i === 0 || f.y > all[i - 1].y);
}

/** Writes the scene state for a (smoothed) scroll position. No allocation. */
export function applyTimeline(frames: Keyframe[], y: number): void {
  let i = 0;
  while (i < frames.length - 2 && y >= frames[i + 1].y) i++;
  const a = frames[i];
  const b = frames[Math.min(i + 1, frames.length - 1)];
  const u = b.y > a.y ? clamp01((y - a.y) / (b.y - a.y)) : 0;
  sceneState.from = a.shape;
  sceneState.to = b.shape;
  sceneState.morph = a.shape === b.shape ? 0 : u;
  sceneState.zone = a.zone + (b.zone - a.zone) * u;
  sceneState.compact = (a.compact ?? 0) + ((b.compact ?? 0) - (a.compact ?? 0)) * u;
  if (a.shape === b.shape) sceneState.to = a.shape;
  const wGlobe =
    (a.shape === SHAPE.globe ? 1 - sceneState.morph : 0) +
    (b.shape === SHAPE.globe && a.shape !== b.shape ? sceneState.morph : 0);
  sceneState.globe = clamp01(wGlobe);
}
