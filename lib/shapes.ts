import * as THREE from "three";
import { createSpherePoints, mulberry32, type Rng } from "@/lib/globe";

/**
 * Target shapes for the single particle system. Every shape is a set of N target
 * positions (+ a colour and a 0..1 "order" per particle), computed once and stored in
 * BufferAttributes. The vertex shader interpolates between two of them.
 */
export interface ShapeData {
  positions: Float32Array;
  colors: Float32Array;
  /** 0..1 per particle: lower values start moving first when morphing towards this shape. */
  order: Float32Array;
}

export const SHAPE_COUNT = 2;

const BLUE = new THREE.Color("#5B8CFF");
const CYAN = new THREE.Color("#3EE6C1");

// ---------------------------------------------------------------- Globe

function createGlobeShape(count: number, rands: Float32Array, positions: Float32Array): ShapeData {
  const colors = new Float32Array(count * 3);
  const order = new Float32Array(count);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    c.copy(CYAN).lerp(BLUE, (rands[i] * 7.13) % 1);
    colors.set([c.r, c.g, c.b], i * 3);
    order[i] = (positions[i * 3 + 1] + 1) / 2;
  }
  return { positions, colors, order };
}

// ---------------------------------------------------------------- Data & BI bars

const COLS = 6;
const ROWS = 4;
const PITCH = 0.34;
const BAR_SIZE = 0.22;
const BASE_Y = -0.6;
const MAX_HEIGHT = 1.35;
/** Fixed, varied heights (0..1): reads like a real chart, never a flat grid. */
const HEIGHTS = [
  0.42, 0.7, 0.55, 0.95, 0.62, 0.8, //
  0.6, 0.38, 0.85, 0.5, 1.0, 0.45, //
  0.75, 0.9, 0.35, 0.68, 0.52, 0.72, //
  0.3, 0.58, 0.78, 0.4, 0.88, 0.64,
];

function createBarsShape(count: number, rng: Rng): ShapeData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const order = new Float32Array(count);
  const c = new THREE.Color();

  const gridCount = Math.round(count * 0.14);
  const barCount = count - gridCount;

  // Bar surfaces: choose a bar (weighted by its area), then a face
  const bars = HEIGHTS.map((h, i) => {
    const height = h * MAX_HEIGHT;
    const side = BAR_SIZE;
    return {
      x: (i % COLS - (COLS - 1) / 2) * PITCH,
      z: (Math.floor(i / COLS) - (ROWS - 1) / 2) * PITCH,
      height,
      area: 4 * side * height + side * side,
    };
  });
  const totalArea = bars.reduce((s, b) => s + b.area, 0);

  for (let i = 0; i < barCount; i++) {
    let pick = rng() * totalArea;
    let bar = bars[bars.length - 1];
    for (const b of bars) {
      if (pick < b.area) {
        bar = b;
        break;
      }
      pick -= b.area;
    }
    const half = BAR_SIZE / 2;
    const sideArea = 4 * BAR_SIZE * bar.height;
    let lx: number, ly: number, lz: number;
    const kind = rng();
    if (kind < 0.45) {
      // Crisp outline: the four vertical edges and the top rectangle
      const sx = rng() < 0.5 ? -half : half;
      const sz = rng() < 0.5 ? -half : half;
      if (rng() < 0.6) {
        [lx, ly, lz] = [sx, rng() * bar.height, sz];
      } else if (rng() < 0.5) {
        [lx, ly, lz] = [(rng() * 2 - 1) * half, bar.height, sz];
      } else {
        [lx, ly, lz] = [sx, bar.height, (rng() * 2 - 1) * half];
      }
    } else if (rng() * bar.area < sideArea) {
      // One of the four vertical faces
      const face = Math.floor(rng() * 4);
      const u = (rng() * 2 - 1) * half;
      ly = rng() * bar.height;
      if (face === 0) [lx, lz] = [half, u];
      else if (face === 1) [lx, lz] = [-half, u];
      else if (face === 2) [lx, lz] = [u, half];
      else [lx, lz] = [u, -half];
    } else {
      lx = (rng() * 2 - 1) * half;
      lz = (rng() * 2 - 1) * half;
      ly = bar.height;
    }
    positions.set([bar.x + lx, BASE_Y + ly, bar.z + lz], i * 3);
    const t = ly / MAX_HEIGHT; // gradient is shared across bars: blue at the bottom, cyan at the top
    c.copy(BLUE).lerp(CYAN, Math.min(t / 0.9, 1));
    colors.set([c.r, c.g, c.b], i * 3);
    order[i] = ly / bar.height; // bars grow from the bottom up
  }

  // Thin floor grid
  const gx = (COLS + 1) * PITCH * 0.5;
  const gz = (ROWS + 1) * PITCH * 0.5;
  const linesX = ROWS + 2;
  const linesZ = COLS + 2;
  for (let k = 0; k < gridCount; k++) {
    const i = barCount + k;
    let x: number, z: number;
    if (rng() < 0.5) {
      x = (rng() * 2 - 1) * gx;
      z = (Math.floor(rng() * linesX) / (linesX - 1) * 2 - 1) * gz;
    } else {
      z = (rng() * 2 - 1) * gz;
      x = (Math.floor(rng() * linesZ) / (linesZ - 1) * 2 - 1) * gx;
    }
    positions.set([x, BASE_Y, z], i * 3);
    // Dim blue so the grid stays in the background
    c.copy(BLUE).multiplyScalar(0.45);
    colors.set([c.r, c.g, c.b], i * 3);
    order[i] = rng() * 0.25;
  }

  return { positions, colors, order };
}

// ---------------------------------------------------------------- Public

export interface ParticleShapes {
  /** Random scattered start positions for the intro "gather". */
  starts: Float32Array;
  rands: Float32Array;
  shapes: ShapeData[];
}

/** Builds every shape once for `count` particles (deterministic). */
export function createParticleShapes(count: number): ParticleShapes {
  const sphere = createSpherePoints(count, mulberry32(42));
  return {
    starts: sphere.starts,
    rands: sphere.rands,
    shapes: [
      createGlobeShape(count, sphere.rands, sphere.positions),
      createBarsShape(count, mulberry32(1337)),
    ],
  };
}
