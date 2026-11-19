"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { sceneState } from "@/lib/scene-state";
import { createParticleShapes, SHAPE_COUNT } from "@/lib/shapes";
import { particleFragmentShader, particleVertexShader } from "./shaders";

const ENTRY_SECONDS = 1.5;

export interface MouseState {
  /** Cursor position in the globe's local space. */
  point: THREE.Vector3;
  /** 1 when the cursor is over the globe, 0 otherwise. */
  active: number;
}

interface ParticlesProps {
  count: number;
  size: number;
  animated: boolean;
  mouseRef: React.RefObject<MouseState>;
}

/** The single particle system: every shape is a set of target positions it morphs between. */
export default function GlobeParticles({ count, size, animated, mouseRef }: ParticlesProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();
  const { starts, rands, shapes } = useMemo(() => createParticleShapes(count), [count]);
  // The per-shape orders are packed in one vec4
  const order = useMemo(() => {
    const out = new Float32Array(count * SHAPE_COUNT);
    for (let i = 0; i < count; i++)
      for (let k = 0; k < SHAPE_COUNT; k++) out[i * SHAPE_COUNT + k] = shapes[k].order[i];
    return out;
  }, [count, shapes]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: animated ? 0 : 1 },
      uMorph: { value: 0 },
      uFrom: { value: 0 },
      uTo: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: size },
      uRef: { value: 3.5 },
      uMouse: { value: new THREE.Vector3(10, 10, 10) },
      uMouseActive: { value: 0 },
    }),
    [animated, size],
  );

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uRef.value = state.camera.position.z;
    u.uMorph.value = sceneState.morph;
    u.uFrom.value = sceneState.from;
    u.uTo.value = sceneState.to;
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
        {shapes.map((shape, k) => (
          <bufferAttribute
            key={`pos${k}`}
            attach={k === 0 ? "attributes-position" : `attributes-aShape${k}`}
            args={[shape.positions, 3]}
          />
        ))}
        {shapes.map((shape, k) => (
          <bufferAttribute key={`col${k}`} attach={`attributes-aColor${k}`} args={[shape.colors, 3]} />
        ))}
        <bufferAttribute attach="attributes-aOrder" args={[order, SHAPE_COUNT]} />
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
