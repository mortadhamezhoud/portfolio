"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createSpherePoints, mulberry32 } from "@/lib/globe";
import { particleFragmentShader, particleVertexShader } from "./shaders";

const ENTRY_SECONDS = 1.5;

export interface MouseState {
  /** Cursor position in the globe's local space. */
  point: THREE.Vector3;
  /** 1 when the cursor is over the globe, 0 otherwise. */
  active: number;
}

interface GlobeParticlesProps {
  count: number;
  size: number;
  animated: boolean;
  mouseRef: React.RefObject<MouseState>;
}

export default function GlobeParticles({ count, size, animated, mouseRef }: GlobeParticlesProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();
  const { positions, starts, rands } = useMemo(
    () => createSpherePoints(count, mulberry32(42)),
    [count],
  );
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: animated ? 0 : 1 },
      uPixelRatio: { value: 1 },
      uSize: { value: size },
      uRef: { value: 3.5 },
      uMouse: { value: new THREE.Vector3(10, 10, 10) },
      uMouseActive: { value: 0 },
      uColorA: { value: new THREE.Color("#3EE6C1") },
      uColorB: { value: new THREE.Color("#5B8CFF") },
    }),
    [animated, size],
  );

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uRef.value = state.camera.position.z;
    if (!animated) return;
    u.uTime.value += delta;
    u.uProgress.value = Math.min(u.uProgress.value + delta / ENTRY_SECONDS, 1);
    const mouse = mouseRef.current;
    u.uMouse.value.copy(mouse.point);
    u.uMouseActive.value = THREE.MathUtils.damp(u.uMouseActive.value, mouse.active, 8, delta);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aStart" args={[starts, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[rands, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
