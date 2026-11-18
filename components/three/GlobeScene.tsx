"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { globeConfig, latLonToVector3 } from "@/lib/globe";
import GlobeArcs from "./GlobeArcs";
import GlobeParticles, { type MouseState } from "./GlobeParticles";

const BASE_TILT = 0.25;
const SPIN_SPEED = 0.06; // rad/s
const CAMERA_DISTANCE = 3.6;

interface GlobeSceneProps {
  particleCount: number;
  particleSize: number;
  animated: boolean;
}

/** Tunis-facing yaw so the origin is on the visible side when the scene starts. */
const originVector = latLonToVector3(globeConfig.origin.lat, globeConfig.origin.lon);
const START_YAW = -Math.atan2(originVector.x, originVector.z);

export default function GlobeScene({ particleCount, particleSize, animated }: GlobeSceneProps) {
  const { gl } = useThree();
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const mouse = useRef<MouseState>({ point: new THREE.Vector3(10, 10, 10), active: 0 });
  const pointer = useRef({ x: 0, y: 0, ndc: new THREE.Vector2(), inside: false });
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

  useFrame((state, delta) => {
    // Keep the whole globe visible on narrow (portrait) canvases
    const aspect = state.size.width / state.size.height;
    state.camera.position.z = CAMERA_DISTANCE * Math.max(1, 0.85 / aspect);

    if (!animated || !tilt.current || !spin.current) return;
    const p = pointer.current;

    // Slow spin + damped orientation toward the mouse
    spin.current.rotation.y += delta * SPIN_SPEED;
    tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, BASE_TILT - p.y * 0.3, 2.5, delta);
    tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, p.x * 0.4, 2.5, delta);

    // Cursor position on the sphere, in the spinning group's local space
    mouse.current.active = 0;
    if (p.inside) {
      scratch.raycaster.setFromCamera(p.ndc, state.camera);
      if (scratch.raycaster.ray.intersectSphere(scratch.sphere, scratch.hit)) {
        spin.current.worldToLocal(mouse.current.point.copy(scratch.hit));
        mouse.current.active = 1;
      }
    }
  });

  return (
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
  );
}
