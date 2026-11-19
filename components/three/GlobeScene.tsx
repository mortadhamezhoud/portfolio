"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { globeConfig, latLonToVector3 } from "@/lib/globe";
import { readScrollMorph, sceneState } from "@/lib/scene-state";
import GlobeArcs from "./GlobeArcs";
import GlobeParticles, { type MouseState } from "./GlobeParticles";

const BASE_TILT = 0.25;
const SPIN_SPEED = 0.06; // rad/s
const MORPH_DAMPING = 3.2;

/** Pose of the particle group for the bars, plus a slight camera change (cinematic feel). */
const BARS_POSE = { tiltX: 0.36, yaw: -0.4 };
const CAMERA = [
  { distance: 3.6, height: 0 },
  { distance: 5.2, height: 0.5 },
];

interface GlobeSceneProps {
  particleCount: number;
  particleSize: number;
  animated: boolean;
  /** True when the 3D sits on the right half of the screen (desktop hero layout). */
  offsetRight: boolean;
}

/** Tunis-facing yaw so the origin is on the visible side when the scene starts. */
const originVector = latLonToVector3(globeConfig.origin.lat, globeConfig.origin.lon);
const START_YAW = -Math.atan2(originVector.x, originVector.z);

export default function GlobeScene({
  particleCount,
  particleSize,
  animated,
  offsetRight,
}: GlobeSceneProps) {
  const { gl, invalidate } = useThree();
  const root = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const mouse = useRef<MouseState>({ point: new THREE.Vector3(10, 10, 10), active: 0 });
  const pointer = useRef({ x: 0, y: 0, ndc: new THREE.Vector2(), inside: false });
  const spinAngle = useRef(START_YAW);
  const [scratch] = useState(() => ({
    raycaster: new THREE.Raycaster(),
    sphere: new THREE.Sphere(new THREE.Vector3(), 1),
    hit: new THREE.Vector3(),
  }));

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

  // Reduced motion renders on demand: redraw when the scroll position changes
  useEffect(() => {
    if (animated) return;
    window.addEventListener("scroll", invalidate as () => void, { passive: true });
    return () => window.removeEventListener("scroll", invalidate as () => void);
  }, [animated, invalidate]);

  useFrame((state, delta) => {
    const { camera, size } = state;
    const aspect = size.width / size.height;

    // Scroll -> morph progress (damped; snapped with reduced motion)
    const target = readScrollMorph();
    sceneState.morph = animated
      ? THREE.MathUtils.damp(sceneState.morph, target, MORPH_DAMPING, delta)
      : target;
    const m = sceneState.morph;
    sceneState.globe = 1 - THREE.MathUtils.smoothstep(m, 0, 0.45);

    // Camera: distance/height per shape. Narrow canvases back off to keep everything visible.
    const fit = Math.max(1, 0.85 / aspect);
    camera.position.set(
      0,
      THREE.MathUtils.lerp(CAMERA[0].height, CAMERA[1].height, m),
      THREE.MathUtils.lerp(CAMERA[0].distance, CAMERA[1].distance, m) * fit,
    );
    camera.lookAt(0, 0, 0);

    if (!root.current || !tilt.current || !spin.current) return;

    // Hero layout: the shape sits on the right half of the screen on desktop
    const halfWidth = Math.tan(THREE.MathUtils.degToRad(45 / 2)) * camera.position.z * aspect;
    root.current.position.x = offsetRight ? 0.36 * halfWidth : 0;

    if (!animated) {
      tilt.current.rotation.x = THREE.MathUtils.lerp(BASE_TILT, BARS_POSE.tiltX, m);
      spin.current.rotation.y = THREE.MathUtils.lerp(START_YAW, BARS_POSE.yaw, m);
      return;
    }

    const p = pointer.current;
    // Slow spin (fades out as the globe turns into bars) + damped orientation toward the mouse
    spinAngle.current += delta * SPIN_SPEED * sceneState.globe;
    const wrapped = THREE.MathUtils.euclideanModulo(spinAngle.current + Math.PI, Math.PI * 2) - Math.PI;
    spin.current.rotation.y = THREE.MathUtils.lerp(wrapped, BARS_POSE.yaw, m);
    const mouseTiltX = (BASE_TILT - p.y * 0.3) * sceneState.globe;
    tilt.current.rotation.x = THREE.MathUtils.damp(
      tilt.current.rotation.x,
      THREE.MathUtils.lerp(mouseTiltX, BARS_POSE.tiltX, m),
      2.5,
      delta,
    );
    tilt.current.rotation.y = THREE.MathUtils.damp(
      tilt.current.rotation.y,
      p.x * 0.4 * (0.4 + 0.6 * sceneState.globe),
      2.5,
      delta,
    );

    // Cursor position on the sphere, in the spinning group's local space
    mouse.current.active = 0;
    if (p.inside && sceneState.globe > 0.5) {
      scratch.sphere.center.copy(root.current.position);
      scratch.raycaster.setFromCamera(p.ndc, camera);
      if (scratch.raycaster.ray.intersectSphere(scratch.sphere, scratch.hit)) {
        spin.current.worldToLocal(mouse.current.point.copy(scratch.hit));
        mouse.current.active = 1;
      }
    }
  });

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
