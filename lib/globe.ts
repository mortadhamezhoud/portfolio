import * as THREE from "three";
import globeData from "@/data/globe.json";
import type { GlobeConfig, GlobeRegion } from "@/lib/types";

export const globeConfig: GlobeConfig = globeData as GlobeConfig;

export type Rng = () => number;

/** Small deterministic PRNG so render-time geometry is pure and reproducible. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEG = Math.PI / 180;

export function latLonToVector3(lat: number, lon: number, radius = 1): THREE.Vector3 {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export interface GeoPoint {
  lat: number;
  lon: number;
}

function angularDistanceDeg(a: GeoPoint, b: GeoPoint): number {
  const va = latLonToVector3(a.lat, a.lon);
  const vb = latLonToVector3(b.lat, b.lon);
  return va.angleTo(vb) / DEG;
}

/** Random point inside a region, at least `minDistanceDeg` away from the origin. */
export function generateTarget(
  region: GlobeRegion,
  rng: Rng,
  config: GlobeConfig = globeConfig,
): GeoPoint {
  let point: GeoPoint = { lat: region.lat[0], lon: region.lon[0] };
  for (let i = 0; i < 20; i++) {
    point = {
      lat: region.lat[0] + rng() * (region.lat[1] - region.lat[0]),
      lon: region.lon[0] + rng() * (region.lon[1] - region.lon[0]),
    };
    if (angularDistanceDeg(config.origin, point) >= config.minDistanceDeg) break;
  }
  return point;
}

export interface ArcData {
  id: number;
  regionId: string;
  target: GeoPoint;
}

/** Initial arcs: one per region first (every continent), then extra regions in order. */
export function generateInitialArcs(rng: Rng, config: GlobeConfig = globeConfig): ArcData[] {
  return Array.from({ length: config.arcCount }, (_, i) => {
    const region = config.regions[i % config.regions.length];
    return { id: i, regionId: region.id, target: generateTarget(region, rng, config) };
  });
}

/** Cubic Bézier rising above the sphere between two surface points. */
export function createArcCurve(from: THREE.Vector3, to: THREE.Vector3): THREE.CubicBezierCurve3 {
  const angle = from.angleTo(to);
  const lift = 1 + 0.12 + 0.32 * (angle / Math.PI);
  const c1 = from.clone().lerp(to, 0.33).normalize().multiplyScalar(lift);
  const c2 = from.clone().lerp(to, 0.66).normalize().multiplyScalar(lift);
  return new THREE.CubicBezierCurve3(from, c1, c2, to);
}

/** Evenly distributed points on a unit sphere (Fibonacci lattice, lightly jittered). */
export function createSpherePoints(count: number, rng: Rng) {
  const positions = new Float32Array(count * 3);
  const starts = new Float32Array(count * 3);
  const rands = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const theta = i * golden;
    const jitter = 1 + (rng() - 0.5) * 0.02;
    positions.set([Math.cos(theta) * r * jitter, y * jitter, Math.sin(theta) * r * jitter], i * 3);

    // Random start: a point far from the sphere, in a random direction
    const u = rng() * 2 - 1;
    const phi = rng() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const dist = 2.5 + rng() * 3.5;
    starts.set([s * Math.cos(phi) * dist, u * dist, s * Math.sin(phi) * dist], i * 3);
    rands[i] = rng();
  }
  return { positions, starts, rands };
}
