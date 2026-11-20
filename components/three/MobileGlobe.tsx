"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import GlobeArcs from "./GlobeArcs";
import GlobeParticles, { type MouseState } from "./GlobeParticles";

const PARTICLES = 800;
const FPS = 30;
const SPIN_SPEED = 0.08; // rad/s
const TILT = 0.25;

/** Renders at most 30 fps, and only while the canvas is on screen and the tab is visible. */
function FrameDriver({ onLost }: { onLost: () => void }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    let onScreen = true;
    const tick = () => {
      if (onScreen && !document.hidden) invalidate();
    };
    const timer = window.setInterval(tick, 1000 / FPS);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    observer.observe(el);
    const lost = (e: Event) => {
      e.preventDefault();
      onLost();
    };
    el.addEventListener("webglcontextlost", lost);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      el.removeEventListener("webglcontextlost", lost);
    };
  }, [gl, invalidate, onLost]);

  return null;
}

function Globe() {
  const spin = useRef<THREE.Group>(null);
  const mouse = useRef<MouseState>({ point: new THREE.Vector3(10, 10, 10), active: 0 });
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * SPIN_SPEED;
  });
  return (
    <group position={[0, 0.2, 0]} scale={0.85}>
      <group rotation={[TILT, 0, 0]}>
        <group ref={spin} rotation={[0, -0.6, 0]}>
          <GlobeParticles count={PARTICLES} size={3.8} animated mouseRef={mouse} />
          <GlobeArcs animated />
        </group>
      </group>
    </group>
  );
}

/**
 * Phone version of the globe: one simple, slowly spinning globe. No scroll morphing, no
 * post-processing, 800 particles, pixel ratio capped at 1.5, 30 fps.
 */
export default function MobileGlobe({ onLost, onReady }: { onLost: () => void; onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="demand"
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      style={{ opacity: 0.75 }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <FrameDriver onLost={onLost} />
      <Globe />
    </Canvas>
  );
}
