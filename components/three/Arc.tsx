"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type ComponentRef, useMemo, useRef } from "react";
import * as THREE from "three";
import { createArcCurve, type GeoPoint, latLonToVector3 } from "@/lib/globe";

const MAX_OPACITY = 0.8;
const TRAIL = [0, 0.03, 0.06];
const COLOR_A = new THREE.Color("#3EE6C1");
const COLOR_B = new THREE.Color("#5B8CFF");

interface ArcProps {
  from: THREE.Vector3;
  target: GeoPoint;
  /** When true the arc fades out. */
  dying: boolean;
  animated: boolean;
}

/** A glowing Bezier arc with a data packet (and short trail) traveling along it. */
export default function Arc({ from, target, dying, animated }: ArcProps) {
  const lineRef = useRef<ComponentRef<typeof Line>>(null);
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const opacity = useRef(animated ? 0 : MAX_OPACITY);
  const clock = useRef(0);

  const { curve, points, colors, offset } = useMemo(() => {
    const to = latLonToVector3(target.lat, target.lon);
    const curve = createArcCurve(from, to);
    const points = curve.getPoints(64);
    const colors = points.map((_, i) => COLOR_A.clone().lerp(COLOR_B, i / 64).toArray());
    return { curve, points, colors, offset: Math.abs((from.x * 7 + to.y * 13) % 1) };
  }, [from, target]);

  useFrame((_, delta) => {
    if (!animated) return;
    clock.current += delta;
    opacity.current = THREE.MathUtils.damp(opacity.current, dying ? 0 : MAX_OPACITY, 3, delta);

    const material = lineRef.current?.material as THREE.Material | undefined;
    if (material) material.opacity = opacity.current;

    const head = (clock.current * 0.32 + offset) % 1;
    TRAIL.forEach((lag, i) => {
      const mesh = packets.current[i];
      if (!mesh) return;
      const t = head - lag;
      mesh.visible = t > 0;
      if (t > 0) mesh.position.copy(curve.getPoint(t));
      (mesh.material as THREE.MeshBasicMaterial).opacity =
        (opacity.current / MAX_OPACITY) * (1 - i * 0.3);
    });
  });

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        vertexColors={colors as [number, number, number][]}
        lineWidth={1.4}
        transparent
        opacity={animated ? 0 : MAX_OPACITY}
        depthWrite={false}
        toneMapped={false}
      />
      {animated &&
        TRAIL.map((_, i) => (
          <mesh
            key={i}
            ref={(m) => {
              packets.current[i] = m;
            }}
            visible={false}
          >
            <sphereGeometry args={[0.014 - i * 0.003, 10, 10]} />
            <meshBasicMaterial color="#B6FFF0" transparent toneMapped={false} />
          </mesh>
        ))}
    </group>
  );
}
