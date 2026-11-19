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
  /** Optional per-particle flag (shield halo = 1, scrolling news line = 1). */
  flag?: Float32Array;
  /** Optional per-particle value (news: bottom of the scrolling area of its window). */
  aux?: Float32Array;
}

export const SHAPE_COUNT = 5;

/** Shape indices, in the order used by the shader. */
export const SHAPE = { globe: 0, bars: 1, neural: 2, web: 3, news: 4 } as const;

/** Scene names used in data/projects.json ("scene") -> shape index. */
export const SCENE_SHAPE: Record<string, number> = {
  globe: SHAPE.globe,
  bars: SHAPE.bars,
  "neural-shield": SHAPE.neural,
  fullstack: SHAPE.web,
  "news-feed": SHAPE.news,
};

/** Height of the scrolling text area of a news window (must match the shader). */
export const NEWS_SCROLL_HEIGHT = 0.8;

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

// ---------------------------------------------------------------- Machine learning: neural network

const LAYERS = [5, 8, 8, 3];
const LAYER_GAP = 0.8;
const NODE_GAP = 0.27;

/** Node positions per layer (slight depth jitter so it reads as 3D). */
function neuralNodes(): THREE.Vector3[][] {
  const rng = mulberry32(99);
  return LAYERS.map((n, l) =>
    Array.from({ length: n }, (_, k) =>
      new THREE.Vector3(
        (l - (LAYERS.length - 1) / 2) * LAYER_GAP,
        (k - (n - 1) / 2) * NODE_GAP,
        (rng() - 0.5) * 0.5,
      ),
    ),
  );
}

const SHIELD_W = 1.55;
const SHIELD_TOP = 1.5;
const SHIELD_BOTTOM = -1.75;

/** Heater-shield outline: flat top, straight sides, curved sides meeting in a point. */
function shieldPoint(rng: Rng): [number, number] {
  const r = rng();
  if (r < 0.2) {
    // A few dots inside the shield
    const y = SHIELD_BOTTOM + rng() * (SHIELD_TOP - SHIELD_BOTTOM);
    const half = shieldHalfWidth(y);
    return [(rng() * 2 - 1) * half * 0.9, y];
  }
  // Outline: sample the height, then pick the left or right edge (top edge handled apart)
  if (r < 0.32) return [(rng() * 2 - 1) * SHIELD_W, SHIELD_TOP];
  const y = SHIELD_BOTTOM + rng() * (SHIELD_TOP - SHIELD_BOTTOM);
  return [(rng() < 0.5 ? -1 : 1) * shieldHalfWidth(y), y];
}

/** Half-width of the shield at height y (constant in the upper half, then a rounded taper). */
function shieldHalfWidth(y: number): number {
  const mid = 0.1;
  if (y >= mid) return SHIELD_W;
  const t = (y - mid) / (SHIELD_BOTTOM - mid); // 0 at mid, 1 at the point
  return SHIELD_W * Math.sqrt(Math.max(1 - t * t, 0));
}

function createNeuralShape(count: number, rng: Rng): ShapeData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const order = new Float32Array(count);
  const layers = neuralNodes();
  const nodes = layers.flat();
  const edges: [THREE.Vector3, THREE.Vector3][] = [];
  for (let l = 0; l < layers.length - 1; l++)
    for (const a of layers[l]) for (const b of layers[l + 1]) edges.push([a, b]);

  const nodeCount = Math.round(count * 0.26);
  const shieldCount = Math.round(count * 0.14);
  const flag = new Float32Array(count);
  const c = new THREE.Color();
  const v = new THREE.Vector3();
  const span = (LAYERS.length - 1) * LAYER_GAP;
  for (let i = 0; i < count; i++) {
    if (i < nodeCount) {
      // Dense glowing cluster around each node
      const n = nodes[i % nodes.length];
      v.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize().multiplyScalar(0.06 * Math.cbrt(rng()));
      v.add(n);
    } else if (i < nodeCount + shieldCount) {
      // Shield-shaped halo around the network (outline + a few scattered dots)
      const [sx, sy] = shieldPoint(rng);
      v.set(sx, sy, -0.25 * (sx / SHIELD_W) ** 2 - 0.1);
      flag[i] = 1;
    } else {
      // Thin line between two nodes of adjacent layers
      const [a, b] = edges[Math.floor(rng() * edges.length)];
      v.copy(a).lerp(b, rng());
    }
    positions.set([v.x, v.y, v.z], i * 3);
    const t = (v.x + span / 2) / span; // blue (input) -> cyan (output)
    c.copy(BLUE).lerp(CYAN, t);
    if (flag[i] > 0.5) c.copy(CYAN).multiplyScalar(0.55);
    else if (i >= nodeCount) c.multiplyScalar(0.8);
    colors.set([c.r, c.g, c.b], i * 3);
    order[i] = t;
  }
  return { positions, colors, order, flag };
}

// ---------------------------------------------------------------- Web: frontend / API / database

/** Depth of the three layers (the camera looks down -z). */
export const WEB_Z = { frontend: 0.95, api: 0, database: -0.95 };

function createWebShape(count: number, rng: Rng): ShapeData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const order = new Float32Array(count);
  const c = new THREE.Color();
  type Sampler = () => [number, number, number];
  const elements: { weight: number; sample: Sampler }[] = [];

  // Frontend: 3 browser windows (outline + header bar + 3 dots)
  const windows = [
    { x: -0.5, y: 0.78, w: 0.8, h: 0.55 },
    { x: 0.5, y: 0.9, w: 0.7, h: 0.48 },
    { x: 0.0, y: 0.32, w: 0.75, h: 0.5 },
  ];
  for (const win of windows) {
    const z = WEB_Z.frontend;
    const left = win.x - win.w / 2;
    const top = win.y + win.h / 2;
    const bar = top - win.h * 0.2;
    elements.push({
      weight: 5,
      sample: () => {
        const r = rng();
        if (r < 0.62) {
          // Frame
          const side = Math.floor(rng() * 4);
          const u = rng();
          if (side === 0) return [left + u * win.w, top, z];
          if (side === 1) return [left + u * win.w, top - win.h, z];
          if (side === 2) return [left, top - u * win.h, z];
          return [left + win.w, top - u * win.h, z];
        }
        if (r < 0.82) return [left + rng() * win.w, bar, z]; // header separator
        // Three dots in the header, left side
        const d = Math.floor(rng() * 3);
        const a = rng() * Math.PI * 2;
        const rr = 0.022 * Math.sqrt(rng());
        return [left + 0.07 + d * 0.075 + Math.cos(a) * rr, top - win.h * 0.1 + Math.sin(a) * rr, z];
      },
    });
    // A few content lines inside the window
    elements.push({
      weight: 1.5,
      sample: () => {
        const line = Math.floor(rng() * 3);
        const len = [0.7, 0.5, 0.6][line];
        return [left + 0.08 + rng() * win.w * len, bar - 0.1 - line * 0.1, z];
      },
    });
  }

  // API: ring of 10 nodes + faint ring
  const apiNodes = 10;
  const apiR = 0.62;
  elements.push({
    weight: 9,
    sample: () => {
      const n = Math.floor(rng() * apiNodes);
      const a = (n / apiNodes) * Math.PI * 2;
      const q = new THREE.Vector3(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1).normalize().multiplyScalar(0.06 * Math.cbrt(rng()));
      return [Math.cos(a) * apiR + q.x, Math.sin(a) * apiR * 0.5 + q.y, WEB_Z.api + Math.sin(a) * apiR * 0.5 + q.z];
    },
  });
  elements.push({
    weight: 3,
    sample: () => {
      const a = rng() * Math.PI * 2;
      return [Math.cos(a) * apiR, Math.sin(a) * apiR * 0.5, WEB_Z.api + Math.sin(a) * apiR * 0.5];
    },
  });

  // Database: cylinder (3 stacked discs)
  const dbR = 0.5;
  const dbH = 0.7;
const DB_Y = -0.75;
  elements.push({
    weight: 12,
    sample: () => {
      const a = rng() * Math.PI * 2;
      const r = rng();
      if (r < 0.6) {
        // Rings at top, middle thirds and bottom
        const ring = Math.floor(rng() * 4);
        return [Math.cos(a) * dbR, DB_Y - dbH / 2 + (ring / 3) * dbH, WEB_Z.database + Math.sin(a) * dbR];
      }
      const va = (Math.floor(rng() * 8) / 8) * Math.PI * 2; // 8 vertical lines
      return [Math.cos(va) * dbR, DB_Y - dbH / 2 + rng() * dbH, WEB_Z.database + Math.sin(va) * dbR];
    },
  });

  // Requests / responses: vertical links between the layers
  const linkXs = [-0.42, -0.12, 0.2, 0.45];
  elements.push({
    weight: 4,
    sample: () => {
      const x = linkXs[Math.floor(rng() * linkXs.length)];
      const t = rng();
      return [x, THREE.MathUtils.lerp(DB_Y + 0.3, 0.55, t), THREE.MathUtils.lerp(WEB_Z.database, WEB_Z.frontend, t)];
    },
  });

  const total = elements.reduce((s, e) => s + e.weight, 0);
  for (let i = 0; i < count; i++) {
    let pick = rng() * total;
    let el = elements[elements.length - 1];
    for (const e of elements) {
      if (pick < e.weight) {
        el = e;
        break;
      }
      pick -= e.weight;
    }
    const [x, y, z] = el.sample();
    positions.set([x, y, z], i * 3);
    const t = (z - WEB_Z.database) / (WEB_Z.frontend - WEB_Z.database); // blue (data) -> cyan (front)
    c.copy(BLUE).lerp(CYAN, t);
    colors.set([c.r, c.g, c.b], i * 3);
    order[i] = 1 - t; // front layer builds first
  }
  return { positions, colors, order };
}

// ---------------------------------------------------------------- Frontend: news feed windows

const NEWS_LINE_PITCH = 0.08;

/** Browser windows whose text lines scroll like a news feed (the scrolling is done in the shader). */
function createNewsShape(count: number, rng: Rng): ShapeData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const order = new Float32Array(count);
  const flag = new Float32Array(count);
  const aux = new Float32Array(count);
  const c = new THREE.Color();

  const W = 0.78;
  const H = 1.05;
  const HEADER = 0.2;
  const windows = [
    { x: -0.88, y: 0.1, z: 0.35 },
    { x: 0.0, y: -0.12, z: 0 },
    { x: 0.88, y: 0.14, z: -0.35 },
  ];
  // Pre-computed length of each text line, per window
  const lengths = windows.map(() =>
    Array.from({ length: Math.round(NEWS_SCROLL_HEIGHT / NEWS_LINE_PITCH) }, () => 0.35 + rng() * 0.6),
  );

  for (let i = 0; i < count; i++) {
    const wi = Math.floor(rng() * windows.length);
    const win = windows[wi];
    const left = win.x - W / 2;
    const top = win.y + H / 2;
    const r = rng();
    let x: number, y: number;
    if (r < 0.34) {
      // Frame
      const side = Math.floor(rng() * 4);
      const u = rng();
      if (side === 0) [x, y] = [left + u * W, top];
      else if (side === 1) [x, y] = [left + u * W, top - H];
      else if (side === 2) [x, y] = [left, top - u * H];
      else [x, y] = [left + W, top - u * H];
    } else if (r < 0.42) {
      [x, y] = [left + rng() * W, top - HEADER]; // header separator
    } else if (r < 0.5) {
      // Three dots in the header
      const d = Math.floor(rng() * 3);
      const a = rng() * Math.PI * 2;
      const rr = 0.02 * Math.sqrt(rng());
      [x, y] = [left + 0.07 + d * 0.07 + Math.cos(a) * rr, top - HEADER / 2 + Math.sin(a) * rr];
    } else {
      // Text line (scrolls in the shader): baseline y inside the scroll area, wrapped by the shader
      const contentMin = top - H + 0.05;
      const line = Math.floor(rng() * lengths[wi].length);
      x = left + 0.07 + rng() * lengths[wi][line] * (W - 0.14);
      y = contentMin + (line + 0.5) * NEWS_LINE_PITCH;
      flag[i] = 1;
      aux[i] = contentMin;
    }
    positions.set([x, y, win.z], i * 3);
    // Header brighter (cyan), text in blue: the feed is the blue/cyan gradient top to bottom
    c.copy(CYAN).lerp(BLUE, flag[i] > 0.5 ? 0.55 : 0.15);
    colors.set([c.r, c.g, c.b], i * 3);
    order[i] = (top - y) / H;
  }
  return { positions, colors, order, flag, aux };
}

// ---------------------------------------------------------------- Public

export interface ParticleShapes {
  /** Packed per particle: [order of the news shape, shield flag, news line flag, news scroll bottom]. */
  extra: Float32Array;
  /** Random scattered start positions for the intro "gather". */
  starts: Float32Array;
  rands: Float32Array;
  shapes: ShapeData[];
}

/** Builds every shape once for `count` particles (deterministic). */
export function createParticleShapes(count: number): ParticleShapes {
  const sphere = createSpherePoints(count, mulberry32(42));
  const shapes = [
    createGlobeShape(count, sphere.rands, sphere.positions),
    createBarsShape(count, mulberry32(1337)),
    createNeuralShape(count, mulberry32(2024)),
    createWebShape(count, mulberry32(777)),
    createNewsShape(count, mulberry32(31)),
  ];
  const extra = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    extra[i * 4] = shapes[SHAPE.news].order[i];
    extra[i * 4 + 1] = shapes[SHAPE.neural].flag?.[i] ?? 0;
    extra[i * 4 + 2] = shapes[SHAPE.news].flag?.[i] ?? 0;
    extra[i * 4 + 3] = shapes[SHAPE.news].aux?.[i] ?? 0;
  }
  return {
    extra,
    shapes,
    starts: sphere.starts,
    rands: sphere.rands,
  };
}
