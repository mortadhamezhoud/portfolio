"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { globeConfig, latLonToVector3 } from "@/lib/globe";
import { applyTimeline, buildTimeline, type Keyframe, sceneState } from "@/lib/scene-state";
import GlobeArcs from "./GlobeArcs";
import GlobeParticles, { type MouseState } from "./GlobeParticles";

const BASE_TILT = 0.25;
const SPIN_SPEED = 0.06; // rad/s
const SCROLL_DAMPING = 7;

/**
 * Per-shape pose of the particle group + camera angle/distance (slight cinematic move
 * between shapes). Indexed like SHAPE: globe, bars, neural, web, news.
 */
const POSES = [
  { tiltX: BASE_TILT, yaw: 0, camZ: 3.6, camY: 0, camX: 0 },
  { tiltX: 0.36, yaw: -0.4, camZ: 5.2, camY: 0.5, camX: -0.3 },
  { tiltX: 0.1, yaw: -0.3, camZ: 6.2, camY: 0.1, camX: 0.35 },
  { tiltX: 0.2, yaw: -0.62, camZ: 5.8, camY: 0.2, camX: -0.35 },
  { tiltX: 0.1, yaw: -0.3, camZ: 5.6, camY: 0.1, camX: 0.25 },
];
type PoseKey = "tiltX" | "yaw" | "camZ" | "camY" | "camX";

/** Placement: "big" next to the text, "ambient" small, blurred and dim in the background. */
const LAYOUT = {
  desktop: {
    big: { x: 0.36, y: 0, scale: 1, opacity: 1 },
    ambient: { x: 0.98, y: 0, scale: 0.4, opacity: 0.3 },
  },
  mobile: {
    big: { x: 0, y: 0.22, scale: 0.8, opacity: 0.75 },
    compact: { x: 0, y: 0.5, scale: 0.55, opacity: 1 },
    ambient: { x: 0, y: 0, scale: 0.7, opacity: 0.3 },
  },
};
type LayoutKey = "x" | "y" | "scale" | "opacity";
const AMBIENT_BLUR = 2.5; // px

interface GlobeSceneProps {
  particleCount: number;
  particleSize: number;
  animated: boolean;
}

/** Reused every frame (single canvas), so the raycast allocates nothing. */
const scratch = {
  raycaster: new THREE.Raycaster(),
  sphere: new THREE.Sphere(new THREE.Vector3(), 1),
  hit: new THREE.Vector3(),
};

/** Tunis-facing yaw so the origin is on the visible side when the scene starts. */
const originVector = latLonToVector3(globeConfig.origin.lat, globeConfig.origin.lon);
const START_YAW = -Math.atan2(originVector.x, originVector.z);

export default function GlobeScene({ particleCount, particleSize, animated }: GlobeSceneProps) {
  const { gl, invalidate } = useThree();
  const root = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const mouse = useRef<MouseState>({ point: new THREE.Vector3(10, 10, 10), active: 0 });
  const pointer = useRef({ x: 0, y: 0, ndc: new THREE.Vector2(), inside: false });
  const spinAngle = useRef(START_YAW);
  const timeline = useRef<Keyframe[]>([]);
  const smoothY = useRef(0);
  const applied = useRef({ opacity: -1, blur: -1 });

  useEffect(() => {
    if (!animated) return;
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      const p = pointer.current;
      p.ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      p.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.y = -((e.clientY / window.innerHeight) * 2 - 1);
      p.inside = true;
    };
    const onLeave = () => {
      pointer.current.inside = false;
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [animated, gl]);

  // Scroll timeline from the sections in the DOM (rebuilt on resize / content height change)
  useEffect(() => {
    const rebuild = () => {
      timeline.current = buildTimeline();
      invalidate();
    };
    rebuild();
    const observer = new ResizeObserver(rebuild);
    observer.observe(document.body);
    window.addEventListener("resize", rebuild);
    const late = window.setTimeout(rebuild, 1200); // after fonts / images settle
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", rebuild);
      window.clearTimeout(late);
    };
  }, [invalidate]);

  // Reduced motion renders on demand: redraw when the scroll position changes
  useEffect(() => {
    if (animated) return;
    const redraw = () => invalidate();
    window.addEventListener("scroll", redraw, { passive: true });
    return () => window.removeEventListener("scroll", redraw);
  }, [animated, invalidate]);

  useFrame((state, delta) => {
    const { camera, size } = state;
    const aspect = size.width / size.height;
    const mobile = size.width < 1024;

    // Smoothed scroll -> scene state (shape pair, morph, zone). No allocation.
    smoothY.current = animated
      ? THREE.MathUtils.damp(smoothY.current, window.scrollY, SCROLL_DAMPING, delta)
      : window.scrollY;
    if (timeline.current.length > 1) applyTimeline(timeline.current, smoothY.current);
    const m = sceneState.morph;
    const from = POSES[sceneState.from];
    const to = POSES[sceneState.to];
    const mix = (k: PoseKey) => THREE.MathUtils.lerp(from[k], to[k], m);

    // Camera: distance/height/side per shape. Narrow canvases back off to keep everything visible.
    const fit = Math.max(1, 0.85 / aspect);
    camera.position.set(mix("camX"), mix("camY"), mix("camZ") * fit);
    camera.lookAt(0, 0, 0);

    if (!root.current || !tilt.current || !spin.current) return;

    // Placement: big next to the text, or small in the background
    const layout = mobile ? LAYOUT.mobile : LAYOUT.desktop;
    const z = sceneState.zone;
    const halfH = Math.tan(THREE.MathUtils.degToRad(45 / 2)) * camera.position.z;
    const halfW = halfH * aspect;
    const compact = mobile ? sceneState.compact : 0;
    const bigK = (k: LayoutKey) =>
      mobile ? THREE.MathUtils.lerp(LAYOUT.mobile.big[k], LAYOUT.mobile.compact[k], compact) : layout.big[k];
    const place = (k: LayoutKey) => THREE.MathUtils.lerp(layout.ambient[k], bigK(k), z);
    root.current.position.set(place("x") * halfW, place("y") * halfH, 0);
    root.current.scale.setScalar(place("scale"));

    // Dim + blur the canvas in ambient mode (only touched when the value really changed)
    const opacity = Math.round(place("opacity") * 100) / 100;
    const blur = Math.round(AMBIENT_BLUR * (1 - z) * 2) / 2;
    if (applied.current.opacity !== opacity) {
      state.gl.domElement.style.opacity = String(opacity);
      applied.current.opacity = opacity;
    }
    if (applied.current.blur !== blur) {
      state.gl.domElement.style.filter = blur > 0 ? `blur(${blur}px)` : "";
      applied.current.blur = blur;
    }

    const globeW = sceneState.globe;
    if (!animated) {
      tilt.current.rotation.x = mix("tiltX");
      spin.current.rotation.y = THREE.MathUtils.lerp(mix("yaw"), START_YAW, globeW);
      return;
    }

    const p = pointer.current;
    // Slow spin on the globe, blending into the fixed pose of the other shapes, plus a damped tilt toward the mouse
    spinAngle.current += delta * SPIN_SPEED * globeW;
    const wrapped = THREE.MathUtils.euclideanModulo(spinAngle.current + Math.PI, Math.PI * 2) - Math.PI;
    spin.current.rotation.y = THREE.MathUtils.lerp(mix("yaw"), wrapped, globeW);
    tilt.current.rotation.x = THREE.MathUtils.damp(
      tilt.current.rotation.x,
      mix("tiltX") - p.y * 0.3 * globeW,
      2.5,
      delta,
    );
    tilt.current.rotation.y = THREE.MathUtils.damp(
      tilt.current.rotation.y,
      p.x * 0.4 * (0.4 + 0.6 * globeW),
      2.5,
      delta,
    );

    // Cursor position on the sphere, in the spinning group local space
    mouse.current.active = 0;
    if (p.inside && globeW > 0.5 && z > 0.5) {
      scratch.sphere.center.copy(root.current.position);
      scratch.sphere.radius = root.current.scale.x;
      scratch.raycaster.setFromCamera(p.ndc, camera);
      if (scratch.raycaster.ray.intersectSphere(scratch.sphere, scratch.hit)) {
        spin.current.worldToLocal(mouse.current.point.copy(scratch.hit));
        mouse.current.active = 1;
      }
    }
  }, -1); // negative priority: runs before the particles read sceneState (matters with frameloop="demand")

  return (
    <group ref={root}>
      <group ref={tilt} rotation={[BASE_TILT, 0, 0]}>
        <group ref={spin} rotation={[0, START_YAW, 0]}>
          <GlobeParticles
            count={particleCount}
            size={particleSize}
            animated={animated}
            mouseRef={mouse}
          />
          <GlobeArcs animated={animated} />
        </group>
      </group>
    </group>
  );
}
